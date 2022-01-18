/**
 * Represents the 2d coordinate system
*/
class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        return Math.sqrt( (a.x - b.x) ** 2 + (a.y - b.y) ** 2 );
    }
}

export { Vertex };
