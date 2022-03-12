import functools
from flask import jsonify, make_response


def json_response(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return make_response(jsonify(func(**kwargs)), args[0])
    return wrapper


def json_response_with_cors(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        response = make_response(jsonify(func(**kwargs)), args[0])
        response.headers.add("Access-Control-Allow-Origin", "*")
    return wrapper


