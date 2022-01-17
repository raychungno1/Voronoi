import { MinHeap } from "../data-structs";

class Voronoi {
    constructor() {
        this.sites = [];
        this.faces = [];
        this.vertices = [];
        this.halfEdges = [];
    }

    compute() {
        let eventQ = new MinHeap();
        let beachLine = new RBT();

        while (q.size) {
            let point = eventQ.remove();
            if (point.isSiteEvent) {
                handleSiteEvent();
            } else {
                //remove arc on b
                handleCircleEvent();
            }
        }
        // Treat remaining unbounded nodes
    }
}
