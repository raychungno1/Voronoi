/**
 * Represents the 2d coordinate system
*/
class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(a) {
        return new Vertex(this.x + a.x, this.y + a.y);
    }

    subtract(a) {
        return new Vertex(this.x - a.x, this.y - a.y);
    }

    times(c) {
        return new Vertex(this.x * c, this.y * c);
    }

    get ortho() {
        return new Vertex(-this.y, this.x);
    }

    det(a) {
        return this.x * a.y - this.y * a.x;
    }

    static distance(a, b) {
        return Math.sqrt( (a.x - b.x) ** 2 + (a.y - b.y) ** 2 );
    }
}

export { Vertex };
