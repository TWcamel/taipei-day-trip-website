from flask import Blueprint, render_template

day_trip_error = Blueprint("day_trip_error", __name__,
                           template_folder="../client")


@day_trip_error.route("/error/<error_code>")
def error(error_code):
    return {"error_code": error_code}
