class Event {
    constructor(isSiteEvent, siteOrPoint, arc = null, y = null) {
        this.isSiteEvent = isSiteEvent
        if (isSiteEvent) {
            this.site = siteOrPoint;
            this.y = this.site.point.y;
        } else {
            this.point = siteOrPoint;
            this.arc = arc;
            this.y = y;
        }
    }

    lessThan(event) {
        return this.y < event.y;
    }
}

export { Event };