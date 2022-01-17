class vPolygon {
    constructor() {
        this.size = 0;
        this.verticies = [];
        this.first = null;
        this.last = null;
    }

    addRight(point) {
        this.verticies.push(point);
        this.size++;
        this.last = point;
        if (this.size === 1) this.first = point;
    }

    addLeft(point) {
        this.verticies.unshift(point);
        this.size++;
        this.first = point;
        if (this.size === 1) this.last = point;
    }
}

export { vPolygon }