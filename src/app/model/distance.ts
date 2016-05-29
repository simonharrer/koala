declare let google:any;

import {Location} from "./location";

export class Distance {
    duration:number; // seconds
    distance:number; // meter

    from:Location;
    to:Location;

    renderer:any;
    raw:any;

    constructor(duration:number, distance:number) {
        this.duration = duration;
        this.distance = distance;
    }

    clearFromMap() {
        if (this.renderer != null) {
            this.renderer.setMap(null);
            this.renderer = null;
        }
    }

    showOnMap() {
        let dirRenderer:any = new google.maps.DirectionsRenderer({preserveViewport: true});
        dirRenderer.setMap(google.map);
        dirRenderer.setOptions({suppressMarkers: true});
        dirRenderer.setDirections(this.raw);

        this.renderer = dirRenderer;
    }

    getDebugOutput():string {
        return "From " + JSON.stringify(this.from) + " to " + JSON.stringify(this.to) +
            " in " + this.distance + " meter or " + this.duration + " seconds";
    }
}
