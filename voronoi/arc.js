class Arc {
    constructor() {
        // Tree
        this.parent = null;
        this.left = null;
        this.right = null;

        // Diagram
        this.site = null;
        this.leftHalfEdge = null;
        this.rightHalfEdge = null;
        this.event = null;

        // Optimizations
        this.prev = null;
        this.next = null;

        // Balancing
        this.isRed = false;
    }
}

export { Arc }