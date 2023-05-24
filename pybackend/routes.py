from flask import render_template
from pybackend import app
from pybackend.models import User


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