from flask import Blueprint, render_template, request
import database.db as db
import utils.response as response
import models.attractions as attractions
import models.attractions_image as attractions_image
import sys
import logging
import traceback


day_trip_attractions = Blueprint(
    "day_trip_attractions", __name__, template_folder="../client")


@day_trip_attractions.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@response.json_response_with_cors
@day_trip_attractions.route("/api/attractions", methods=["GET"])
def get_attraction_by_page():
    params = request.args.to_dict()

    res = {}

    page = int(params['page']) if 'page' in params else 0
    keyword = params['keyword'] if 'keyword' in params else '%'

    max_attractions_id = attractions.get_max_attraction_id()

    try:
        attractions_list = attractions.get_attraction_by_range_and_keyword(
            start=page*12, end=page*12+11, keyword=keyword)

        res['data'] = attractions_list

        for attraction in res['data']:

            images = attractions_image.get_image_by_id(
                id=attraction['id'])

            attraction['images'] = [next(iter(tuple(image)))
                                    for image in images]

        res['nextPage'] = page + \
            1 if len(res['data']) > 0 and page < max_attractions_id else None

    except:
        logging.error(traceback.format_exc())
        return {'error': True, 'message': '伺服器內部錯誤'}

    return res


@response.json_response_with_cors
@day_trip_attractions.route("/api/attraction/<attractionId>", methods=["GET"])
def get_attraction_by_attraction_id(attractionId):
    res = {}
    attractionId = int(attractionId)

    try:
        attraction = attractions.get_attraction_by_id(id=attractionId)[0]
        images = attractions_image.get_image_by_id(id=attractionId)
        attraction['images'] = [next(iter(tuple(image))) for image in images]
    except IndexError:
        return {'error': True, 'message': '景點編號不正確'}
    except:
        logging.error(traceback.format_exc())
        return {'error': True, 'message': '伺服器內部錯誤'}

    res['data'] = attraction

    return res
