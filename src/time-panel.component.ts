/**
 * time-panel.component
 */

import {
    Component, OnInit, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dialog-time-panel',
    templateUrl: './time-panel.component.html',
    styleUrls: ['./time-panel.component.scss'],
})
export class TimePanelComponent implements OnInit, OnDestroy {

    @Output() onSetTime = new EventEmitter<{ hour: number, min: number, sec: number, meridian: string }>();

    hourValue: number;
    minValue: number;
    secValue: number;
    meridianValue: string;
    hourFloor: number = 1;
    hourCeiling: number = 12;
    timeSliderMoment: Moment;
    hourTime: '12' | '24';
    showSeconds: boolean;

    private subId: Subscription;

    constructor( private service: PickerService ) {
    }

    public ngOnInit() {
        this.hourTime = this.service.dtHourTime;
        this.showSeconds = this.service.dtShowSeconds;
        this.setTimePickerTimeValue(this.service.selectedMoment);

        this.subId = this.service.refreshCalendar.subscribe(
            ( data ) => {
                this.setTimePickerTimeValue(data);
            }
        );
    }

    public ngOnDestroy(): void {
        this.subId.unsubscribe();
    }

    public setMeridian( meridian: string ): void {
        if (this.service.dtDisabled) {
            return;
        }
        this.meridianValue = meridian;
    }

    public setTime(): void {
        if (this.service.dtDisabled) {
            return;
        }
        this.onSetTime.emit({
            hour: this.hourValue,
            min: this.minValue,
            sec: this.secValue,
            meridian: this.meridianValue
        });
    }

    private setTimePickerTimeValue( moment?: Moment ) {
        if (moment) {
            this.timeSliderMoment = moment.clone();
        } else {
            this.timeSliderMoment = this.service.now;
        }

        if (this.hourTime === '12') {
            if (this.timeSliderMoment.hours() <= 11) {
                this.hourValue = this.timeSliderMoment.hours();
            } else if (this.timeSliderMoment.hours() > 12) {
                this.hourValue = this.timeSliderMoment.hours() - 12;
            } else if (this.timeSliderMoment.hours() === 0 || this.timeSliderMoment.hours() === 12) {
                this.hourValue = 12;
            }
        }

        if (this.hourTime === '24') {
            this.hourValue = this.timeSliderMoment.hours();
            this.hourFloor = 0;
            this.hourCeiling = 23;
        }

        this.minValue = this.timeSliderMoment.minutes();
        this.secValue = this.timeSliderMoment.seconds();
        this.meridianValue = this.timeSliderMoment.clone().locale('en').format('A');
    }
}
