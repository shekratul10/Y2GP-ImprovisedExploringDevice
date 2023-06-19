from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.debug = True



app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://ubuntu:VrayEpic99@localhost/IEDdata'

db = SQLAlchemy(app)

from pybackend import routes