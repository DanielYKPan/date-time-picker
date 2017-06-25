/**
 * moment.pipe
 */

import { Pipe, PipeTransform } from '@angular/core';
import { PickerService } from './picker.service';
import { Moment } from 'moment/moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe implements PipeTransform {

    constructor( private service: PickerService ) {
    }

    transform( moment: Moment, format?: string ): string {
        return format ? moment.locale(this.service.dtLocale).format(format) :
            moment.locale(this.service.dtLocale).format('MMM DD, YYYY');
    }
}
