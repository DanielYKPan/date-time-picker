/**
 * moment.pipe.spec
 */

import { MomentPipe } from './moment.pipe';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';

describe('MomentPipe', () => {
    let defaultFormat: string;
    let nowMoment: Moment;
    let service = new PickerService();
    let pipe = new MomentPipe(service);

    beforeEach(() => {
        defaultFormat = 'MMM DD, YYYY';
        nowMoment = moment();
    });

    it('should transform "nowMoment" to a string formatted as defaultFormat', () => {
        expect(pipe.transform(nowMoment)).toBe(nowMoment.format(defaultFormat));
    });

    it('should transform "nowMoment" to a string formatted as a provided format', () => {
        let providedFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
        expect(pipe.transform(nowMoment, providedFormat)).toBe(nowMoment.format(providedFormat));
    })
});
