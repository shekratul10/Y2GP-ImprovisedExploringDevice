from pybackend import db

class Map(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    map_array = db.Column(db.PickleType(mutable=True), nullabl=False)

    def __init__(self, map_array):
        self.map_array = map_array

    def __repr__(self):
        return '<Map %r>' % self.map_array
    
class Rover(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position= db.Column(db.PickleType(mutable=True), default=(0,0))
    velocity = db.Column(db.Integer, nullable=False, default = 0)
    steps = db.Column(db.Integer, nullable=False, default = 0)
    tilt = db.Column(db.Float, nullable=False, default = 0.0)
    state = db.Column(db.String(20), nullable=False, default="Rest")

    def __init__(self, position, velocity, steps, tilt, state):
        self.position = position
        self.velocity = velocity
        self.steps = steps
        self.tilt = tilt
        self.state = state

    def __repr__(self):
        return '<Rover %s, %s, %s, %s, %s>' % self.position, self.velocity, self.steps, self.tilt, self.state 
    
class Path(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    directions = db.Column(db.PickleType(mutable=True), nullable=False)

    def __init__(self, directions):
        self.directions = directions

    def __repr__(self):
        return '<Path %r>' % self.directions