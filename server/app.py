from flask import *
import configparser
from api.home import day_trip_home
from api.attractions import day_trip_attractions
from api.booking import day_trip_booking
from api.user import day_trip_user
from models import attractions_image, attractions
from time import time

config = configparser.ConfigParser()
config.read('config/flask.ini')
config = config['flask']

app = Flask(__name__, static_folder="./client", static_url_path="/")
app.secret_key = str(time())
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.register_blueprint(day_trip_home)
app.register_blueprint(day_trip_attractions)
app.register_blueprint(day_trip_booking)
app.register_blueprint(day_trip_user)

# attractions_image.delete_attraction_images()
# attractions.delete_attractions()
attractions.from_json_file_insert_attractions_to_db()
attractions_image.from_json_file_insert_into_attractions_image()

if __name__ == "__main__":
    app.run(debug=True, port=int(config['port']), host=config['host'])
