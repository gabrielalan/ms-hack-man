const breadthFirstSearch = require('./bfs');
const AStarFinder = require('./astar');
const Grid = require('./grid');

const tryToCastInt = value => isNaN(parseInt(value)) ? value : parseInt(value);

const PASS = 'pass';

class Bot {

	constructor(character) {
		this.character = character;

		this.grid = null;

		this.currentPath = null;

		this.isEndNode = node => node.isSnippet();

		this.cameFromGate = null;

		this.holding = {
			snippets: 0,
			bombs: 0
		};

		this.options = {
			timebank: 0
		};
	}

	getId() {
		return 'P' + this.options.your_botid;
	}

	getPathClosestSnippet() {
		const botPosition = this.grid.getBotPosition();
		const nextPath = breadthFirstSearch(botPosition.x, botPosition.y, this.isEndNode, this.grid);

		return this.checkGatePath(nextPath, botPosition);
	}

	/**
	 * The path is invalid if 
	 * - the last node isn't a snippet anymore (other bot can get it before us)
	 * - the next 3 steps have a bug, mine or is spawning node
	 * - has only 1 node in it, so it's impossible to get the next direction and the bot is already on the final step
	 */
	isCurrentPathValid() {
		const end = this.currentPath[this.currentPath.length - 1];
		const endNode = this.grid.getNode(end[0], end[1]);

		const next3AreClean = this.currentPath.slice(0, 3).reduce((result, coord) => {
			const node = this.grid.getNode(coord[0], coord[1]);
			return node.isClean() && result;
		}, true);

		return this.isEndNode(endNode) && next3AreClean && this.currentPath.length > 1;
	}

	/**
	 * Checks if there is a gate close to the bot
	 * If true, look for the closest snippet on the opposite gate
	 * If finds and the path is shorter than the normalPath
	 * returns it as the new path
	 *
	 * Has not a good performance. Time complexity is probably something like:
	 * O(2n + 2(n/4))
	 */
	checkGatePath(normalPath, botPosition) {
		this.grid.cleanNodes();

		/**
		 * Limits the iteration to max 5 levels check
		 * since we don't want to waste too much time on it
		 */
		const maxChecks = 61;
		const isGate = node => node.isLeftGate() || node.isRightGate();
		const pathToGate = breadthFirstSearch(botPosition.x, botPosition.y, isGate, this.grid, maxChecks);

		if (pathToGate.length) {
			this.grid.cleanNodes();

			const end = pathToGate[pathToGate.length - 1];
			const gateNode = this.grid.getNode(end[0], end[1]);
			const oppositeGate = gateNode.isLeftGate() ? this.grid.getRightGate() : this.grid.getLeftGate();
			const closestSnippetPath = breadthFirstSearch(oppositeGate.x, oppositeGate.y, this.isEndNode, this.grid, maxChecks);
			const newPath = pathToGate.concat(closestSnippetPath);

			if (closestSnippetPath.length && newPath.length <= normalPath.length) {
				return newPath;
			}
		}

		return normalPath;
	}

	getCurrentPath() {
		if (!this.currentPath || !this.currentPath.length || !this.isCurrentPathValid()) {
			this.currentPath = this.getPathClosestSnippet();
		}

		return this.currentPath;
	}

	/**
	 * Grabs bot position and calculate the path to the closest snippet
	 * using breadth-first search
	 */
	move() {
		// const result = this.getCurrentPath();
		const result = this.getPathClosestSnippet();

		if (!result.length) {
			return PASS;
		}

		// const current = result.shift();
		const current = result[0];
		const node = this.grid.getNode(current[0], current[1]);

		/**
		 * If the node is a gate and the bot didn't come 
		 * from the opposite gate already, go for it
		 */
		if (node.isLeftGate() && this.cameFromGate !== 'RIGHT') {
			this.cameFromGate = 'LEFT';
			return 'LEFT';
		}

		if (node.isRightGate() && this.cameFromGate !== 'LEFT') {
			this.cameFromGate = 'RIGHT';
			return 'RIGHT';
		}

		this.cameFromGate = null;

		// const direction = this.grid.getDirection(current, result[0]);
		const direction = this.grid.getDirection(current, result[1]);

		/**
		 * If there is no direction, the current path is invalid
		 * so we need to get a new one on next move
		 */
		if (!direction) {
			this.grid.cleanNodes();
			this.currentPath = null;
		}

		return direction || PASS;
	}

	/**
	 * Perform data update on the structure
	 */
	update(data) {
		if (this.grid === null) {
			const width = this.options.field_width;
			const height = this.options.field_height;
			
			this.grid = new Grid(width, height, this.getId());
		}

		switch(data[0]) {
			case 'game':
				this.grid.parseGameData(data[1], data[2]);
				break;

			case ('player' + this.options.your_botid):
				const key = data[2];
				const value = data[3];

				this.holding[key] = tryToCastInt(value);
				break;
		}
	}

	/**
	 * When the game ask for an action
	 * the bot should respond correct or let it pass
	 */
	action(data) {
		this.options.timebank = tryToCastInt(data[2]);

		switch(data[0]) {
			case 'character':
				return this.character;

			case 'move':
				return this.move();

			default:
				return;
		}
	}

	settings(data) {
		const key = data[0];
		const value = data[1];

		this.options[key] = tryToCastInt(value);
	}
}

module.exports = Bot;