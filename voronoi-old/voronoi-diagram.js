import { Box } from "./box.js";
import { Face } from "./face.js";
import { HalfEdge } from "./half-edge.js";
import { Intersection } from "./intersection.js";
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
        let error = false;
        let processedHalfEdges;
        let verticiesToRemove;
        for (let site of this.sites) {
            let halfEdge = site.face.edge;
            let inside = box.contains(halfEdge.origin.point);
            let outerComponentDirty = !inside;
            let incomingHalfEdge = null;
            let outgoingHalfEdge = null;
            let incomingSide, outgoingSide;

            do {
                let intersections = [new Intersection(), new Intersection()];
                let nbIntersections = box.getIntersections(halfEdge.origin.point, halfEdge.destination.point, intersections);
                let nextInside = box.contains(halfEdge.destination.point);
                let nextHalfEdge = halfEdge.next;

                // The two pounts are outside the box
                if (!inside && !nextInside) {
                    if (nbIntersections === 0) { // Edge is outside the box
                        verticiesToRemove.push(halfEdge.origin);
                        this.removeHalfEdge(halfEdge);
                    }

                    else if (nbIntersections === 2) { // Edge crosses box twice
                        verticiesToRemove.push(halfEdge.origin);
                        if (processedHalfEdges.indexOf(halfEdge.twin) !== processedHalfEdges.length - 1) {
                            halfEdge.origin = halfEdge.twin.destination;
                            halfEdge.destination = halfEdge.twin.origin;
                        } else {
                            halfEdge.origin = this.createVertex(intersections[0].point);
                            halfEdge.destination = this.createVertex(intersections[1].point);
                        }
                        if (outgoingHalfEdge) this.link(box, outgoingHalfEdge, outgoingSide, halfEdge, intersections[0].side);
                        if (!incomingHalfEdge) {
                            incomingHalfEdge = halfEdge;
                            incomingSide = intersections[0].side;
                        }
                        outgoingHalfEdge = halfEdge;
                        outgoingSide = intersections[1].side;
                        processedHalfEdges.push(halfEdge);
                    } else {
                        error = true;
                    }
                } else if (inside && !nextInside) { // The edge is going outside thebox
                    if (nbIntersections === 1) {
                        if (processedHalfEdges.indexOf(halfEdge.twin) !== processedHalfEdges.length - 1) {
                            halfEdge.destination = halfEdge.twin.origin;
                        } else {
                            halfEdge.destination = createVertex(intersections[0].point);
                        }
                        outgoingHalfEdge = halfEdge;
                        outgoingSide = intersections[0].side;
                        processedHalfEdges.push(halfEdge);
                    } else {
                        error = true
                    }
                } else if (!inside && nextInside) { // The edge is coming inside the box
                    if (nbIntersections === 1) {
                        verticiesToRemove.push(halfEdge.origin);
                        if (processedHalfEdges.indexOf(halfEdge.twin) !== processedHalfEdges.length - 1) {
                            halfEdge.origin = halfEdge.twin.destination;
                        } else {
                            halfEdge.origin = createVertex(intersections[0].point);
                        }
                        if (outgoingHalfEdge) link(box, outgoingHalfEdge, outgoingSide, halfEdge, intersections[0].side);
                        if (!incomingHalfEdge) {
                            incomingHalfEdge =  halfEdge;
                            incomingSide = intersections[0].side;
                        }
                        processedHalfEdges.push(halfEdge);
                    } else {
                        error = true;
                    }
                }
                halfEdge = nextHalfEdge;
                inside = nextInside;
            } while (halfEdge !== site.face.edge);

            // Link last & first halfedges inside the box
            if (outerComponentDirty && incomingHalfEdge) this.link(box, outgoingHalfEdge, outgoingSide, incomingHalfEdge, incomingSide);
            // Set outer component
            if (outerComponentDirty) site.face.edge = incomingHalfEdge;
        }
        // Remove verticies
        for (let vertex of verticiesToRemove) this.removeVertex(vertex)
        return !error;
    }

    createVertex(x, y) {
        let v = new Vertex(x, y)
        this.vertices.push(v);
        return v;
    }

    createCorner(box, side) {
        switch (side) {
            case "left":
                return this.createVertex(box.left, box.top);
            case "bottom":
                return this.createVertex(box.left, box.bottom);
            case "right":
                return this.createVertex(box.right, box.bottom);
            case "top":
                return this.createVertex(box.right, box.top);
            default:
                return null;
        }
    }

    createHalfEdge(face) {
        let e = new HalfEdge();
        e.incidentFace = face;
        if (!face.edge) face.edge = e;
        this.halfEdges.push(e);
        return e;
    }

    link(box, start, startSide, end, endSide) {
        let halfEdge = start;
        let side = Box.sideIndex.indexOf(startSide);
        let endIndex = Box.sideIndex.indexOf(endSide);

        while (side != endIndex) {
            side = (side + 1) % 4;
            halfEdge.next = this.createHalfEdge(start.incidentFace);
            halfEdge.next.prev = halfEdge;
            halfEdge.next.origin = halfEdge.destination;
            halfEdge.next.destination = this.createCorner(box, Box.sideIndex[side]);
            halfEdge = halfEdge.next;
        }
        halfEdge.next = this.createHalfEdge(start.incidentFace);
        halfEdge.next.prev = halfEdge;
        end.prev = halfEdge.next;
        halfEdge.next.next = end;
        halfEdge.next.origin = halfEdge.destination;
        halfEdge.next.destination = end.origin;
    }

    removeVertex(vertex) {
        this.vertices = this.vertices.filter(v => v !== vertex);
    }

    removeHalfEdge(halfEdge) {
        this.halfEdges = this.halfEdges.filter(e => e !== halfEdge);
    }
}

export { VoronoiDiagram }