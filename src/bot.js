const breadthFirstFinder = require('./bfs');
const Grid = require('./grid');

const tryToCastInt = value => isNaN(parseInt(value)) ? value : parseInt(value);

const PASS = 'pass';

class Bot {

	constructor(character) {
		this.character = character;

		this.grid = null;

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

	/**
	 * Grabs bot position and calculate the path to the closest snippet
	 * using breadth-first search
	 */
	move() {
		const botPosition = this.grid.getNodeByValue(this.getId());

		const result = breadthFirstFinder(botPosition.x, botPosition.y, this.grid);

		if (!result.length) {
			return PASS;
		}

		return this.grid.getDirection(result[0], result[1]) || PASS;
	}

	/**
	 * Perform data update on the structure
	 */
	update(data) {
		if (this.grid === null) {
			const width = this.options.field_width;
			const height = this.options.field_height;
			
			this.grid = new Grid(width, height);
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
	 * the should respond correct or let it pass
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