import sys
import heapq

def shortestPath(graph_data, start_node_id, end_node_id):
    nodes = graph_data['nodes']
    edges = graph_data['edges']

    distances = {node['id']: sys.maxsize for node in nodes}
    distances[start_node_id] = 0

    previous_nodes = {node['id']: None for node in nodes}

    heap = [(0, start_node_id)]

    while heap:
        current_distance, current_node = heapq.heappop(heap)

        # Skip if the current distance is greater than the recorded distance
        if current_distance > distances[current_node]:
            continue

        # Stop the algorithm if the end node is reached
        if current_node == end_node_id:
            break

        for edge in edges:
            if edge['source'] == current_node or edge['target'] == current_node:
                neighbor_node = edge['target'] if edge['source'] == current_node else edge['source']
                edge_weight = edge['weight']
                new_distance = distances[current_node] + edge_weight

                if new_distance < distances[neighbor_node]:
                    distances[neighbor_node] = new_distance
                    previous_nodes[neighbor_node] = current_node
                    heapq.heappush(heap, (new_distance, neighbor_node))

    # Construct the shortest path
    shortest_path = []
    current_node = end_node_id

    while current_node:
        shortest_path.append(current_node)
        current_node = previous_nodes[current_node]

    shortest_path.reverse()

    return distances[end_node_id], shortest_path
