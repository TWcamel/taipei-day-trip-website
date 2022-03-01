import os
import json


def read_attractions_json_file(file_name):
    file_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_file = os.path.join(file_path, f"data/{file_name}")
    with open(json_file, mode='r') as f:
        attractions = json.load(f)
        res = [attraction for attraction in attractions['result']['results']]
    return res
