const backtrace = require('./backtrace');

/**
 * Breadth-first search path finder
 * It's good when you don't know where is the end point,
 * but know what is the endpoint.
 * A* its faster than BFS, but you need to know the endpoint.
 */
const breadthFirstSearch = (startX, startY, end, grid, limit = false) => {
	const queue = [];
	const extraSafety = 1.2;
	const maxChecks = limit || Math.ceil(grid.getSize() * extraSafety);
	const startNode = grid.getNode(startX, startY);

	let neighbors, node, counter = 0;

	// push the start pos into the queue
	queue.push(startNode);
	startNode.opened = true;

	// while the queue is not empty AND the limit is not reached
	while (queue.length && (counter < maxChecks)) {
		// take the front node from the queue
		node = queue.shift();
		node.closed = true;

		// reached the end position
		if (end(node)) {
			return backtrace(node);
		}

		neighbors = grid.getNeighbors(node);

		for (let neighbor of neighbors) {
			// skip this neighbor if it has been inspected before or extra checks
			if (!neighbor.isValid()) {
					continue;
			}

			queue.push(neighbor);
			neighbor.opened = true;
			neighbor.parent = node;
		}

		counter++;
	}
	
	// fail to find the path
	return [];
};

module.exports = breadthFirstSearch;