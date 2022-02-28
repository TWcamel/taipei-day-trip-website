from flask import Blueprint, render_template

day_trip_attractions = Blueprint(
    "day_trip_attractions", __name__, template_folder="../client")


@day_trip_attractions.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")
