class vEvent {
    constructor(point, isPointEvent) {
        this.point = point;
        this.isPointEvent = isPointEvent;
        this.y = point.y;

        this.arch = null;
        this.value = 0;
    }

    lessThan(a) {
        return this.y < a.y
    }
}

export { vEvent }