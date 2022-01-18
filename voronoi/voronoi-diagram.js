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

// let d = new VoronoiDiagram([
//     new Vertex(1, 1),
//     new Vertex(2, 2),
//     new Vertex(3, 3),
//     new Vertex(4, 4),
// ]);
// console.log(d);


let a = [1, 1, 1]
let b = [2, 2, 2]
let c = [3, 3, 3]

let arr = [a, b, c]
console.log(arr)
console.log(arr.filter(item => item !== b));
export { VoronoiDiagram }