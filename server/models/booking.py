import database.db as db
from utils.read_json_file import read_attractions_json_file


def create_booking_table():
    with db.DB() as _db:
        sql_cmd = """
            CREATE TABLE IF NOT EXISTS booking (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                attraction_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id),
                FOREIGN KEY (attraction_id) REFERENCES attraction(id)
            )
        """
        _db.crud(sql_cmd=sql_cmd)
