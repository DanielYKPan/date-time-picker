/**
 * time-panel.component
 */

import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
import { PickerService } from './picker.service';

@Component({
    selector: 'dialog-time-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './time-panel.component.html',
    styleUrls: ['./time-panel.component.scss'],
})
export class TimePanelComponent implements OnInit {

    @Input() dialogType: DialogType;
    @Output() onSetTime = new EventEmitter<boolean>();

    hourValue: number;
    minValue: number;
    meridianValue: string;
    hourFloor: number = 1;
    hourCeiling: number = 12;
    moment: Moment;
    hourTime: '12' | '24';
    theme: string;
    mode: 'popup' | 'dropdown' | 'inline';

    constructor( private service: PickerService ) {
    }

    public ngOnInit() {

        this.moment = this.service.moment.clone();
        this.hourTime = this.service.dtHourTime;
        this.theme = this.service.dtTheme;
        this.mode = this.service.dtMode;

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
        this.meridianValue = this.moment.format('A');
    }

    public setMeridian( meridian: string ): void {
        this.meridianValue = meridian;
    }

    public setTime(): void {
        this.service.setTime(this.hourValue, this.minValue, this.meridianValue);
        if (this.service.dtPickerType === 'time') {
            this.onSetTime.emit(true);
        } else {
            this.onSetTime.emit(false);
        }
    }
}
