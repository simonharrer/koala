import {Location} from "./location";
import {CommuteFrequency} from "./commute_frequency";
import {Distance} from "./distance";
import {LocationCategory} from "./location_category";

/**
 * All user data in a single spot
 */
export class UserData {

    futureHomes:Location[] = [];

    pointsOfInterests:Location[] = [];

    distances:Distance[] = [];

    commuteFrequencies:CommuteFrequency[] = [new CommuteFrequency("7 times a week - daily", 7),
        new CommuteFrequency("5 times a week - on workdays", 5),
        new CommuteFrequency("3 times a week", 3),
        new CommuteFrequency("2 times a week", 2),
        new CommuteFrequency("1 time a week - weekly", 1),
        new CommuteFrequency("0 times a week - rarely", 0)];

    public populateWithExampleData() {
        this.futureHomes.push(new Location("Current Flat", "900 Orchid Way, San Jose, CA 95117, USA", LocationCategory.HOME));
        this.futureHomes.push(new Location("Home Freemont", "35088 Lido Blvd, Newark, CA 94560, USA", LocationCategory.HOME));
        this.futureHomes.push(new Location("Home Menlo Park", "1380 Johnson St, Menlo Park, CA 94025, USA", LocationCategory.HOME));

        let workMatt = new Location("Office Matt", "Google Inc. 1600 Amphitheatre Parkway Mountain View, CA 94043 USA", LocationCategory.POI);
        workMatt.consumeType = this.commuteFrequencies[1];
        this.pointsOfInterests.push(workMatt);

        let workLinda = new Location("Work Linda", "Stanford Hospital, 300 Pasteur Dr, Stanford, CA 94305", LocationCategory.POI);
        workLinda.consumeType = this.commuteFrequencies[1];
        this.pointsOfInterests.push(workLinda);

        let golfMatt = new Location("Golf Club", "Palo Alto Hills Golf and Country Club, 3000 Alexis Dr, Palo Alto, CA 94304", LocationCategory.POI);
        golfMatt.consumeType = this.commuteFrequencies[3];
        this.pointsOfInterests.push(golfMatt);

        let parents = new Location("Parents", "37499 Ash St, Newark, CA 94560, USA", LocationCategory.POI);
        parents.consumeType = this.commuteFrequencies[5];
        this.pointsOfInterests.push(parents);
    }

    public clear() {
        this.futureHomes.length = 0;
        this.pointsOfInterests.length = 0;
    }

    cleanupUnusedDistances() {
        for (let distance of this.distances) {
            let isStillUsed:boolean = false;
            for (let home of this.futureHomes) {
                isStillUsed = isStillUsed || home.address == distance.from.address;
            }
            if (!isStillUsed) {
                this.removeDistance(distance);
            }
        }
    }

    removeDistancesTouchingLocation(location:Location) {
        for (let distance of this.distances) {
            if (distance.from == location || distance.to == location) {
                this.removeDistance(distance);
            }
        }
    }

    removeDistance(distance:Distance) {
        distance.clearFromMap();
        UserData.deleteItemInArray(distance, this.distances);
    }

    private static deleteItemInArray(item:any, array:any[]) {
        let index = array.indexOf(item, 0);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

}
