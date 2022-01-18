import { Face } from "./face.js";
import { HalfEdge } from "./half-edge.js";
import { Site } from "./site.js";
import { Vertex } from "./vertex.js";

class VoronoiDiagram {
    constructor(points) {
        this.sites = points.map((point, i) => new Site(i, point));
        this.faces = this.sites.map(site => new Face(site));
        this.faces.forEach((face, i) => this.sites[i].face = face);
        this.vertices = [];
        this.halfEdges = [];
    }

    getSite(i) {
        return this.sites[i];
    }

    get numSites() {
        return this.sites.length;
    }

    getFace(i) {
        return this.faces[i];
    }

    intersect(box) {

    }

    createVertex(x, y) {
        let v = new Vertex(x, y)
        this.vertices.push(v);
        return v;
    }

    createCorner(box, side) {

    }

    createHalfEdge(face) {
        let e = new HalfEdge();
        e.incidentFace = face;
        if (!face.edge) face.edge = e;
        this.halfEdges.push(e);
        return e;
    }

    link(box, start, startSide, end, endside) {

    }

    removeVertex(vertex) {
        this.vertices = this.vertices.filter(v => v !== vertex);
    }

    removeHalfEdge(halfEdge) {
        this.halfEdges = this.halfEdges.filter(e => e !== halfEdge);
    }
}

export { VoronoiDiagram }