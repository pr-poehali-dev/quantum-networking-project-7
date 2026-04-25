"""
Программа лояльности: получение баллов и уровня пользователя.
"""
import os
import json
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
}

LEVELS = [
    {'name': 'base', 'label': 'Базовый', 'minPoints': 0, 'discount': 2},
    {'name': 'silver', 'label': 'Серебряный', 'minPoints': 500, 'discount': 5},
    {'name': 'gold', 'label': 'Золотой', 'minPoints': 2000, 'discount': 8},
    {'name': 'platinum', 'label': 'Платиновый', 'minPoints': 5000, 'discount': 12},
]

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


def get_level_info(points: int) -> dict:
    current = LEVELS[0]
    next_level = None
    for i, lvl in enumerate(LEVELS):
        if points >= lvl['minPoints']:
            current = lvl
            if i + 1 < len(LEVELS):
                next_level = LEVELS[i + 1]
    return {'current': current, 'next': next_level}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    auth = event.get('headers', {}).get('X-Authorization', '').replace('Bearer ', '')

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

    if method == 'GET':
        cur.execute(f'SELECT points, level FROM {t("loyalty")} WHERE user_id = %s', (user_id,))
        row = cur.fetchone()
        conn.close()

        points = row[0] if row else 0
        level_info = get_level_info(points)

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({
            'points': points,
            'level': level_info['current'],
            'nextLevel': level_info['next'],
            'allLevels': LEVELS,
            'progress': round((points / level_info['next']['minPoints'] * 100) if level_info['next'] else 100)
        })}

    conn.close()
    return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Не найдено'})}
