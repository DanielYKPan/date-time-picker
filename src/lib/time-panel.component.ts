/**
 * time-panel.component
 */

import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./time-panel.component.scss");
const myDpTpl: string = require("./time-panel.component.html");
// webpack2_

@Component({
    selector: 'dialog-time-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: myDpTpl,
    styles: [myDpStyles],
})
export class TimePanelComponent implements OnInit {

    @Input() moment: Moment;
    @Input() now: Moment;
    @Input() hourTime: '12' | '24';
    @Input() dialogType: DialogType;
    @Output() onSetTime = new EventEmitter<Moment>();

    hourValue: number;
    minValue: number;
    meridianValue: string;
    hourFloor: number = 1;
    hourCeiling: number = 12;

    constructor() {
    }

    public ngOnInit() {
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
        let selectedMoment = this.moment.clone();

        if (this.hourTime === '12') {
            if (this.meridianValue === 'AM') {
                if (this.hourValue === 12) {
                    selectedMoment.hours(0);
                } else {
                    selectedMoment.hours(this.hourValue);
                }
            } else {
                if (this.hourValue === 12) {
                    selectedMoment.hours(12);
                } else {
                    selectedMoment.hours(this.hourValue + 12);
                }
            }
        }

        if (this.hourTime === '24') {
            selectedMoment.hours(this.hourValue);
        }
        selectedMoment.minutes(this.minValue);
        this.onSetTime.emit(selectedMoment);
    }
}
