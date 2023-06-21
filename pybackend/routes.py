from flask import render_template, request, jsonify
from pybackend import app, db
from pybackend.models import Map, Rover, Node, Edge
from pybackend.util import shortestPath
import json



@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return 'An error occurred while loading the page.'
    
@app.route('/api/telemetry', methods=['GET']) # retrieves the telemetry from the rover
def getTelemetry():
    try:
        id = request.args.get('id')
        # return jsonify(buffer[int(id)])
        # id = int(data)

        telemetry = Rover.query.filter_by(id=id).first()

        return jsonify({"id":telemetry.id, "position": telemetry.get_position(), "accelerometer":telemetry.get_accelerometer(), "gyroscope": telemetry.get_gyroscope(), "steps":telemetry.steps, "state":telemetry.state}), 200
        
    except Exception as e:
        return { "status": "error", "type": type(e).__name__, "message": str(e)}, 400

@app.route('/api/map', methods=['GET']) # retrieves processed map form rover
def getMap():
    try:
        id = request.args.get('id')

        nodes = Node.query.filter_by(map_id=id).all()
        edges = Edge.query.filter_by(map_id=id).all()

        graph_data = {
            'nodes': [],
            'edges': []
        }

        for node in nodes:
            node_data = {
                'id': node.id,
                'position': {'x': node.x, 'y': node.y}
            }
            graph_data['nodes'].append(node_data)

        for edge in edges:
            edge_data = {
                'id': edge.id,
                'source': edge.source_node_id,
                'target': edge.target_node_id,
                'weight': edge.weight
                
            }
            graph_data['edges'].append(edge_data)

        return jsonify(graph_data)   
    except Exception as e:
       return { "status": "error", "type": type(e).__name__, "message": str(e)}, 400
    
@app.route('/api/map/shortestpath', methods=['GET'], endpoint='get_shortest_path') # retrieves processed map form rover
def getShortestPath():
    try:
        map_id = request.args.get('map_id')
        end_id = request.args.get('end_id')
        start_id = request.args.get('start_id')

        nodes = Node.query.filter_by(map_id=map_id).all()
        edges = Edge.query.filter_by(map_id=map_id).all()

        graph_data = {
            'nodes': [],
            'edges': []
        }

        for node in nodes:
            node_data = {
                'id': node.id,
                'position': {'x': node.x, 'y': node.y}
            }
            graph_data['nodes'].append(node_data)

        for edge in edges:
            edge_data = {
                'id': edge.id,
                'source': edge.source_node_id,
                'target': edge.target_node_id,
                'weight': edge.weight
                
            }
            graph_data['edges'].append(edge_data)

        dist, path = shortestPath(graph_data, int(start_id), int(end_id))

        return jsonify({"distances": dist, "shortest path": path})   
    except Exception as e:
       return { "status": "error", "type": type(e).__name__, "message": str(e)}, 400


@app.route('/api/telemetry/add', methods=['POST'], endpoint='new_telemetry') # retrieves the telemetry from the rover
def newTelemetry():
    try:
        data = request.get_json()
        position = data['position']
        accelerometer = data['accelerometer']
        gyroscope = data['gyroscope']
        steps = data['steps']
        state = data['state']

        rover = Rover(position=position, accelerometer=accelerometer, gyroscope=gyroscope, steps=steps, state=state)

        db.session.add(rover)
        db.session.commit() 

        return {"status": "sucess", "message": f"sucessfully initialised Rover with id={rover.id}", "id":f"{rover.id}"}, 200
    except KeyError as e:
        return jsonify({"status": "error", "message": f"missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    
@app.route('/api/telemetry/update', methods=['POST'], endpoint='update_telemetry') # retrieves the telemetry from the rover
def updateTelemetry():
    try:
        data = request.get_json()
        # buffer[data['id']] = data
        id = data['id']
        position = json.dumps(data['position'])
        accelerometer = json.dumps(data['accelerometer'])
        gyroscope = json.dumps(data['gyroscope'])
        steps = data['steps']
        state = data['state']

        rover = Rover.query.get_or_404(id)

        rover.position = position
        rover.accelerometer = accelerometer
        rover.gyroscope = gyroscope
        rover.steps = steps
        rover.state = state 

        db.session.add(rover)
        db.session.commit()

        return jsonify({"status": "success", "message": f"successfully updated Rover with id={id}"}), 200
    except KeyError as e:
        return jsonify({"status": "error", "message": f"missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400



@app.route('/api/map/add', methods=['POST'], endpoint='initialise_map' ) # stores the map from the rover
def addMap():
    try:
       data = request.get_json()
       name = data['name']

       map = Map(name=name)

       db.session.add(map)
       db.session.commit() 

       return jsonify({"status": "success", "message": f"successfully initilaised map", "id": map.id}), 200
    except KeyError as e:
        return jsonify({"status": "error", "message": f"missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/map/add_node', methods=['POST'], endpoint='add_node') # stores the map from the rover
def addNode():
    try:
       data = request.get_json()
       x = data['x']
       y = data['y']
       map_id = data['map_id']


       node = Node(x=x, y=y, map_id=map_id)

       db.session.add(node)
       db.session.commit() 

       return jsonify({"status": "success", "message": f"successfully initilaised node", "id": node.id}), 200
    except KeyError as e:
        return jsonify({"status": "error", "message": f"missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
    
@app.route('/api/map/add_edge', methods=['POST'], endpoint='add_edge') # stores the map from the rover
def addEdge():
    try:
       data = request.get_json()
       source_node_id = data['source_node_id']
       target_node_id = data['target_node_id']
       weight = data['weight']
       map_id = data['map_id']

       edge = Edge(source_node_id=source_node_id, target_node_id=target_node_id, weight=weight, map_id=map_id)

       db.session.add(edge)
       db.session.commit() 

       return jsonify({"status": "success", "message": f"successfully initilaised edge", "id": edge.id}), 200
    except KeyError as e:
        return jsonify({"status": "error", "message": f"missing key: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400
