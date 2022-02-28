import database.db as db
import json
import os


def read_attractions_json_file():
    file = 'taipei-attractions.json'
    json_file = os.path.join(os.path.dirname(__file__), file)
    with open(json_file, mode='r') as f:
        attractions = json.load(f)
        res = [attraction for attraction in attractions['result']['results']]
    return res


def insert_attractions_to_db():
    attractions = read_attractions_json_file()
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
            longitude,
            images
        ) VALUES (%(_id)s, %(_name)s, %(_category)s, %(_description)s, %(_address)s, %(_transport)s, %(_mrt)s, %(_latitude)s, %(_longitude)s, %(_images)s)
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
                '_longitude': attraction['longitude'],
                '_images': attraction['file']
            }

            # should be 319 row counts # test OK
            affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_params)

        return affected_rows
