const backtrace = require('./backtrace');

/**
 * Breadth-first search path finder
 * It's good when you don't know where is the end point,
 * but know what is the endpoint.
 * A* its faster than BFS, but you need to know the endpoint.
 */
const breadthFirstFinder = (startX, startY, grid) => {
	const openList = [];
	const startNode = grid.getNode(startX, startY);

	let neighbors, node;

	// push the start pos into the queue
	openList.push(startNode);
	startNode.opened = true;

	// while the queue is not empty
	while (openList.length) {
		// take the front node from the queue
		node = openList.shift();
		node.closed = true;

		// reached the end position
		if (node.isSnippet()) {
			return backtrace(node);
		}

		neighbors = grid.getNeighbors(node);

		for (let neighbor of neighbors) {
			// skip this neighbor if it has been inspected before
			if (neighbor.closed || neighbor.opened) {
					continue;
			}

			openList.push(neighbor);
			neighbor.opened = true;
			neighbor.parent = node;
		}
	}
	
	// fail to find the path
	return [];
};

module.exports = breadthFirstFinder;