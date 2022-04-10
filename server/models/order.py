import database.db as db


def make_an_new_order(order_info: dict) -> int or None:
    _prime = order_info.get("prime")
    _result = order_info.get("result")
    _price = order_info.get("price")
    _booking_id = order_info.get("booking_id")
    _card_name = order_info.get("card_name")
    _card_email = order_info.get("card_email")
    _card_phone = order_info.get("card_phone")

    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
        INSERT INTO orders (prime, result, booking_id, price, card_name, card_email, card_phone)
        SELECT %(_prime)s, %(_result)s, %(_booking_id)s, %(_price)s, %(_card_name)s, %(_card_email)s, %(_card_phone)s 
        FROM DUAL
        """
        sql_param = {
            "_prime": _prime,
            "_result": _result,
            "_booking_id": _booking_id,
            "_price": _price,
            "_card_name": _card_name,
            "_card_email": _card_email,
            "_card_phone": _card_phone,
        }
        affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_param)
    return affected_rows


def update_order_by_prime(order_info: dict) -> int or None:
    affected_rows = 0
    with db.DB() as _db:
        sql_cmd = """
        UPDATE orders
        SET result = %(result)s, order_id =  %(order_id)s
        WHERE prime = %(prime)s
        """
        sql_param = {
            "result": order_info["result"],
            "prime": order_info["prime"],
            "order_id": order_info["order_id"],
        }
        affected_rows += _db.crud(sql_cmd=sql_cmd, params=sql_param)
    return affected_rows


def get_order_id_by_prime(prime: str) -> str or None:
    with db.DB() as _db:
        sql_cmd = """
        SELECT order_id FROM orders
        WHERE prime = %(_prime)s
        """
        sql_param = {"_prime": prime}
        res = _db.fetch_db(sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False)
    return str(next(iter(tuple(next(iter(res))))))


def get_paid_orders_by_order_id(order_id: str) -> list or None:
    with db.DB() as _db:
        sql_cmd = """
        SELECT t.ID, t.PRIME, t.BOOKING_ID, t.price, t.order_id, t.card_name, t.card_phone, t.card_email, t.update_time
        FROM orders t
        WHERE order_id = %(order_id)s
        AND t.RESULT = 'Y'
        """
        sql_param = {"order_id": order_id}
        res = _db.fetch_db_response_column_name(
            sql_cmd=sql_cmd, params=sql_param, is_fetch_one=False
        )
    return res if len(res) > 0 else None
