class vEdge {
    constructor(start, left, right) {
        this.left = left;
        this.right = right;

        this.start = start;
        this.end = null;

        this.f = (right.x - left.x) / (left.y - right.y);
        this.g = s.y - this.f*s.x;
        this.direction = new Point(right.y-left.y, -(right.x - left.x));
        this.B = new Point(s.x+this.direction.x, s.y + this.direction.y);	// second point of line

        this.intersected = false;
        this.counted = false;
        this.neighbor = null;
    }
}

export { vEdge }