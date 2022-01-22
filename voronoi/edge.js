import { Point } from "./point.js";

class Edge {
	constructor(p1, p2, startx) {
        // m = slope of the perpendicular bisector
		this.m = -(p1.x - p2.x) / (p1.y - p2.y);

        // q = y-intercept of the perpendicular bisector
		this.q =
			(0.5 * (p1.x ** 2 - p2.x ** 2 + p1.y ** 2 - p2.y ** 2)) /
			(p1.y - p2.y);

        // store left & right points of edge
		this.arc = { left: p1, right: p2 };
		this.end = null;
		this.start = null;
		if (startx) // set a start point, if exists
			this.start = new Point(
				startx,
				this.m != Infinity ? this.getY(startx) : null
			);
	}
	getY(x) {
		if (this.m == Infinity) return null;
		return x * this.m + this.q;
	}

	getX(y) {
		if (this.m == Infinity) return this.start.x;
		return (y - this.q) / this.m;
	}
}

export { Edge }