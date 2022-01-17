class HalfEdge {
    constructor() {
        this.origin = null;
        this.twin = null;
        this.incidentFace = null;
        this.prev = null;
        this.next = null;
    }
}

export { HalfEdge };