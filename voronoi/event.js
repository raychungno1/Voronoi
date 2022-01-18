class Event {
    constructor(isSiteEvent, siteOrPoint, arc = null) {
        this.isSiteEvent = isSiteEvent
        if (isSiteEvent) {
            this.site = siteOrPoint;
        } else {
            this.point = siteOrPoint;
            this.arc = arc;
        }
    }

    // lessThan(a) {
    //     y1 = this.isSiteEvent ? this.site.point.y : this.point.y;
    //     y2 = a.isSiteEvent ? a.site.point.y : a.point.y;
    //     return y1 < y2;
    // }
}