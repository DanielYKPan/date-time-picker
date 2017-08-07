import { PipeTransform } from '@angular/core';
import { PickerService } from './picker.service';
import { Moment } from 'moment/moment';
export declare class MomentPipe implements PipeTransform {
    private service;
    constructor(service: PickerService);
    transform(moment: Moment, format?: string): string;
}
