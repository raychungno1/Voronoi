/**
 * Represents an input point, which has coordinates and a face
 */
class Site {
    constructor(index, point, face = null) {
        this.index = index;
        this.point = point;
        this.face = face;
    }
}

export { Site };