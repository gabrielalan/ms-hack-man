class Node {
	constructor(data, coords) {
		this.data = data;
		this.x = coords.x;
		this.y = coords.y;
		this.f = 0;
		this.cleanDirty();
	}

	isSnippet() {
		return this.data.indexOf('C') >= 0;
	}

	isLeftGate() {
		return this.data.indexOf('Gl') >= 0;
	}

	isRightGate() {
		return this.data.indexOf('Gr') >= 0;
	}

	canStep() {
		const isBlocked = /x/gi.test(this.data);
		const hasBug = /E[0-9]/gi.test(this.data);
		const hasArmedMine = /B[0-9]/gi.test(this.data);
		const isSpawning = /S[0-3]/gi.test(this.data);
		return !isBlocked && !hasBug && !hasArmedMine && !isSpawning;
	}

	isValid() {
		return !this.closed && !this.opened && this.canStep();
	}

	cleanDirty() {
		this.closed = false;
		this.opened = false;
		this.parent = null;
	}
}

module.exports = Node;