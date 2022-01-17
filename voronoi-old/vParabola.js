class vParabola {
    constructor(point) {
        this.cEvent = null;
        this.parent = null;
        this._left = null;
        this._right = null;

        this.point = point;
        this.isLeaf = (point != null);
    }

    get left() {
        return this._left;
    }

    get right() {
        return this._right;
    }

    set left(point) {
        this._left = point;
        point.parent = this;
    }

    set right(point) {
        this._right = point;
        point.parent = this;
    }
}

export { vParabola }