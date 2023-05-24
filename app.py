import sys
import traceback
import logging
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.debug = True

#logging.basicConfig(level=logging.DEBUG)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://ubuntu:VrayEpic99@localhost/Peopledb'
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    #email = db.Column(db.String(120), unique=True)

    def __init__(self, username):
        self.username = username
        #self.email = email

    def __repr__(self):
        return '<User %r>' % self.username


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

if __name__ == "__main__":
	app.run()
