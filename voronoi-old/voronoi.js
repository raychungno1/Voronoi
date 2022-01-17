import { MinHeap } from "../data-structs.js";
import { Point } from "./point.js";
import { vEdge } from "./vEdge.js";
import { vEvent } from "./vEvent.js";
import { vPolygon } from "./vPolygon.js";
import { vParabola } from "./vParabola.js";

function voronoi(points, width, height) {
    let v = {
        root: null,
        fp: null,
        edges: [],
        cells: [],
        width: width,
        height: height,
        lastY: Number.MAX_VALUE,
        eventQueue: new MinHeap()
    };

    // for each site, insert an event into the queue & assign it to a cell
    points.forEach(point => {
        let event = new vEvent(e, true);
        let cell = new vPolygon();
        point.cell = cell;

        v.eventQueue.insert(event);
        v.cells.push(cell);
    });

    // While event queue is not empty
    while (v.eventQueue.size) {
        let e = v.eventQueue.remove();
        let lastY = e.y;

        // Add a parabola if the event is a point, remove a parabola otherwise
        if (e.isPointEvent) insertParabola(v, e.point);
        else removeParabola(v, e);
    }
    finishEdge(v, root);
    
    edges.forEach(edge => {
        if (edge.neighbor) edge.start = edge.neighbor.end;
    });

    return {
        edges: v.edges,
        cells: v.cells
    }
}

// function insertParabola(v, point) {
//     // If the breachline is currently empty
//     if (!v.root) {
//         v.root = new vParabola(point);
//         v.fp = point;
//         return;
//     }

//     // Special case: if the first two points are the same height
//     if (v.root.isLeaf && v.root.point.y - point.y < 0.01) {
//         v.root.isLeaf = false;
//         v.root.left = new vParabola(v.fp);
//         v.root.right = new vParabola(point);

//         var start = new Point((point.x + v.fp.x)/2, v.height, 0);
//         v.root.edge = (point.x > v.fp.x) ? new vEdge(start, v.fp, point) : new vEdge(start, point, v.fp);
//         v.edges.push(v.root.edge);
//         return;
//     }

//     let par = getParabolaByX(point.x);
//     if (par.cEvent) {
//         v.eventQueue.remove(par.cEvent);
//         par.cEvent = null;
//     }

//     let start = new Point(point.x, getY(par.point, point.x));
//     let el = new vEdge(start, par.point, p);
//     let er = new vEdge(start, p, par.point);

//     el.neighbor = er;
//     v.edges.push(el);

//     par.edge = er;
//     par.isLeaf = false;

//     let p0 = new vParabola(par.site);
//     let p1 = new vParabola(p);
//     let p2 = new vParabola(par.site);

//     par.right = p2;
//     par.left = new vParabola();
//     par.left.edge = el;

//     par.left.left = p0;
//     par.left.right = p1;
// }

let events = [];
for (let i = 9; i >= 0; i--) {
    events.push(new vEvent(new Point(0, i, 0), true));
}
let heap = new MinHeap(events)
let element = events[8];
// let element = events[Math.floor(Math.random() * 10)];
heap.remove();
console.log(element);
console.log(heap);
