/** 
 * A single edge is made of two half edges 
 * Utilizes a circularly linked list to access all half edges associated with a face
*/
class HalfEdge {
    constructor() {
        this.origin = null;
        this.desgination = null;
        this.twin = null;
        this.incidentFace = null;
        this.prev = null;
        this.next = null;
    }
}

export { HalfEdge };