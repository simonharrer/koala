import { Pipe, PipeTransform } from '@angular/core';

const KM:number = 1000;

@Pipe({name: 'distance'})
export class DistancePipe implements PipeTransform {
    transform(value: number): string {
        if(value > KM) {
            return this.round(value / KM) + " km";
        } else {
            return value + " m";
        }
    }

    round(value:number) {
        return value.toFixed(1);
    }
}
