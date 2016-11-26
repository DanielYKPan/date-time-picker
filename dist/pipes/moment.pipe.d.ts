import { PipeTransform } from '@angular/core';
import { Moment } from 'moment/moment';
export declare class MomentPipe implements PipeTransform {
    transform(moment: Moment, format?: string): string;
}
