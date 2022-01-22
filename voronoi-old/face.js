/**
 * Represents a face with the site and a pointer to a single edge 
 * Since the edges are also a circular linked list, only a single edge is needed to access all of them
*/
class Face {
    constructor(site, edge = null) {
        this.site = site;
        this.edge = edge;
    }
}

export { Face };