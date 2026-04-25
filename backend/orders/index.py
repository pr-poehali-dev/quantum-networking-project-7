"""
Заказы: список заказов пользователя и поиск по номеру.
?action=list — список (авторизация обязательна)
?action=search&number=SC-2024-001 — поиск по номеру (без авторизации)
"""
import os
import json
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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


def format_order(row) -> dict:
    return {
        'id': row[0],
        'orderNumber': row[1],
        'device': row[2],
        'service': row[3],
        'status': row[4],
        'master': row[5],
        'price': row[6],
        'comment': row[7],
        'createdAt': row[8].isoformat() if row[8] else None,
        'updatedAt': row[9].isoformat() if row[9] else None,
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    if method != 'GET':
        return {'statusCode': 405, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')
    auth = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')

    if action == 'search':
        number = params.get('number', '').strip().upper()
        if not number:
            return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите номер заказа'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f'SELECT id, order_number, device, service, status, master, price, comment, created_at, updated_at FROM {t("orders")} WHERE order_number = %s',
            (number,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Заказ не найден'})}
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'order': format_order(row)})}

    if action == 'list':
        if not auth:
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не авторизован'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f'SELECT user_id FROM {t("sessions")} WHERE token = %s AND expires_at > NOW()', (auth,))
        session = cur.fetchone()
        if not session:
            conn.close()
            return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Сессия истекла'})}
        user_id = session[0]
        cur.execute(
            f'SELECT id, order_number, device, service, status, master, price, comment, created_at, updated_at FROM {t("orders")} WHERE user_id = %s ORDER BY created_at DESC',
            (user_id,)
        )
        rows = cur.fetchall()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'orders': [format_order(r) for r in rows]})}

    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Действие не найдено'})}
