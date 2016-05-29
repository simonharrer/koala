import {LocationCategory} from "./location_category";
import {CommuteFrequency} from "./commute_frequency";

/**
 * Location
 *
 * Fix points given by the user
 */
export class Location {
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    category: LocationCategory;
    consumeType:CommuteFrequency;

    constructor(name:string, address:string, category:LocationCategory) {
        this.name = name;
        this.address = address;
        this.category = category;
    }

    toGoogleLatLng() {
        return {lat: this.latitude, lng: this.longitude};
    }

    hasSameAddress(other:Location) {
        return this.address == other.address;
    }


}

