import database.db as db
from utils.read_json_file import read_attractions_json_file


def create_booking_table() -> int or None:
    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
            CREATE TABLE IF NOT EXISTS booking (
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USER_ID INTEGER NOT NULL,
                CREATE_TIME TIMSTAMP DEFAULT CURRENT_TIMESTAMP,
                PRINCE BIGINT NOT NULL,
                ATTRACTION_ID INTEGER NOT NULL,
                TYPE VARCHAR(255) NOT NULL,
                FOREIGN KEY (USER_ID) REFERENCES USER(ID),
                FOREIGN KEY (ATTRACTION_ID) REFERENCES ATTRACTION(ID)
            )
        """
        affected_rows += _db.crud(sql_cmd=sql_cmd)
    return affected_rows
