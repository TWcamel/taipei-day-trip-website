from flask import Blueprint, render_template

day_trip_home = Blueprint("day_trip_home", __name__,
                          template_folder="../client")


@day_trip_home.route("/")
def index():
    return render_template("index.html")
