const Heap = require('heap');
const backtrace = require('./backtrace');
const { manhattan } = require('./heuristics');

/**
 * Find the best path between 2 points
 * Its fast enough when you already know the end point.
 * Otherwise you will need to iterate over something to find the
 * end point, which brings more time complexity
 */
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
					neighbor.h = neighbor.h || weight * manhattan(x, y, endX, endY);
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
		}
	}

	// fail to find the path
	return [];
};

module.exports = AStarFind;