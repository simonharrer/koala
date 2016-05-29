import {Pipe, PipeTransform} from "@angular/core";

const MINUTE:number = 60;
const HOUR:number = MINUTE * 60;
const DAY:number = HOUR * 24;

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
    transform(value:number):string {
        if (isNaN(value)) {
            return "-";
        }
        let duration:string = "";
        let valueLeft:number = value;
        if (value > DAY) {
            duration += Math.floor(value / DAY) + " d ";
            valueLeft = Math.floor(value % DAY);
        }
        if (value > HOUR && valueLeft > HOUR) {
            duration += Math.floor(valueLeft / HOUR) + " h ";
            valueLeft = Math.floor(valueLeft % HOUR);
        }
        if (value > MINUTE && valueLeft > MINUTE) {
            duration += Math.floor(valueLeft / MINUTE) + " min";
        }
        return duration;
    }
}
