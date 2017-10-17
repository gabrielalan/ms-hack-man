class Node {
	constructor(data, coords) {
		this.data = data;
		this.x = coords.x;
		this.y = coords.y;
		this.f = 0;
		this.closed = false;
		this.opened = false;
	}

	isSnippet() {
		return this.data.indexOf('C') >= 0;
	}

	canStep() {
		const isBlocked = /x/gi.test(this.data);
		const hasBug = /E[0-9]/gi.test(this.data);
		const hasArmedMine = /B[0-9]/gi.test(this.data);
		return !isBlocked && !hasBug && !hasArmedMine;
	}

	isValid() {
		return !this.closed && !this.opened && this.canStep();
	}
}

module.exports = Node;