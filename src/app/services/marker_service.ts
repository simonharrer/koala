declare var google:any;

import {Location} from "../model/location";
import {LocationCategory} from "../model/location_category";


export class MarkerService {
    private markers:any = [];

    constructor() {

    }

    // Adds a  new marker to the map.
    addMarker(location:Location, map:any) {
        var loc = {lat: location.latitude, lng: location.longitude};

        let infowindow:any;

        let iconSVG:string = "./artwork/";

        let categoryName:string = this.categoryToHumanReadable(location.category);

        if (location.category == LocationCategory.HOME) {
            iconSVG += "marker-home.svg";
            infowindow = new google.maps.InfoWindow({
                content: "<h3>" + categoryName + ": " + location.name + "</h3><p>Address: " + location.address + "</p>"
            });
        } else if (location.category == LocationCategory.POI) {
            iconSVG += "marker-work.svg";

            infowindow = new google.maps.InfoWindow({
                content: "<h3>" + categoryName + ": " + location.name + "</h3><p>Address: " + location.address + "</p>"
            });
        } else {
            iconSVG += "marker-other.svg";
            infowindow = new google.maps.InfoWindow({
                content: "<h3>" + categoryName + ": " + location.name + "</h3><p>Address: " + location.address + "</p>"
            });
        }

        var marker = new google.maps.Marker({
            position: loc,
            icon: new google.maps.MarkerImage(iconSVG,
                null, null, null, new google.maps.Size(40, 40)),
            optimized: false,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.name
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });

        this.markers.push(marker);
    }

    categoryToHumanReadable(cat:LocationCategory):string {
        if(cat == LocationCategory.HOME) {
            return "Home";
        } else {
            return "Point of Interest";
        }
    }

    // Adds a marker to the map and push to the array.
    addMarkerLatLong(latLong:any, map:any) {
        let marker = new google.maps.Marker({
            position: latLong,
            map: map
        });
        this.markers.push(marker);
    }

    // Removes a marker from the map.
    removeMarker(location:Location) {
        //console.log("Removing marker at " + JSON.stringify(location));
        for (let m of this.markers) {
            if (m.position.lat() == location.latitude && m.position.lng() == location.longitude) {
                m.setMap(null);

                //console.log("Deleting marker for location");

                let index = this.markers.indexOf(m, 0);
                if (index > -1) {
                    // delete marker
                    this.markers.splice(index, 1);
                }
                return;
            }
        }
    }

    removeMarkers() {
        for (let m of this.markers.slice()) {
            this.removeSpecificMarker(m);
        }
    }

    private removeSpecificMarker(m) {
        m.setMap(null);

        //console.log("Deleting marker for location");

        let index = this.markers.indexOf(m, 0);
        if (index > -1) {
            // delete marker
            this.markers.splice(index, 1);
        }
        return index;
    }

}
