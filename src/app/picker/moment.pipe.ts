/**
 * moment.pipe
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment/moment';

@Pipe({
    name: 'moment'
})
export class MomentPipe implements PipeTransform {
    transform( moment: Moment, format?: string ): string {
        return format ? moment.format(format) : moment.format('MMM DD, YYYY');
    }
}
