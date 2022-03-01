import database.db as db
from utils.read_json_file import read_attractions_json_file


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

            images = list(filter(lambda x: x != None, [f"https{s}" if s.find('jpg') > 0 or s.find('JPG') > 0 or s.find('png') > 0 or s.find(
                'PNG') > 0 else None for idx, s in enumerate(attraction['file'].split('http'))]))

            for image in images:

                sql_params = {
                    '_image': image,
                    '_attractions_id': attraction['_id']
                }

                # 1573 counts # OK
                affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_params)

    return affected_rows
