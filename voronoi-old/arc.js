/**
 * Arc represenation as a node in a binary tree
 * Includes a doubly linked list for easy in-order traversal
 */
class Arc {
    constructor(site) {
        // Tree
        this.parent = null;
        this.left = null;
        this.right = null;
        this.isRed = true;

        // Diagram
        this.site = site;
        this.leftHalfEdge = null;
        this.rightHalfEdge = null;
        this.event = null;

        // Optimizations
        this.prev = null;
        this.next = null;
    }
}

export { Arc }