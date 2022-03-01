from controllers.attractions import day_trip_attractions


@day_trip_attractions.route("/attractions/test")
def test():
    with db.DB() as _db:
        sql_cmd = "SELECT 1 FROM dual"
        res = _db.fetch_db(sql_cmd, is_fetch_one=False)
        print(res)

    return {"OK": True}
