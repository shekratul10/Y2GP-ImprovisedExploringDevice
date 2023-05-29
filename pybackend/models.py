from pybackend import db
import json

class Map(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    map_array = db.Column(db.String(1000), nullable=False, default='')

    def __init__(self, map_array):
        self.map_array = json.dumps(map_array)

    def get_map_array(self):
        return json.loads(self.map_array)

    def __repr__(self):
        return '<Map %r>' % self.map_array
    
class Rover(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position= db.Column(db.String(100), nullable=False)
    velocity = db.Column(db.Integer, nullable=False, default = 0)
    steps = db.Column(db.Integer, nullable=False, default = 0)
    tilt = db.Column(db.Float, nullable=False, default = 0.0)
    state = db.Column(db.String(100), nullable=False, default="Rest")

    def __init__(self, position, velocity, steps, tilt, state):
        self.position = json.dumps(position)
        self.velocity = velocity
        self.steps = steps
        self.tilt = tilt
        self.state = state

    def get_position(self):
        return json.loads(self.position)

    def __repr__(self):
        return '<Rover %s, %s, %s, %s, %s>' % (self.position, self.velocity, self.steps, self.tilt, self.state)
    
class Path(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    directions = db.Column(db.String(255), nullable=False)

    def __init__(self, directions):
        self.directions = json.dumps(directions)

    def get_directions(self):
        return json.loads(self.directions)
    
    def __repr__(self):
        return '<Path %r>' % self.directions