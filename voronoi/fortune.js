import { MinHeap, RBT } from "../data-structs.js";
import { Arc } from "./arc.js";
import { Vertex } from "./vertex.js";
import { Event } from "./event.js"
import { VoronoiDiagram } from "./voronoi-diagram.js";

// https://pvigier.github.io/2018/11/18/fortune-algorithm-details.html
// https://github.com/pvigier/FortuneAlgorithm/tree/master/src

class FortuneAlgorithm {
    constructor(points) {
        this.diagram = new VoronoiDiagram(points);
        this.beachLine = new RBT();
        this.events = null;
        this.beachLineY = null;
    }

    construct() {
        // Initialize event queue
        this.events = new MinHeap(this.diagram.sites.map(site => new Event(true, site)));

        // Process events
        while (this.events.size) {
            let event = this.events.remove();
            this.beachLineY = event.y;
            if (event.isSiteEvent) {
                console.log("removed site event")
                this.handleSiteEvent(event);
            } else {
                console.log("removed circle event")
                this.handleCircleEvent(event);
            }
        }
    }

    handleSiteEvent(event) {
        let site = event.site;

        if (this.beachLine.isEmpty()) {
            this.beachLine.setRoot(new Arc(site));
            return;
        }

        console.log("beachline is not empty")
        // Look for arc above the site
        let arcToBreak = this.beachLine.locateArcAbove(site.point, this.beachLineY);
        this.deleteEvent(arcToBreak);

        // Replace arc w/ 3 new arcs
        let middleArc = this.breakArc(arcToBreak, site);
        let leftArc = middleArc.prev;
        let rightArc = middleArc.next;

        // Add edge to the diagram
        this.addEdge(leftArc, middleArc);
        middleArc.rightHalfEdge = middleArc.leftHalfEdge;
        rightArc.leftHalfEdge = leftArc.rightHalfEdge;

        // Check circle events
        if (leftArc.prev) this.addEvent(leftArc.prev, leftArc, middleArc);
        if (rightArc.next) this.addEvent(middleArc, rightArc, rightArc.next);
    }

    handleCircleEvent(event) {
        let point = event.point;
        let arc = event.arc;

        // Add vertex
        let vertex = this.diagram.createVertex(point.x, point.y);

        // Delete events w/ this arc
        let leftArc = arc.prev;
        let rightArc = arc.next;
        this.deleteEvent(leftArc);
        this.deleteEvent(rightArc);

        // Update beachline & diagram
        this.removeArc(arc, vertex);

        // Check circle events
        if (leftArc.prev) this.addEvent(leftArc.prev, leftArc, rightArc);
        if (rightArc.next) this.addEvent(leftArc, rightArc, rightArc.next);
    }

    breakArc(arc, site) {
        // Create the new subtree
        let middleArc = new Arc(site);
        let leftArc = new Arc(arc.site);
        leftArc.leftHalfEdge = arc.leftHalfEdge;
        let rightArc = new Arc(arc.site);
        rightArc.rightHalfEdge = arc.rightHalfEdge;
        // Insert the subtree in the beachline
        this.beachLine.replace(arc, middleArc);
        this.beachLine.insertBefore(middleArc, leftArc);
        this.beachLine.insertAfter(middleArc, rightArc);

        // Return the middle arc
        return middleArc;
    }

    removeArc(arc, vertex) {
        // End edges
        this.setDestination(arc.prev, arc, vertex);
        this.setDestination(arc, arc.next, vertex);

        // Join the edges of the middle arc
        arc.leftHalfEdge.next = arc.rightHalfEdge;
        arc.rightHalfEdge.prev = arc.leftHalfEdge;

        // Update beachline
        this.beachLine.remove(arc);

        // Create a new edge
        let prevHalfEdge = arc.prev.rightHalfEdge;
        let nextHalfEdge = arc.next.leftHalfEdge;
        this.addEdge(arc.prev, arc.next);
        this.setOrigin(arc.prev, arc.next, vertex);
        this.setPrevHalfEdge(arc.prev.rightHalfEdge, prevHalfEdge);
        this.setPrevHalfEdge(nextHalfEdge, arc.next.leftHalfEdge);
    }

    isMovingRight(left, right) {
        return left.site.point.y < right.site.point.y;
    }

    getInitialX(left, right, movingRight) {
        return movingRight ? left.site.point.x : right.site.point.x;
    }

    addEdge(left, right) {
        // Create the half edges
        left.rightHalfEdge = this.diagram.createHalfEdge(left.site.face);
        right.leftHalfEdge = this.diagram.createHalfEdge(right.site.face);

        // Set them as twins
        left.rightHalfEdge.twin = right.leftHalfEdge;
        right.leftHalfEdge.twin = left.rightHalfEdge;
    }

    setOrigin(left, right, vertex) {
        left.rightHalfEdge.destination = vertex;
        right.leftHalfEdge.origin = vertex;
    }

    setDestination(left, right, vertex) {
        left.rightHalfEdge.origin = vertex;
        right.leftHalfEdge.destination = vertex;
    }

    setPrevHalfEdge(prev, next) {
        prev.next = next;
        next.prev = prev;
    }

    addEvent(left, middle, right) {
        let y = {value: null};
        let convergencePoint = FortuneAlgorithm.computeConvergencePoint(left.site.point, middle.site.point, right.site.point, y);
        let isBelow = y.value <= this.beachLineY;
        let leftBreakpointMovingRight = this.isMovingRight(left, middle);
        let rightBreakpointMovingRight = this.isMovingRight(middle, right);
        let leftInitialX = this.getInitialX(left, middle, leftBreakpointMovingRight);
        let rightInitialX = this.getInitialX(middle, right, rightBreakpointMovingRight);
        let isValid =
            ((leftBreakpointMovingRight && leftInitialX < convergencePoint.x) ||
            (!leftBreakpointMovingRight && leftInitialX > convergencePoint.x)) &&
            ((rightBreakpointMovingRight && rightInitialX < convergencePoint.x) ||
            (!rightBreakpointMovingRight && rightInitialX > convergencePoint.x));

        if (isValid && isBelow) {
            let event = new Event(false, convergencePoint, middle, y.value);
            middle.event = event;
            this.events.insert(event);
        }
    }

    deleteEvent(arc) {
        if (arc.event) {
            this.events.remove(arc.event);
            arc.event = null;
        }
    }

    static computeConvergencePoint(point1, point2, point3, y) {
        let v1 = point1.subtract(point2).ortho;
        let v2 = point2.subtract(point3).ortho;
        let delta = point3.subtract(point1).times(0.5);
        let t = delta.det(v2) / v1.det(v2);
        let center = point1.add(point2).times(0.5).add(v1.times(t));
        let r = Vertex.distance(center, point1);
        y.value = center.y - r;
        return center;
    }

    bound(box) {

    }

    getDiagram() {

    }
}

let d = new FortuneAlgorithm([
    new Vertex(1, 1),
    new Vertex(2, 2),
    new Vertex(4, 1.5),
    new Vertex(4, 4),
    new Vertex(0.5, 5),
]);
d.construct();
console.log(d.diagram);

// console.log(FortuneAlgorithm.computeConvergencePoint(
//     new Vertex(1, 1),
//     new Vertex(2, 2),
//     new Vertex(4, 1),
//     {value: 1}
// ));
