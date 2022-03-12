import database.db as db
from utils.read_json_file import read_attractions_json_file
import requests
import base64


def from_json_file_insert_into_attractions_image() -> int:
    attractions = read_attractions_json_file('taipei-attractions.json')
    with db.DB() as _db:
        sql_cmd = '''
        INSERT INTO attractions_image (
            image,
            attractions_id
        ) VALUES (%(_image)s, %(_attractions_id)s)
        '''

        affected_rows = 0

        for attraction in attractions:

            images = list(filter(lambda x: x != None, [f"http{s}" if s.find('jpg') > 0 or s.find('JPG') > 0 or s.find('png') > 0 or s.find(
                'PNG') > 0 else None for idx, s in enumerate(attraction['file'].split('http'))]))

            for image in images:

                sql_params = {
                    '_image': image,
                    '_attractions_id': attraction['_id']
                }

                # 1573 counts # OK
                affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_params)

    return affected_rows


def get_image_counts() -> int:
    with db.DB() as _db:
        sql_cmd = '''
        SELECT COUNT(1) FROM attractions_image
        '''
        res = _db.fetch_db(sql_cmd=sql_cmd, is_fetch_one=True)
        return int(next(iter(tuple(next(iter(res))))))


def get_image_by_range(start: int, end: int) -> list:
    with db.DB() as _db:
        sql_cmd = '''
        SELECT * FROM attractions_image T
        WHERE T.attractions_id >= %(_start)s
        and T.attractions_id <= %(_end)s
        '''

        sql_param = {
            '_start': start,
            '_end': end
        }

        res = _db.fetch_db(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False)

    return res


def get_image_by_id(id: int) -> list:
    with db.DB() as _db:
        sql_cmd = '''
        SELECT T.image FROM attractions_image T
        WHERE T.attractions_id = %(_id)s
        '''

        sql_param = {
            '_id': id,
        }

        res = _db.fetch_db(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False)

    return res


def get_attraction_with_image_by_range(start: int, end: int) -> list:
    with db.DB() as _db:
        sql_cmd = '''
        SELECT T.id, T.name, T.category, T.description, T.address, T.transport, T.mrt, T.latitude, T.longitude, I.image FROM attractions T
        INNER JOIN attractions_image I ON T.id = I.attractions_id
        WHERE T.id >= %(_start)s
        and T.id <= %(_end)s
        '''

        sql_param = {
            '_start': start,
            '_end': end
        }

        res = _db.fetch_db(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False)

    return res

def delete_attraction_images() -> int:
    with db.DB() as _db:
        sql_cmd = '''
        DELETE FROM attractions_image
        '''

        affected_rows = _db.crud(sql_cmd=sql_cmd)

    return affected_rows
