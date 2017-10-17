const readline = require('readline');

const write = message => process.stdout.write(message);

const error = error => process.stderr.write(error);

class Runner {
	constructor(bot) {
		this.bot = bot;
	}

	init() {
		const io = readline.createInterface(process.stdin, process.stdout);
		const bot = this.bot;

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

				if (command in bot) {
					const response = bot[command](lineParts);

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
}

module.exports = Runner;