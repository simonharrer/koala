declare let google:any;

// fix for fadeOut not known at typing, but available at jQuery
declare let $:any;

import {Component, OnInit, NgZone} from "@angular/core";
import {DirectionsService} from "./services/directions_service";
import {UserData} from "./model/user_data";
import {Location} from "./model/location";
import {Distance} from "./model/distance";
import {LocationCategory} from "./model/location_category";
import {SelectForConsumeTypeComponent} from "./select-for-consume-type";
import {MarkerService} from "./services/marker_service";
import {GeocodeService} from "./services/geocode_service";
import {GoogleplaceDirective} from "./directives/googleplace.directive";
import {DurationPipe} from "./duration.pipe";
import {DistancePipe} from "./distance.pipe";
import {JsonPipe} from "./json.pipe";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/from";

@Component({
    moduleId: module.id,
    selector: 'koala-app',
    templateUrl: 'koala.component.html',
    styleUrls: ['koala.component.css'],
    directives: [GoogleplaceDirective, SelectForConsumeTypeComponent],
    providers: [
        DirectionsService,
        GeocodeService,
        MarkerService
    ],
    pipes: [DurationPipe, DistancePipe, JsonPipe]
})

export class KoalaAppComponent implements OnInit {

    userData:UserData = new UserData();

    // services
    directionsService:DirectionsService;
    markerService:MarkerService;
    geocode:GeocodeService;
    zone:NgZone;

    subscription:any;

    constructor(directions:DirectionsService,
                geocode:GeocodeService,
                markerService:MarkerService,
                zone:NgZone) {
        this.markerService = markerService;
        this.geocode = geocode;
        this.zone = zone;
        this.directionsService = directions;

        this.userData.populateWithExampleData();

        Observable.from(this.userData.futureHomes).subscribe(l => {
            this.geocode.enrichWithGeoData(l).subscribe(loc => {
                this.markerService.addMarker(loc, google.map);
            });
        }, e => console.log("ERROR " + JSON.stringify(e)));

        Observable.from(this.userData.pointsOfInterests).subscribe(l => {
            this.geocode.enrichWithGeoData(l).subscribe(loc => this.markerService.addMarker(loc, google.map),
                e => console.log("ERROR " + JSON.stringify(e)));
        }, e => console.log("ERROR " + JSON.stringify(e)));

        // ensure that we have all the distances available in our database to plot them
        setInterval(() => {
            for (let home of this.userData.futureHomes) {

                if (home.address == null || home.address == "" || home.latitude == null) {
                    continue;
                }

                for (let poi of this.userData.pointsOfInterests) {

                    if (poi.address == null || poi.address == "" || poi.latitude == null) {
                        continue;
                    }

                    let existsAlready:boolean = false;
                    for (let distance of this.userData.distances) {
                        existsAlready = existsAlready || (distance.from == home && distance.to == poi);
                    }
                    if (!existsAlready) {
                        this.directionsService.getDirection(home, poi).subscribe(d => {
                            this.userData.distances.push(d);
                            //console.log(d.getDebugOutput());
                        }, e => console.log("ERROR " + JSON.stringify(e)));
                        return;
                    }
                }

            }

            this.userData.cleanupUnusedDistances();

        }, 200);

        // This event listener will call addMarker() when the map is clicked.
        google.map.addListener('click', (event:any) => {
            //console.log(JSON.stringify(event));
            this.geocode.findAddressForCoordinates({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            }).subscribe(location => {
                this.markerService.addMarker(location, google.map);
                location.consumeType = this.userData.commuteFrequencies[0];
                this.userData.pointsOfInterests.push(location);
                this.zone.run(() => {
                });
            }, e => console.log("ERROR " + JSON.stringify(e)));
        });
    }

    /* FUNCTIONALITY FOR DATA MANIPULATION */

    locateLocation(location:Location) {
        google.map.setCenter(location.toGoogleLatLng());
    }

    // Removes a home or POI from the list of home locations. Also the markers are removed.
    deleteLocation(location:Location) {
        let indexFutureHomes = this.userData.futureHomes.indexOf(location, 0);
        if (indexFutureHomes > -1) {
            //console.log("Deleting home location " + JSON.stringify(location));
            // delete marker
            this.userData.futureHomes.splice(indexFutureHomes, 1);

            this.markerService.removeMarker(location);
            this.userData.removeDistancesTouchingLocation(location);

            return; // we know that
        }

        let indexPOIHomes = this.userData.pointsOfInterests.indexOf(location, 0);
        if (indexPOIHomes > -1) {
            //console.log("Deleting poi location " + JSON.stringify(location));
            // delete marker
            this.userData.pointsOfInterests.splice(indexPOIHomes, 1);

            this.markerService.removeMarker(location);
            this.userData.removeDistancesTouchingLocation(location);
        }
    }

    // is called in case the "add home" button is pressed in the gui.
    addFutureHome() {
        let location = new Location("", "", LocationCategory.HOME);
        this.userData.futureHomes.push(location);
    }

    // Adds a new Address to the Service.
    newAddress(location:Location, event:any) {
        // remove stuff associated with previous address
        this.markerService.removeMarker(location);
        this.userData.removeDistancesTouchingLocation(location);

        // set new data
        if (event['formatted_address'] != null) {
            location.address = event['formatted_address'];
            // when the address is set, the latitude and longitude have to reset as well
            location.latitude = null;
            location.longitude = null;
        }

        // add new stuff
        this.geocode.updateGeoData(location).subscribe(loc => {
            this.markerService.addMarker(loc, google.map);
        }, e => console.log("ERROR " + JSON.stringify(e)));
    }

    // is called in case the "add POI" button is pressed in the gui.
    addPOI() {
        let location = new Location("", "", LocationCategory.POI);
        location.consumeType = this.userData.commuteFrequencies[0];
        this.userData.pointsOfInterests.push(location);
    }

    /* FUNCTIONALITY FOR STATISTICS */
    calculateDistance(from:Location, to:Location):Distance {
        for (let distance of this.userData.distances) {
            if (distance.from.hasSameAddress(from) && distance.to.hasSameAddress(to)) {
                return distance;
            }
        }
        return new Distance(0, 0);
    }

    clearUserData() {
        for(let l of this.userData.pointsOfInterests) {
            this.deleteLocation(l);
        }
        for(let l of this.userData.futureHomes) {
            this.deleteLocation(l);
        }
    }

    // Statistics
    calculateKoalaRankingTime(home:Location):number /* in seconds */ {
        let result:number = 0;
        for (let poi of this.userData.pointsOfInterests) {
            // LOGGING console.log(poi);
            result = result + (poi.consumeType.weight * this.calculateDistance(home, poi).duration * 2);
        }
        // LOGGING console.log("Calculated koala score " + result + " for " + JSON.stringify(home));
        return result;
    }

    ngOnInit() {
        $("#loading").fadeOut(2000);
        $('.group-info').tooltip();
    }

}
