/**
 * dialog.component
 */

import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./dialog.component.scss");
const myDpTpl: string = require("./dialog.component.html");
// webpack2_

@Component({
    selector: 'date-time-dialog',
    template: myDpTpl,
    styles: [myDpStyles],
})
export class DialogComponent implements OnInit {

    private show: boolean;
    private moment: Moment;
    private initialValue: string;
    private selectedDate: Moment;
    private directiveInstance: any;
    private directiveElementRef: ElementRef;
    private calendarDays: Moment[];
    private today: Moment;
    private dayNames: string[];

    private dtLocale: string;
    private dtViewFormat: string;
    private dtReturnObject: string;

    constructor() {
    }

    public ngOnInit() {
        this.openDialog(this.initialValue, false);
    }

    public openDialog( moment: any, emit: boolean = true ): void {
        this.show = true;
        this.setInitialMoment(moment);
        this.setMomentFromString(moment, emit);
        this.generateCalendar();
        return;
    }

    public cancelDialog(): void {
        this.show = false;
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any, dtLocale: string, dtViewFormat: string, dtReturnObject: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;
        this.dtLocale = dtLocale;
        this.dtViewFormat = dtViewFormat;
        this.dtReturnObject = dtReturnObject;

        // set moment locale (default is en)
        moment.locale(this.dtLocale);

        // set today value
        this.today = moment().startOf('date');

        // set week days name array
        this.dayNames = moment.weekdaysShort(true);
    }

    public prevMonth(): void {
        this.moment = this.moment.clone().subtract(1, 'M');
        this.generateCalendar();
    }

    public nextMonth(): void {
        this.moment = this.moment.clone().add(1, 'M');
        this.generateCalendar();
    }

    public select( moment: Moment ): void {
        let daysDifference = moment.diff(this.moment.clone().startOf('date'), 'days');
        moment = this.moment.clone().add(daysDifference, 'd');
        let selectedMoment = this.parseToReturnObjectType(moment);
        this.directiveInstance.momentChanged(selectedMoment);
        this.cancelDialog();
        return;
    }

    public selectToday(): void {
        let today = this.parseToReturnObjectType(moment());
        this.directiveInstance.momentChanged(today);
        this.cancelDialog();
        return;
    }

    private setMomentFromString( value: any, emit: boolean = true ) {
        if (value) {
            this.moment = this.dtReturnObject === 'string' ? moment(value, this.dtViewFormat) :
                moment(value);
            this.selectedDate = this.moment.clone().startOf('date');
        } else {
            this.moment = moment();
        }
    }

    private generateCalendar(): void {
        this.calendarDays = [];
        let start = 0 - (this.moment.clone().startOf('month').day() + (7 - moment.localeData().firstDayOfWeek())) % 7;
        let end = 41 + start; // iterator ending point

        for (let i = start; i <= end; i += 1) {
            let day = this.moment.clone().startOf('month').add(i, 'days');
            this.calendarDays.push(day);
        }
    }

    private parseToReturnObjectType( day: Moment ): any {
        switch (this.dtReturnObject) {
            case 'js':
                return day.toDate();

            case 'string':
                return day.format(this.dtViewFormat);

            case 'moment':
                return day;

            case 'json':
                return day.toJSON();

            case 'array':
                return day.toArray();

            case 'iso':
                return day.toISOString();

            case 'object':
                return day.toObject();

            default:
                return day;
        }
    }
}
