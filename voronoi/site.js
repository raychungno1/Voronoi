/**
 * Represents an input point, which has coordinates and a face
 */
class Site {
    constructor(vertex) {
        this.vertex = vertex;
        this.face = null;
    }
}

export { Site };