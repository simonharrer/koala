declare var google:any;
declare namespace google {
}
;

import {Location} from "./../model/location";
import {Distance} from "../model/distance";
import {Observer} from "rxjs/Observer";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {Injectable} from "@angular/core";

@Injectable()
export class DirectionsService {

    api:any;

    constructor() {
        this.api = new google.maps.DirectionsService();
    }

    getDirection(from:Location, to:Location):Observable<Distance> {
        return new Observable((observer:Observer<Distance>) => {
            //console.log("Direction from " + JSON.stringify(from) + " to " + JSON.stringify(to));
            this.api.route({
                origin: from.address,
                destination: to.address,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response:any, status:any) {
                if (status === google.maps.DirectionsStatus.OK) {
                    observer.next(DirectionsService.extractData(response, from, to));
                    //console.log("Google Directions Service called successfully");
                    observer.complete();
                } else {
                    console.log("NO RESULT FOR QUERY, whatever");

                    //observer.error(status);
                }
            });

        });
    }

    private static extractData(input:any, from:Location, to:Location):Distance {
        var result = new Distance(-1, -1);

        result.from = from;
        result.to = to;

        result.distance = input.routes[0].legs[0].distance.value;
        result.duration = input.routes[0].legs[0].duration.value;

        result.raw = input;

        //console.log("Distance for direction found: " + result.distance + " meter and " + result.duration + " seconds");

        return result;
    }


}
