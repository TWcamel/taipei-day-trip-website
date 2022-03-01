from flask import *
import configparser
from controllers.home import day_trip_home
from controllers.attractions import day_trip_attractions
from controllers.booking import day_trip_booking
from models import attractions

config = configparser.ConfigParser()
config.read('config/flask.ini')
config = config['flask']

app = Flask(__name__, static_folder="../client", static_url_path="/")
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

app.register_blueprint(day_trip_home)
app.register_blueprint(day_trip_attractions)
app.register_blueprint(day_trip_booking)

if __name__ == "__main__":
    app.run(debug=True, port=int(config['port']), host=config['host'])
