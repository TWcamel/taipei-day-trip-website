from flask import Blueprint, render_template, request
import database.db as db
import utils.response as response
import models.attractions as attractions

day_trip_attractions = Blueprint(
    "day_trip_attractions", __name__, template_folder="../client")


@day_trip_attractions.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@response.json_response
@day_trip_attractions.route("/api/attractions/test", methods=["GET"])
def get_attraction_by_page():
    params = request.args.to_dict()

    # TODO: error handling
    if 'page' not in params:
        {"Fail": True}
    if params['page'] < 0:
        {"Fail": True}
    
    res = {}

    page = params['page']
    keyword = params['keyword'] if 'keyword' in params else ''

    max_page = attractions.get_max_id()

    res['nextPage'] = page + 1 if max_page < page else max_page

    

    return {"OK": True}
