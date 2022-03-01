import database.db as db
from utils.read_json_file import read_attractions_json_file


def from_json_file_insert_attractions_to_db() -> int:
    attractions = read_attractions_json_file('taipei-attractions.json')
    with db.DB() as _db:
        sql_cmd = '''
        INSERT INTO attractions (
            id,
            name, category,
            description,
            address,
            transport,
            mrt,
            latitude,
            longitude
        ) VALUES (%(_id)s, %(_name)s, %(_category)s, %(_description)s, %(_address)s, %(_transport)s, %(_mrt)s, %(_latitude)s, %(_longitude)s)
        '''

        affected_rows = 0

        for attraction in attractions:
            sql_params = {
                '_id': attraction['_id'],
                '_name': attraction['stitle'],
                '_category': attraction['CAT2'],
                '_description': attraction['xbody'],
                '_address': attraction['address'],
                '_transport': attraction['info'],
                '_mrt': attraction['MRT'],
                '_latitude': attraction['latitude'],
                '_longitude': attraction['longitude']
            }

            # should be 319 row counts # test OK
            affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_params)

        return affected_rows


def get_max_attraction_id() -> int:
    with db.DB() as _db:
        sql_cmd = '''
        SELECT MAX(id) FROM attractions
        '''
        res = _db.fetch_db(sql_cmd=sql_cmd, is_fetch_one=True)
        return int(next(iter(tuple(next(iter(res))))))


def get_attraction_by_range_and_keyword(start: int, end: int, keyword: str) -> list:

    with db.DB() as _db:
        sql_cmd = '''
        SELECT T.id, T.name, T.category, T.description, T.address, T.transport, T.mrt, T.latitude, T.longitude 
        FROM attractions T
        WHERE T.id >= %(_start)s
        and T.id <= %(_end)s
        and T.name LIKE %(_keyword)s
        '''

        sql_params = {
            '_start': start,
            '_end': end,
            '_keyword': '%' + keyword + '%'
        }

        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_params, is_fetch_one=False)

    return res


def get_attraction_by_id(id: int) -> dict:

    with db.DB() as _db:
        sql_cmd = '''
        SELECT T.id, T.name, T.category, T.description, T.address, T.transport, T.mrt, T.latitude, T.longitude 
        FROM attractions T
        WHERE T.id = %(_id)s
        '''

        sql_params = {
            '_id': id,
        }

        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_params, is_fetch_one=True)

    return res
