/**
 * date-picker.component
 */

import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./date-picker.component.scss");
const myDpTpl: string = require("./date-picker.component.html");
// webpack2_

@Component({
    selector: 'date-picker',
    template: myDpTpl,
    styles: [myDpStyles],
})

export class DatePickerComponent implements OnInit {

    dayNames: Array<string> = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    @Input() initDate: string;
    @Input() firstWeekDayMonday: boolean = false;
    @Input() viewFormat: string = 'MMM DD, YYYY';
    @Output() onDatePickerCancel = new EventEmitter<boolean>();
    @Output() onSelectDate = new EventEmitter<string>();

    calendarDate: Moment;
    selectedDate: Moment;
    today: Moment;
    calendarDays: Array<Moment>;

    constructor() {
    }

    ngOnInit(): void {
        this.initValue();
        this.generateCalendar();
    }

    prevMonth(): void {
        this.calendarDate = this.calendarDate.clone().subtract(1, 'M');
        this.generateCalendar();
    }

    nextMonth(): void {
        this.calendarDate = this.calendarDate.clone().add(1, 'M');
        this.generateCalendar();
    }

    selectDay( day: Moment ): void {
        let selectedDay = day.format(this.viewFormat);
        this.onSelectDate.emit(selectedDay);
        this.cancelDatePicker();
        return;
    }

    selectToday(): void {
        let today = this.today.format(this.viewFormat);
        this.onSelectDate.emit(today);
        this.cancelDatePicker();
        return;
    }

    clearPickDate(): void {
        this.onSelectDate.emit(null);
        this.cancelDatePicker();
        return;
    }

    cancelDatePicker(): void {
        this.onDatePickerCancel.emit(false);
        return;
    }

    protected initValue() {

        // set today value
        this.today = moment().startOf('date');

        if (this.firstWeekDayMonday) {
            let sun = this.dayNames.shift();
            this.dayNames.push(sun);
        }

        // check if the input initDate has value
        if (this.initDate) {
            this.calendarDate = moment(this.initDate, this.viewFormat).startOf('date');
            this.selectedDate = this.calendarDate.clone();
        } else {
            this.calendarDate = this.today.clone();
        }
    }

    protected generateCalendar(): void {
        this.calendarDays = [];

        let start: number;
        if (this.firstWeekDayMonday) {
            start = 0 - (this.calendarDate.clone().startOf('month').day() + 6) % 7; // iterator starting point
        } else {
            start = 0 - this.calendarDate.clone().startOf('month').day(); // iterator starting point
        }

        let end = 41 + start; // iterator ending point

        for (let i = start; i <= end; i += 1) {
            let day = this.calendarDate.clone().startOf('month').add(i, 'days');
            this.calendarDays.push(day);
        }
    }
}
