import database.db as db

def get_user_info(id) -> dict or None:
    sql_cmd = '''
    SELECT id, name, email 
    FROM user WHERE id = %(_id)s
    '''

    sql_params = {
        "_id": id
    }

    with db.DB() as _db:
        res = _db.fetch_db_response_column_name(sql_cmd, sql_params)
        
    return next(iter(res)) if len(res) > 0 else None

def get_user_id(email, password) -> tuple or None:

    sql_cmd = '''
        SELECT id 
        FROM user 
        WHERE email=%(_email)s and password=%(_password)s;
    '''
    sql_params = {
        "_email": email,
        "_password": password
    }

    with db.DB() as _db:
        res = _db.fetch_db(sql_cmd, sql_params)

    return tuple(next(iter(res))) if next(iter(res)) else None


def add_user(kwargs) -> int:
    sql_cmd = '''
        INSERT INTO user (name, email, password)
        VALUES (%(_name)s, %(_email)s, %(_password)s);
    '''

    sql_params = {}

    for k, v in kwargs.items():
        sql_params[f"_{k}"] = v

    affected_rows = 0

    with db.DB() as _db:
        _db.crud(sql_cmd, sql_params)

    return affected_rows


def delete_user(id) -> int:
    sql_cmd = '''
        DELETE FROM user WHERE id=%(_id)s;
    '''

    sql_params = {
        "_id": id
    }

    affected_rows = 0

    with db.DB() as _db:
        _db.crud(sql_cmd, sql_params)

    return affected_rows