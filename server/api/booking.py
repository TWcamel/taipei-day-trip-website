from flask import Blueprint, render_template
import utils.response as response

day_trip_booking = Blueprint("day_trip_booking", __name__, template_folder="../client")


@day_trip_booking.route("/booking")
def booking():
    return render_template("booking.html")


@day_trip_booking.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


@response.json_response
@day_trip_booking.route("/api/booking", method=["GET"])
def get_booking_from_attraction():
    return {"booking": "booking"}


@response.json_response
@day_trip_booking.route("/api/booking", method=["POST"])
def new_booking():
    return {"booking": "booking"}


@response.json_response
@day_trip_booking.route("/api/booking", method=["DELETE"])
def delete_booking():
    return {"booking": "booking"}
