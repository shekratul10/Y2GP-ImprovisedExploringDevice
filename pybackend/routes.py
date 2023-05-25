from flask import render_template
from pybackend import app
from pybackend.models import Map, Rover, Path


@app.route('/')
def index():
    try:
        data = User.query.all()
        return render_template('index.html', data=data)
    except Exception as e:
        exc_type, exc_value, _ = sys.exc_info()
        print(f"Exception type: {exc_type}")
        print(f"Exception message: {str(exc_value)}")
        return 'An error occurred while retrieving data from the database.'
    
@app.route('/api/telemetry', methods=['GET']) # retrieves the telemetry from the rover
def getTelemetry():
    try:
    except Exception as e:

@app.route('/api/map', methods=['GET']) # retrieves processed map form rover
def getMap():
    try:
    except Exception as e:

@app.route('/api/command', methods=['GET']) #decide start stop
def Command():
    try:
    except Exception as e:

@app.route('/api/telemetry', methods=['POST']) # retrieves the telemetry from the rover
def storeTelemetry():
    try:
    except Exception as e:

@app.route('/api/map', methods=['POST']) # stores the map from the rover
def storeMap():
    try:
    except Exception as e:

@app.route('/api/path', methods=['GET']) # gives the path to the rover
def getPath():
    try:
    except Exception as e: