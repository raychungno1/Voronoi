import { Intersection } from "./intersection.js";

class Box {

    static sideIndex = ["left", "bottom", "right", "top"];

    constructor(left, bottom, right, top) {
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.top = top;
    }

    contains(point) {
        return point.x >= this.left - 0.01 && point.x <= this.right + 0.01 &&
               point.y >= this.bottom - 0.01 && point.y <= this.top + 0.01;
    }

    getFirstIntersection(origin, direction) {
        let intersection;
        let t = Infinity;
        if (direction.x > 0) {
            t = (this.right - origin.x) / direction.x;
            intersection = new Intersection("right", origin.add(direction.times(t)));
        } else if (direction.x < 0) {
            t = (this.left - origin.x) / direction.x;
            intersection = new Intersection("right", origin.add(direction.times(t)));
        }

        if (direction.y > 0) {
            let newT = (this.top - origin.y) / direction.y;
            if (newT < t) {
                intersection = new Intersection("top", origin.add(direction.times(newT)));
            }
        } else if (direction.y < 0) {
            let newT = (this.bottom - origin.y) / direction.y;
            if (newT < t) {
                intersection = new Intersection("bottom", origin.add(direction.times(newT)));
            }
        }
        return intersection;
    }

    getIntersections(origin, destination, intersections) {
        let direction = destination.subtract(origin);
        let t = [];
        let i = 0;

        // Left
        if (origin.x < this.left - 0.01 || destination.x < this.left - 0.01) {
            t[i] = (this.left - origin.x) / direction.x;
            if (t[i] > 0.01 && t[i] < 1.0 - 0.01) {
                intersections[i].side = "left"
                intersections[i].point = origin.add(direction.times(t[i]));
                if (intersections[i].point.y >= this.bottom - 0.01 && intersections[i].point.y <= this.top + 0.01) {
                    i++;
                }
            }
        }

        // Right
        if (origin.x > this.right - 0.01 || destination.x > this.right - 0.01) {
            t[i] = (this.right - origin.x) / direction.x;
            if (t[i] > 0.01 && t[i] < 1.0 - 0.01) {
                intersections[i].side = "right"
                intersections[i].point = origin.add(direction.times(t[i]));
                if (intersections[i].point.y >= this.bottom - 0.01 && intersections[i].point.y <= this.top + 0.01) {
                    i++;
                }
            }
        }

        // Bottom
        if (origin.y < this.bottom - 0.01 || destination.y < this.bottom - 0.01) {
            t[i] = (this.bottom - origin.y) / direction.y;
            if (t[i] > 0.01 && t[i] < 1.0 - 0.01) {
                intersections[i].side = "bottom"
                intersections[i].point = origin.add(direction.times(t[i]));
                if (intersections[i].point.x >= this.left - 0.01 && intersections[i].point.x <= this.right + 0.01) {
                    i++;
                }
            }
        }

        // Top
        if (origin.y > this.top - 0.01 || destination.y > this.top - 0.01) {
            t[i] = (this.top - origin.y) / direction.y;
            if (t[i] > 0.01 && t[i] < 1.0 - 0.01) {
                intersections[i].side = "top"
                intersections[i].point = origin.add(direction.times(t[i]));
                if (intersections[i].point.x >= this.left - 0.01 && intersections[i].point.x <= this.right + 0.01) {
                    i++;
                }
            }
        }

        if (i == 2 && t[0] > t[1]) [intersections[0], intersections[1]] = [intersections[1], intersections[0]];
        return i;
    }
}

export { Box };