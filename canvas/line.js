class Line {

    constructor(start, end, width) {
        this.start = start;
        this.end = end;
        this.width = width;
        this.color = "#3980b9";
    }

    draw(c) {
        c.beginPath();
        c.moveTo(this.start.x, this.start.y);
        c.lineTo(this.end.x, this.end.y);
        c.lineWidth = this.width;
        c.strokeStyle = this.color;
        c.stroke();
        return this;
    }

    static drawLines(c, ...lines) {
        lines.forEach(line => line.draw(c));
    }
}

export { Line }