/**
 * time-panel.component
 */

import {
    Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges,
    SimpleChanges
} from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';

@Component({
    selector: 'dialog-time-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './time-panel.component.html',
    styleUrls: ['./time-panel.component.scss'],
})
export class TimePanelComponent implements OnChanges, OnInit {

    @Input() public selectedMoment: Moment;
    @Output() onSetTime = new EventEmitter<{ hour: number, min: number, sec: number, meridian: string }>();

    hourValue: number;
    minValue: number;
    secValue: number;
    meridianValue: string;
    hourFloor: number = 1;
    hourCeiling: number = 12;
    moment: Moment;
    hourTime: '12' | '24';
    themeColor: string;
    mode: 'popup' | 'dropdown' | 'inline';
    showSeconds: boolean;

    constructor( private service: PickerService ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {
        if (changes['selectedMoment']
            && !changes['selectedMoment'].isFirstChange()) {
            let moment = changes['selectedMoment'].currentValue;
            this.setTimePickerTimeValue(moment);
        }
    }

    public ngOnInit() {

        this.moment = this.service.moment.clone();
        this.hourTime = this.service.dtHourTime;
        this.themeColor = this.service.dtTheme;
        this.mode = this.service.dtMode;
        this.showSeconds = this.service.dtShowSeconds;

        this.setTimePickerTimeValue();
    }

    public setMeridian( meridian: string ): void {
        this.meridianValue = meridian;
    }

    public setTime(): void {
        this.onSetTime.emit({
            hour: this.hourValue,
            min: this.minValue,
            sec: this.secValue,
            meridian: this.meridianValue
        });
    }

    private setTimePickerTimeValue(moment?: Moment) {
        if(moment) {
            this.moment = moment.clone();
        }

        if (this.hourTime === '12') {
            if (this.moment.hours() <= 11) {
                this.hourValue = this.moment.hours();
            } else if (this.moment.hours() > 12) {
                this.hourValue = this.moment.hours() - 12;
            } else if (this.moment.hours() === 0 || this.moment.hours() === 12) {
                this.hourValue = 12;
            }
        }

        if (this.hourTime === '24') {
            this.hourValue = this.moment.hours();
            this.hourFloor = 0;
            this.hourCeiling = 23;
        }

        this.minValue = this.moment.minutes();
        this.secValue = this.moment.seconds();
        this.meridianValue = this.moment.clone().locale('en').format('A');
    }
}
