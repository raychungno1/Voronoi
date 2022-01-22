class Circle {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "#3980b9";
    }

    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        return this;
    }

    static drawCircles(c, ...circles) {
        circles.forEach(circle => circle.draw(c));
    }
}

export { Circle } 