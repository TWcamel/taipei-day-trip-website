from flask import Blueprint, render_template
import database.db as db

day_trip_attractions = Blueprint(
    "day_trip_attractions", __name__, template_folder="../client")


@day_trip_attractions.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@day_trip_attractions.route("/attractions/test")
def test():
    with db.DB() as _db:
        sql_cmd = "SELECT 1 FROM dual"
        res = _db.fetch_db(sql_cmd, is_fetch_one=False)
        print(res)

    return {"OK": True}
