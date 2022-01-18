import { MinHeap, RBT } from "../data-structs.js";
import { Vertex } from "./vertex.js";
import { VoronoiDiagram } from "./voronoi-diagram.js";

class FortuneAlgorithm {
    constructor(points) {
        this.diagram = new VoronoiDiagram(points);
        this.beachLine = new RBT();
        this.events = null;
        this.beachLineY = null;
    }

    construct() {
        // Initialize event queue
        this.events = new MinHeap(this.diagram.sites);

        while (this.events.size) {
            let event = this.events.remove();
            https://pvigier.github.io/2018/11/18/fortune-algorithm-details.html
            https://github.com/pvigier/FortuneAlgorithm/tree/master/src
        }
    }

    bound(box) {

    }

    getDiagram() {

    }
}

let d = new FortuneAlgorithm([
    new Vertex(4, 4),
    new Vertex(3, 3),
    new Vertex(2, 2),
    new Vertex(1, 1),
]);
d.construct();