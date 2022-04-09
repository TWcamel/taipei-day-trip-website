from flask import Blueprint, request, session
import utils.response as response
import logging
import traceback


day_trip_orders = Blueprint("day_trip_orders", __name__, template_folder="../client")


@response.json_response
@day_trip_orders.route("/api/orders", methods=["POST"])
def make_an_order():
    if header_content_type := request.headers.get("Content-Type", None) is None:
        return {"error": True, "message": "content-type header is missing"}, 406

    if (prime := request.json["prime"]) is not None and (
        partner_key := request.json["partner_key"]
    ) is not None:
        # TODO: set json schema to db
        print(request.get_json())
    else:
        return {"error": True, "message": "prime is missing"}, 400

    return {"status": "ok"}, 200
