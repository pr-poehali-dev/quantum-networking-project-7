"""
Авторизация: регистрация, вход, выход, подтверждение email, профиль.
Действие передаётся через query: ?action=register|login|logout|me|verify-email|update-profile
"""
import os
import json
import hashlib
import secrets
import smtplib
import psycopg2
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

_SCHEMA = None


def get_schema() -> str:
    global _SCHEMA
    if _SCHEMA is None:
        _SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
    return _SCHEMA


def t(table: str) -> str:
    return f'"{get_schema()}".{table}'


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    salt = os.environ.get('JWT_SECRET', 'default_salt_change_me')
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()


def create_token() -> str:
    return secrets.token_hex(32)


def send_email(to: str, subject: str, html: str):
    host = os.environ.get('SMTP_HOST', '')
    port = int(os.environ.get('SMTP_PORT', 587))
    user = os.environ.get('SMTP_USER', '')
    password = os.environ.get('SMTP_PASSWORD', '')
    if not host or not user:
        return
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"AppleСервис <{user}>"
    msg['To'] = to
    msg.attach(MIMEText(html, 'html', 'utf-8'))
    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.sendmail(user, to, msg.as_string())


def get_user_from_token(token: str, cur):
    cur.execute(f'SELECT user_id FROM {t("sessions")} WHERE token = %s AND expires_at > NOW()', (token,))
    row = cur.fetchone()
    return row[0] if row else None


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'me')
    body = json.loads(event.get('body') or '{}')
    auth = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')

    if action == 'register' and method == 'POST':
        name = body.get('name', '').strip()
        email = body.get('email', '').strip().lower()
        phone = body.get('phone', '').strip()
        password = body.get('password', '')
        if not name or not email or not password:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заполните все обязательные поля'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пароль должен быть не менее 6 символов'})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f'SELECT id FROM {t("users")} WHERE email = %s', (email,))
        if cur.fetchone():
            conn.close()
            return {'statusCode': 409, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Пользователь с таким email уже существует'})}

        verify_token = create_token()
        cur.execute(
            f'INSERT INTO {t("users")} (name, email, phone, password_hash, email_verify_token) VALUES (%s, %s, %s, %s, %s) RETURNING id',
            (name, email, phone, hash_password(password), verify_token)
        )
        user_id = cur.fetchone()[0]
        cur.execute(f'INSERT INTO {t("loyalty")} (user_id, points, level) VALUES (%s, 0, %s)', (user_id, 'base'))
        conn.commit()
        conn.close()

        site_url = os.environ.get('SITE_URL', '')
        verify_link = f"{site_url}/verify-email?token={verify_token}" if site_url else '#'
        try:
            send_email(email, 'Подтвердите email — AppleСервис', f"""
            <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
              <h2 style="color:#2346c0">Добро пожаловать, {name}!</h2>
              <p>Для завершения регистрации подтвердите ваш email:</p>
              <a href="{verify_link}" style="display:inline-block;padding:12px 28px;background:#2346c0;color:#fff;border-radius:10px;text-decoration:none;font-weight:bold;margin:16px 0">Подтвердить email</a>
              <p style="color:#999;font-size:12px;margin-top:24px">Если вы не регистрировались — проигнорируйте это письмо.</p>
            </div>""")
        except Exception:
            pass

        return {'statusCode': 201, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'message': 'Регистрация успешна. Проверьте email для подтверждения.'})}

    if action == 'login' and method == 'POST':
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f'SELECT id, name, email, phone, email_verified, password_hash FROM {t("users")} WHERE email = %s', (email,))
        row = cur.fetchone()
        if not row or row[5] != hash_password(password):
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный email или пароль'})}

        user_id, uname, user_email, phone, verified, _ = row
        token = create_token()
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        cur.execute(f'INSERT INTO {t("sessions")} (user_id, token, expires_at) VALUES (%s, %s, %s)', (user_id, token, expires_at))
        cur.execute(f'SELECT points, level FROM {t("loyalty")} WHERE user_id = %s', (user_id,))
        lr = cur.fetchone()
        conn.commit()
        conn.close()

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
            'token': token,
            'user': {'id': user_id, 'name': uname, 'email': user_email, 'phone': phone, 'emailVerified': verified},
            'loyalty': {'points': lr[0], 'level': lr[1]} if lr else {'points': 0, 'level': 'base'}
        })}

    if action == 'logout' and method == 'POST':
        if auth:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f'UPDATE {t("sessions")} SET expires_at = NOW() WHERE token = %s', (auth,))
            conn.commit()
            conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}

    if action == 'me' and method == 'GET':
        if not auth:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}
        conn = get_conn()
        cur = conn.cursor()
        user_id = get_user_from_token(auth, cur)
        if not user_id:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}
        cur.execute(f'SELECT id, name, email, phone, email_verified FROM {t("users")} WHERE id = %s', (user_id,))
        row = cur.fetchone()
        cur.execute(f'SELECT points, level FROM {t("loyalty")} WHERE user_id = %s', (user_id,))
        lr = cur.fetchone()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
            'user': {'id': row[0], 'name': row[1], 'email': row[2], 'phone': row[3], 'emailVerified': row[4]},
            'loyalty': {'points': lr[0], 'level': lr[1]} if lr else {'points': 0, 'level': 'base'}
        })}

    if action == 'verify-email' and method == 'GET':
        token = params.get('token', '')
        if not token:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Токен не указан'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f'UPDATE {t("users")} SET email_verified = TRUE, email_verify_token = NULL WHERE email_verify_token = %s RETURNING id', (token,))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный или устаревший токен'})}
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True, 'message': 'Email подтверждён'})}

    if action == 'update-profile' and method == 'PUT':
        if not auth:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}
        conn = get_conn()
        cur = conn.cursor()
        user_id = get_user_from_token(auth, cur)
        if not user_id:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}
        uname = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        cur.execute(f'UPDATE {t("users")} SET name = %s, phone = %s, updated_at = NOW() WHERE id = %s', (uname, phone, user_id))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Действие не найдено'})}
