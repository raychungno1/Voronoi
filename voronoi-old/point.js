class Point {

    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = "#3980b9"
    }

    draw(c) {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    static distance(a, b) {
        return Math.sqrt( (a.x - b.x) ** 2 + (a.y - b.y) ** 2 );
    }
}

export { Point }