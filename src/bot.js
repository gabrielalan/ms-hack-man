const readline = require('readline');
const AStarFind = require('./astar');
const Grid = require('./grid');

const write = message => process.stdout.write(message);

const error = error => process.stderr.write(error);

const tryToCastInt = value => isNaN(parseInt(value)) ? value : parseInt(value);

const PASS = 'pass';

class Bot {

	constructor() {
		this.character = 'bixie';

		this.grid = null;

		this.holding = {
			snippets: 0,
			bombs: 0
		};

		this.options = {
			timebank: 0
		};
	}

	init() {
		const io = readline.createInterface(process.stdin, process.stdout);

		io.on('line', data => {

			if (data.length === 0) {
				return;
			}

			const lines = data.trim().split('\n');

			while (0 < lines.length) {

				const line = lines.shift().trim();
				const lineParts = line.split(" ");

				if (lineParts.length === 0) {
					return;
				}

				const command = lineParts.shift().toLowerCase();

				if (command in this) {
					const response = this[command](lineParts);

					if (response && 0 < response.length) {
							write(response + '\n');
					}
				} else {
					error('Unable to execute command: ' + command + ', with data: ' + lineParts + '\n');
				}
			}
		});

		io.on('close', () => {
			process.exit(0);
		});
	}

	getId() {
		return 'P' + this.options.your_botid;
	}

	move() {
		const botPosition = this.grid.getNodeByValue(this.getId());
		const firstSnippet = this.grid.getFirstSnippet();

		const result = AStarFind(botPosition.x, botPosition.y, firstSnippet.x, firstSnippet.y, this.grid);

		if (!result.length) {
			return PASS;
		}

		return this.grid.getDirection(result[0], result[1]) || PASS;
	}

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