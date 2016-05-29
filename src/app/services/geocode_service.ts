declare var google: any;

import {Location} from "./../model/location";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import {LocationGoogle} from "../model/location_google";
import {LocationCategory} from "../model/location_category";

export class GeocodeService {

    api:any;

    constructor() {
        this.api = new google.maps.Geocoder();
    }

    enrichWithGeoData(location:Location):Observable<Location> {
        if(!(location.latitude == null || location.longitude == null)) {
            //console.log("Location " + JSON.stringify(location) + " already has a geo location, hence, it is skipped for auto completion");
            return new Observable((observer:Observer<Location>) => {
                observer.next(location);
                observer.complete();
            });
        }

        return this.updateGeoData(location);
    }

    updateGeoData(location:Location):Observable<Location> {
        return new Observable((observer:Observer<Location>) => {
            //console.log("Finding latitude and longitude for " + JSON.stringify(location));
            this.api.geocode({"address": location.address}, function (results:any, status:any) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var lat = results[0].geometry.location.lat(),
                        lng = results[0].geometry.location.lng();


                    let l = new Location(location.name, location.address, location.category);
                    location.latitude = lat;
                    location.longitude = lng;
                    l.latitude = lat;
                    l.longitude = lng;
                    //console.log("Location " + JSON.stringify(l) + " enriched with geocode information");
                    observer.next(l);
                    observer.complete();
                } else {
                    console.log("GEOCODE update geo data: " + status);
                    observer.error(status);
                }
            });
        });
    }

    findAddressForCoordinates(coordinates: LocationGoogle):Observable<Location> {
        return new Observable((observer:Observer<Location>) => {
            //console.log("Finding address for latitude " + coordinates.lat + " and longitude " + coordinates.lng);
            this.api.geocode({"location": coordinates}, function (results:any, status:any) {
                console.log(results);
                if (status == google.maps.GeocoderStatus.OK) {
                    let name = results[0].address_components[0].short_name +
                        ", " +
                        results[0].address_components[1].short_name +
                        ", " +
                        results[0].address_components[2].short_name;
                    let l = new Location(name, results[0].formatted_address, LocationCategory.POI);
                    l.latitude = coordinates.lat;
                    l.longitude = coordinates.lng;
                    //console.log("Location " + JSON.stringify(l) + " enriched with geocode information");
                    observer.next(l);
                    observer.complete();
                } else {
                    console.log("GEOCODE find address for geo data: " + status);
                    observer.error(status);
                }
            });
        });
    }

}
