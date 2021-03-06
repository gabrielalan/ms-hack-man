const Node = require('./node.js');

/**
 * Minimum example of array of cell types:
 * S,.,C,x,.,.,.,.,.,.,.,.,.,.,.,x,.,.,S,
 * .,x,.,x,.,x,x,x,x,.,x,x,.,x,Gl,.,x,x,P0,
 * x,x,x,x,.,x,x,x,x,P1,x,x,.,Gr,x,.,x,x,.,
 * .,.,.,.,x,.,.,x,x,x,.,.,.,.,.,C,.,S
 */
class Grid {
	constructor(width, height, botId) {
		this.width = width;
		this.height = height;
		this.round = 0;
		this.botId = botId;
		this.botPosition = null;
		this.leftGate = null;
		this.rightGate = null;
	}

	parseGameData(key, value) {
		switch (key) {
			case 'round':
				return this.round = Number(value);

			case 'field':
				this.list = this.createNodes(value.split(','));
				break;
		}
	}

	createNodes(list) {
		return list.map((item, index) => {
			const node = new Node(item, this.getXY(index));

			if (item.indexOf(this.botId) >= 0) {
				this.botPosition = node;
			}

			if (node.isLeftGate()) {
				this.leftGate = node;
			}

			if (node.isRightGate()) {
				this.rightGate = node;
			}

			return node;
		});
	}

	cleanNodes() {
		this.list.map(node => node.cleanDirty());
	}

	getBotPosition() {
		if (!this.botPosition) {
			this.botPosition = this.getNodeByValue(this.botId);
		}

		return this.botPosition;
	}

	getLeftGate() {
		if (!this.leftGate) {
			this.leftGate = this.getNode(1, 8);
		}

		return this.leftGate;
	}

	getRightGate() {
		if (!this.rightGate) {
			this.rightGate = this.getNode(19, 8);
		}

		return this.rightGate;
	}

	/**
	 * Both nodes need to be neighbors
	 * @param start x y tuple [x, y]
	 * @param next x y tuple [x, y]
	 */
	getDirection(start, next) {
		// vertical movement
		if (start[0] === next[0]) {
			if (start[1] > next[1]) {
				return 'UP';
			}

			if (start[1] < next[1]) {
				return 'DOWN';
			}
		}

		// horizontal movement
		if (start[1] === next[1]) {
			if (start[0] > next[0]) {
				return 'LEFT';
			}

			if (start[0] < next[0]) {
				return 'RIGHT';
			}
		}
	}

	getFirstSnippet() {
		return this.getNodeByValue('C');
	}

	getNodeByValue(data) {
		const regex = new RegExp(data);
		for (let node of this.list) {
			if (regex.test(node.data)) {
				return node;
			}
		}

		return false;
	}

	getNeighbors(node) {
		const list = [
			[ node.x + 1, node.y ], // right
			[ node.x - 1, node.y ], // left
			[ node.x, node.y - 1 ], // up
			[ node.x, node.y + 1 ], // bottom
		];

		return list.reduce((result, item) => {
			if (item[0] < 1 || item[0] > this.width || item[1] < 1 || item[1] > this.height) {
				return result;
			}

			result.push(this.list[this.getIndex.apply(this, item)]);
			return result;
		}, []);
	}

	getNode(x, y) {
		return this.list[this.getIndex(x, y)];
	}

	getXY(index) {
		const x = (index % this.width) + 1;
		const y = Math.floor(index / this.width) + 1;
		return { x, y };
	}

	getIndex(x, y) {
		return (x - 1) + ((y - 1) * this.width);
	}

	getSize() {
		return this.width * this.height;
	}
}

module.exports = Grid;