from flask import Blueprint, render_template, request, session
import utils.response as response
from models import user
import sys
import logging
import traceback
import mysql.connector as mysql

day_trip_user = Blueprint("day_trip_user", __name__, template_folder="../client")

@response.json_response
@day_trip_user.route("/api/user", methods=["GET"])
def get_user():
    if 'id' in session and session.get("user_status", "not_yet_log_in") == "already_logged_in":

        user_info = user.get_user_info(session['id'])
        if user_info:
            return {'data': user_info}, 200

    return {'data': None}, 401


@response.json_response
@day_trip_user.route('/api/user', methods=["PATCH"])
def user_login():
    header_content_type = request.headers.get("Content-Type", None)

    if 'id' in session and session.get("user_status", "not_yet_log_in") == "already_logged_in":
        return {"ok": True}, 200

    if header_content_type != "application/json":
        session["user_status"] = "not_yet_log_in"
        return {"error": True, "message": "Content-type is not acceptable"}, 406

    try:
        body_info = request.get_json()
        email, password = body_info['email'], body_info['password']

        if email and password:

            user_id = user.get_user_id(email, password)

            if not user_id:
                return {"error": True, "message": "User not found"}, 400

            session['id'], session['user_status'] = user_id, "already_logged_in"
            return {"ok": True}, 200

        elif not email or not password:
            {"error": True, "message": "Missing credentials"}, 400

    except:
        logging.error(traceback.format_exc())
        return {"error": True, "message": "Internal Server Error"}, 500


@response.json_response
@day_trip_user.route('/api/user', methods=["POST"])
def user_signup():
    header_content_type = request.headers.get("Content-Type", None)

    if header_content_type != "application/json":
        session["user_status"] = "not_yet_log_in"
        return {"error": True, "message": "Content-type is not acceptable"}, 406

    try:
        body_info = request.get_json()
        name, email, password = body_info['name'], body_info['email'], body_info['password']

        if name and email and password:

            affected_rows = user.add_user(
                {"name": name, "email": email, "password": password})

            if affected_rows > 0:
                return {"ok": True}, 200

            raise mysql.errors.Error(
                f"Duplicate entry '{email}' for key 'email'")

        elif not name or not email or not password:
            {"error": True, "message": "Missing credentials"}, 400

    except mysql.errors.Error as err:
        logging.error(traceback.format_exc())

        if err.errno == mysql.errorcode.ER_DUP_ENTRY:
            session["user_status"] = "Not_yet_log_in"
            return {"error": True, "message": "Email has already exists"}, 400

        elif err.errno == mysql.errorcode.ER_PARSE_ERROR:
            return {"error": True, "message": "Invalid SQL syntax"}, 500

        return {"error": True, "message": f"MySql error code: {mysql.errorcode}"}, 500
    except:
        logging.error(traceback.format_exc())
        return {"error": True, "message": "Internal Server Error"}, 500


@response.json_response
@day_trip_user.route('/api/user', methods=["DELETE"])
def sign_out():
    session["user_status"] = "Not_yet_log_in"
    session.pop("id", None)
    return {"ok": True}, 200

@response.json_response
@day_trip_user.route('/api/user/delete', methods=["DELETE"])
def user_delete_account():
    if 'id' in session and session.get("user_status", "not_yet_log_in") == "already_logged_in":
        try:
            affected_rows = user.delete_user(session.get("id", None))

            if affected_rows > 0:
                return {"ok": True}, 200

            raise TypeError("User not found")

        except mysql.errors.Error as err:
            logging.error(traceback.format_exc())
            session["user_status"] = "Not_yet_log_in"

            if err.errno == mysql.errorcode.ER_PARSE_ERROR:
                return {"error": True, "message": "Invalid SQL syntax"}, 500

            return {"error": True, "message": f"MySql error code: {mysql.errorcode}"}, 500

        except TypeError:
            logging.error(traceback.format_exc())
            session["user_status"] = "Not_yet_log_in"
            return {"error": True, "message": "User not found"}, 400

        except:
            logging.error(traceback.format_exc())
            return {"error": True, "message": "Internal Server Error"}, 500

    return {"error": True, "message": "User not found"}, 400
