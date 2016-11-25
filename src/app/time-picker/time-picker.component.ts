/**
 * time-picker.component
 */

import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./time-picker.component.scss");
const myDpTpl: string = require("./time-picker.component.html");
// webpack2_

@Component({
    selector: 'time-picker',
    template: myDpTpl,
    styles: [myDpStyles],
})

export class TimePickerComponent implements OnInit {

    @Input() initTime: string;
    @Input() showSecond: boolean = true;
    @Input() viewFormat: string = 'hh:mm A';
    @Input() use12Hour: boolean = false;
    @Output() onSelectTime = new EventEmitter<string>();
    @Output() onTimePickerCancel = new EventEmitter<boolean>();
    private hourFormat = 'HH';
    private time: Moment;

    constructor() {
    }

    ngOnInit(): void {
        if(this.use12Hour) this.hourFormat = 'hh';
        this.time = this.initTime ? moment(this.initTime, this.viewFormat) : moment();
    }

    increaseHour(): void {
        this.time = this.time.clone().add(1, 'h');
    }

    decreaseHour(): void {
        this.time = this.time.clone().subtract(1, 'h');
    }

    increaseMinute() {
        this.time = this.time.clone().add(1, 'm');
    }

    decreaseMinute() {
        this.time = this.time.clone().subtract(1, 'm');
    }

    increaseSecond(): void {
        this.time = this.time.clone().add(1, 's');
    }

    decreaseSecond(): void {
        this.time = this.time.clone().subtract(1, 's');
    }

    selectTime(): void {
        let selectTime = this.time.format(this.viewFormat);
        this.onSelectTime.emit(selectTime);
        this.cancelTimePicker();
        return;
    }

    selectNow(): void {
        let selectTime = moment().format(this.viewFormat);
        this.onSelectTime.emit(selectTime);
        this.cancelTimePicker();
        return;
    }

    clearTime(): void {
        this.onSelectTime.emit(null);
        this.cancelTimePicker();
        return;
    }

    cancelTimePicker(): void {
        this.onTimePickerCancel.emit(false);
        return;
    }
}
