from flask import Blueprint, request, session, render_template
import utils.response as response
from models import booking as booking_model
import logging
import traceback
import utils.verify as verify


day_trip_booking = Blueprint("day_trip_booking", __name__, template_folder="../client")


@day_trip_booking.route("/booking")
def booking():
    return render_template("booking.html")


@response.json_response
@day_trip_booking.route("/api/booking", methods=["GET"])
def get_booking_from_attraction():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You need to log in first"}, 403

    user_id = session["id"]

    try:
        booking_info = booking_model.get_user_bookings(user_id=user_id)

        if not booking_info:
            return {"erorr": True, "message": "No booking found"}, 400

        res = [
            {
                "data": {
                    "attraction": {
                        "id": booking_info["attraction_id"],
                        "name": booking_info["NAME"],
                        "address": booking_info["ADDRESS"],
                        "image": booking_info["IMAGE"],
                    },
                    "date": booking_info["date"],
                    "price": booking_info["price"],
                    "time": booking_info["type"].split("-")[1],
                    "claimTime": booking_info["create_time"],
                    "booking_id": booking_info["booking_id"],
                }
            }
            for booking_info in booking_info
        ]

        if len(res) == 1:
            res = res[0]["data"]

    except Exception as e:
        logging.error(traceback.format_exc())
        return {"error": True, "message": str(e)}, 500

    return {"data": res}, 200


@response.json_response
@day_trip_booking.route("/api/booking", methods=["POST"])
def new_booking():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You need to log in first"}, 403

    header_content_type = request.headers.get("Content-Type", None)

    if header_content_type != "application/json":
        return {"error": True, "message": "Content-type is not acceptable"}, 406

    attraction_id = request.json["attractionId"]
    booking_type = request.json["time"]
    booking_price = request.json["price"]
    booking_date = request.json["date"]

    booking_info = {
        "attraction_id": attraction_id,
        "type": booking_type,
        "price": booking_price,
        "date": booking_date,
        "user_id": session["id"],
    }

    if not verify.verify_booking_info(booking_info):
        return {"error": True, "message": "Invalid booking info"}, 400

    if (
        not booking_info["attraction_id"]
        or not booking_info["type"]
        or not booking_info["price"]
        or not booking_info["date"]
    ):
        return {"error": True, "message": "Missing required fields"}, 400

    try:
        affected_rows = booking_model.create_a_new_booking(booking_info=booking_info)

        if affected_rows > 0:
            return {"ok": True}, 200

    except ValueError:
        logging.error(traceback.format_exc())
        return {
            "error": True,
            "message": "Error happens when try to parse input, please check it and try it again.",
        }, 403
    except Exception as e:
        logging.error(traceback.format_exc())
        return {"error": True, "message": str(e)}, 500


@response.json_response
@day_trip_booking.route("/api/booking", methods=["DELETE"])
def delete_booking():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You need to log in first"}, 403

    booking_id = request.json["bookingId"]

    try:
        affected_rows = booking_model.delete_a_booking(booking_id=booking_id)
        if affected_rows > 0:
            return {"ok": True}, 200
    except Exception as e:
        logging.error(traceback.format_exc())
        return {"error": True, "message": str(e)}, 500

    return {"error": True, "message": "No booking found"}, 400


@response.json_response
@day_trip_booking.route("/api/bookings", methods=["POST"])
def get_attraction_by_finished_booking_id():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You need to log in first"}, 403

    if not request.headers.get("Content-Type", None) == "application/json":
        return {"error": True, "message": "Content-type is not acceptable"}, 406

    booking_id = request.json["bookingId"]

    try:
        booking_info = booking_model.get_attraction_by_finished_booking_id(
            booking_id=booking_id
        )

        if not booking_info:
            return {"erorr": True, "message": "No booking found"}, 400

        res = [
            {
                "data": {
                    "attraction": {
                        "id": booking_info["attraction_id"],
                        "name": booking_info["NAME"],
                        "address": booking_info["ADDRESS"],
                        "image": booking_info["IMAGE"],
                    },
                    "date": booking_info["date"],
                    "price": booking_info["price"],
                    "time": booking_info["type"].split("-")[1],
                    "claimTime": booking_info["create_time"],
                    "booking_id": booking_info["booking_id"],
                }
            }
            for booking_info in booking_info
        ]

        if len(res) == 1:
            res = res[0]["data"]

    except Exception as e:
        logging.error(traceback.format_exc())
        return {"error": True, "message": str(e)}, 500

    return {"data": res}, 200
