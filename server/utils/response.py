import functools
from flask import jsonify


def json_response(func):
    @functools.wraps(func)
    def wrapper(**kwargs):
        return jsonify(func(**kwargs))
    return wrapper


def json_response_with_cors(func):
    @functools.wraps(func)
    def wrapper(**kwargs):
        response = jsonify(func(**kwargs))
        response.headers.add("Access-Control-Allow-Origin", "*")
    return wrapper
