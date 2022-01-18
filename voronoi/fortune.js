import { MinHeap, RBT } from "../data-structs.js";
import { VoronoiDiagram } from "./voronoi-diagram.js";

class FortuneAlgorithm {
    constructor(points) {
        this.diagram = new VoronoiDiagram(points);
        this.breachLine = new RBT();
        this.events = new MinHeap();
    }

    construct() {
        // Initialize event queue
        this.points.forEach(point => this.events.insert(point));

        while (this.events.size) {
            let event = events.pop
        }
    }

    bound(box) {

    }

    getDiagram() {

    }
}
