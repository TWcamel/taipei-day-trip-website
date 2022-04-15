from flask import Blueprint, request, session, render_template
import utils.response as response
import logging
import traceback
from models import order as order_model
from models import booking as booking_model
import utils.requests as requests
import json
import utils.hash_utils as hu
from utils import verify as verify


day_trip_orders = Blueprint("day_trip_orders", __name__, template_folder="../client")


@day_trip_orders.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


@response.json_response
@day_trip_orders.route("/api/orders", methods=["POST"])
def make_an_order():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You are not logged in."}

    if header_content_type := request.headers.get("Content-Type", None) is None:
        return {"error": True, "message": "content-type header is missing"}, 406

    if (
        (prime := request.json["prime"]) is not None
        and (partner_key := request.json["partner_key"]) is not None
        and (merchant_id := request.json["merchant_id"]) is not None
    ):
        order_info = {}
        order_info["prime"] = prime
        order_info["card_name"] = request.json["contact"]["name"]
        order_info["card_email"] = request.json["contact"]["email"]
        order_info["card_phone"] = request.json["contact"]["phone"]
        order_info["price"] = request.json["totalPrice"]
        order_info["result"] = "N"

        order_counts = len(request.json["booking_id"])

        try:
            if (
                verfied_price := verify.verify_orders_price(
                    request.json["booking_id"], order_info["price"]
                )
            ) is False:
                return {
                    "error": True,
                    "message": "The price is not matched with the prime.",
                }
            if (order_counts) == 1:
                order_info["booking_id"] = request.json["booking_id"][0]
                order_model.make_an_new_order(order_info)
            elif (order_counts) > 1:
                for booking_id in request.json["booking_id"]:
                    order_info["booking_id"] = booking_id
                    order_model.make_an_new_order(order_info)
        except Exception as e:
            logging.error(traceback.format_exc())
            return {"error": True, "message": "Something went wrong."}, 500

        _data = {
            "prime": prime,
            "partner_key": partner_key,
            "merchant_id": merchant_id,
            "details": "TapPay Test",
            "amount": order_info["price"],
            "cardholder": {
                "phone_number": order_info["card_phone"],
                "name": order_info["card_name"],
                "email": order_info["card_email"],
            },
            "remember": True,
        }

        tappay_res = requests.Threaded(
            url="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
            method="POST",
            headers={
                "x-api-key": f"{partner_key}",
                "Content-Type": request.headers.get("Content-Type"),
            },
            data=json.dumps(_data, indent=4, sort_keys=True),
        ).run()

        try:
            if tappay_res["msg"] == "Success":
                order_info["result"] = "Y"
                order_id = order_model.get_order_id_by_prime(prime)
                order_info["order_id"] = hu.to_uuid64(f"{order_id}")
                if (affected_rows := order_model.update_order_by_prime(order_info)) > 0:
                    if order_counts == 1:
                        booking_model.update_booking_to_finished(
                            order_info["booking_id"]
                        )
                    elif order_counts > 1:
                        for booking_id in request.json["booking_id"]:
                            booking_model.update_booking_to_finished(booking_id)
                    return {
                        "OK": True,
                        "message": f"Your order id is: {order_model.get_order_id_by_prime(prime)}",
                    }, 200
                else:
                    return {
                        "error": True,
                        "message": "invalid order info, please check it again",
                    }, 400
        except Exception as e:
            logging.error(traceback.format_exc())
            return {"error": True, "message": "order update failed"}, 500
    else:
        return {"error": True, "message": "prime is missing"}, 400

    return {"ok": True, "message": "order has made successfully"}, 200


@response.json_response
@day_trip_orders.route("/api/orders", methods=["GET"])
def get_paid_orders():
    if not (
        "id" in session
        and session.get("user_status", "not_yet_log_in") == "already_logged_in"
    ):
        return {"error": True, "message": "You are not logged in."}

    if (order_id := request.args.get("order_id", None)) is not None:
        if (res := order_model.get_paid_orders_by_order_id(order_id)) is not None:
            return {"OK": True, "data": res}, 200
        else:
            return {"error": True, "message": "order not found"}, 404
    return {"error": True, "message": "order_id is missing"}, 400
