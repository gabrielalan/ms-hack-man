const Heap = require('heap');

const manhattanHeuristic = (x, y, endX, endY) => Math.abs(x - endX) + Math.abs(y - endY);

function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}

const AStarFind = (startX, startY, endX, endY, grid) => {
	const openList = new Heap((nodeA, nodeB) => nodeA.f - nodeB.f);
	const startNode = grid.getNode(startX, startY);
	const endNode = grid.getNode(endX, endY);
	const weight = 5;
	const abs = Math.abs
	const SQRT2 = Math.SQRT2;

	let node, neighbors, neighbor, i, l, x, y, ng;

	startNode.g = 0;
	startNode.f = 0;

	openList.push(startNode);
	startNode.opened = true;

	// while the open list is not empty
	while (!openList.empty()) {
		// pop the position of node which has the minimum `f` value.
		node = openList.pop();
		node.closed = true;

		// if reached the end position, construct the path and return it
		if (node === endNode) {
			return backtrace(endNode);
		}

		// get neigbours of the current node
		neighbors = grid.getNeighbors(node);

		for (i = 0, l = neighbors.length; i < l; ++i) {
			neighbor = neighbors[i];

			if (!neighbor.isValid()) {
				continue;
			}

			x = neighbor.x;
			y = neighbor.y;

			// get the distance between current node and the neighbor
			// and calculate the next g score
			ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

			// check if the neighbor has not been inspected yet, or
			// can be reached with smaller cost from the current node
			if (!neighbor.opened || ng < neighbor.g) {
					neighbor.g = ng;
					neighbor.h = neighbor.h || weight * manhattanHeuristic(x, y, endX, endY);
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.parent = node;

					if (!neighbor.opened) {
							openList.push(neighbor);
							neighbor.opened = true;
					} else {
							// the neighbor can be reached with smaller cost.
							// Since its f value has been updated, we have to
							// update its position in the open list
							openList.updateItem(neighbor);
					}
			}
		} // end for each neighbor
	} // end while not open list empty

	// fail to find the path
	return [];
};

module.exports = AStarFind;