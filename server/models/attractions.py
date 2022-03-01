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
                '_images': " ".join(list(filter(lambda x: x != None, [f"https{s}" if s.find('jpg') > 0 or s.find('JPG') > 0 or s.find('png') > 0 or s.find(
                    'PNG') > 0 else None for idx, s in enumerate(attraction['file'].split('http'))])))
            }

            # should be 319 row counts # test OK
            affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_params)

        return affected_rows
