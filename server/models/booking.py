import database.db as db


def create_a_new_booking(booking_info: str) -> int or None:
    price = booking_info["price"]
    attraction_id = booking_info["attraction_id"]
    type = booking_info["type"]
    user_id = booking_info["user_id"]
    date = booking_info["date"]

    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
            INSERT INTO booking (ATTRACTION_ID, PRICE, TYPE, USER_ID, DATE)
            VALUES (%(_ATTRACTION_ID)s, %(_PRICE)s, %(_TYPE)s, %(_USER_ID)s, %(_DATE)s)
        """
        sql_param = {
            "_PRICE": price,
            "_ATTRACTION_ID": attraction_id,
            "_TYPE": type,
            "_USER_ID": user_id,
            "_DATE": date,
        }
        affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_param)
    return affected_rows


def get_user_bookings(user_id: str) -> list[dict] or None:
    with db.DB() as _db:
        sql_cmd = """
            SELECT T.*, Q.ID, Q.NAME, Q.ADDRESS, 
                   (SELECT MAX(I.IMAGE)
                    FROM attractions_image I 
                    WHERE T.ATTRACTION_ID = I.ATTRACTIONS_ID 
                    LIMIT 1) AS IMAGE
            FROM (
                SELECT attraction_id, date, type, price, create_time, id as booking_id
                FROM booking 
                WHERE USER_ID = %(_USER_ID)s
                AND FINISHED = 'N'
            ) T, attractions Q
            WHERE T.ATTRACTION_ID = Q.ID
        """
        sql_param = {
            "_USER_ID": user_id,
        }

        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False
        )

    return res if len(res) > 0 else None


def delete_a_booking(booking_id: str) -> int:
    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
            DELETE FROM booking
            WHERE ID = %(_BOOKING_ID)s
        """
        sql_param = {
            "_BOOKING_ID": booking_id,
        }
        affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_param)
    return affected_rows


def update_booking_to_finished(booking_id: str) -> int:
    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
            UPDATE booking
            SET FINISHED = 'Y'
            WHERE ID = %(_BOOKING_ID)s
        """
        sql_param = {
            "_BOOKING_ID": booking_id,
        }
        affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_param)
    return affected_rows


def get_attraction_by_finished_booking_id(booking_id: int) -> list[dict] or None:
    with db.DB() as _db:
        sql_cmd = """
            SELECT T.*, Q.ID, Q.NAME, Q.ADDRESS, 
                   (SELECT MAX(I.IMAGE)
                    FROM attractions_image I 
                    WHERE T.ATTRACTION_ID = I.ATTRACTIONS_ID 
                    LIMIT 1) AS IMAGE
            FROM (
                SELECT attraction_id, date, type, price, create_time, id as booking_id
                FROM booking 
                WHERE ID = %(_BOOKING_ID)s
                AND FINISHED = 'Y'
            ) T, attractions Q
            WHERE T.ATTRACTION_ID = Q.ID
        """
        sql_param = {
            "_BOOKING_ID": booking_id,
        }

        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False
        )

    return res if len(res) > 0 else None


def get_price_by_booking_id(booking_id: int) -> int:
    with db.DB() as _db:
        sql_cmd = """
            SELECT PRICE
            FROM booking
            WHERE ID = %(_BOOKING_ID)s
        """
        sql_param = {
            "_BOOKING_ID": booking_id,
        }

        res = _db.fetch_db(sql_cmd=sql_cmd, params=sql_param, is_fetch_one=True)

    return int(next(iter(tuple(next(iter(res))))))


def get_booking_list_by_user_id(user_id: int) -> list[dict] or None:
    with db.DB() as _db:
        sql_cmd = """
            SELECT id
            FROM booking
            WHERE USER_ID = %(_USER_ID)s
        """
        sql_param = {
            "_USER_ID": user_id,
        }

        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False
        )

    return res if len(res) > 0 else None
