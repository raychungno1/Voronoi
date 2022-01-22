class Point {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.dx = (Math.random() - 0.5) * 5;
		this.dy = (Math.random() - 0.5) * 5;
		this.maxWidth = width;
		this.maxHeight = height;
		this.radius = 3;
	}

    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = "#17252a";
        c.fill();
        return this;
    }

	update() {
        if (this.x + this.radius > this.maxWidth || this.x - this.radius < 0) this.dx *= -1
        if (this.y + this.radius > this.maxHeight || this.y - this.radius < 0) this.dy *= -1
        this.x += this.dx
        this.y += this.dy
    }
}

export { Point }