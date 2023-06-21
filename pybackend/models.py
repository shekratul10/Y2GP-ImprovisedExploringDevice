from pybackend import db
import json


class Map(db.Model):
    __tablename__ = 'maps'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True)

    def __repr__(self):
        return f"Map({self.id}, {self.name})"

class Node(db.Model):
    __tablename__ = 'nodes'

    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Integer)
    y = db.Column(db.Integer)
    map_id = db.Column(db.Integer, db.ForeignKey('maps.id'))

    map = db.relationship('Map', backref='nodes')

    def __repr__(self):
        return f"Node({self.id}, {self.x}, {self.y})"

class Edge(db.Model):
    __tablename__ = 'edges'

    id = db.Column(db.Integer, primary_key=True)
    source_node_id = db.Column(db.Integer, db.ForeignKey('nodes.id'))
    target_node_id = db.Column(db.Integer, db.ForeignKey('nodes.id'))
    weight = db.Column(db.Float)
    map_id = db.Column(db.Integer, db.ForeignKey('maps.id'))

    source_node = db.relationship('Node', foreign_keys=[source_node_id])
    target_node = db.relationship('Node', foreign_keys=[target_node_id])
    map = db.relationship('Map', backref='edges')

    def __repr__(self):
        return f"Edge({self.id}, {self.source_node_id}, {self.target_node_id}, {self.weight})"

    
class Rover(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    position= db.Column(db.String(100), nullable=False)
    accelerometer = db.Column(db.String(100), nullable=False, default = "(0,0,0)")
    gyroscope = db.Column(db.String(100), nullable=False, default="(0,0,0)")
    steps = db.Column(db.Integer, nullable=False, default = 0)
    state = db.Column(db.String(100), nullable=False, default="Rest")

    def __init__(self, position, accelerometer, gyroscope, steps, state):
        self.position = json.dumps(position)
        self.accelerometer = json.dumps(accelerometer)
        self.gyroscope = json.dumps(gyroscope)
        self.steps = steps
        self.state = state

    def get_position(self):
        self.position = self.position.replace("'", '"')
        return json.loads(self.position)

    def get_accelerometer(self):
        self.accelerometer = self.accelerometer.replace("'", '"')
        return json.loads(self.accelerometer)

    def get_gyroscope(self):
        self.gyroscope = self.gyroscope.replace("'", '"')
        return json.loads(self.gyroscope)


    def __repr__(self):
        return '<Rover %s, %s, %s, %s, %s>' % (self.position, self.accelerometer, self.gyroscope , self.steps, self.state)
    
    


