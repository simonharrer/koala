import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'json'})
export class JsonPipe implements PipeTransform {
    transform(value: any): string {
        return JSON.stringify(value);
    }
}
