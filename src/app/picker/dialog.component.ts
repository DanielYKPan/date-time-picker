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
    private selectedMoment: Moment;
    private directiveInstance: any;
    private directiveElementRef: ElementRef;
    private calendarDays: Moment[];
    private now: Moment;
    private dayNames: string[];
    private monthList: string[];
    private yearList: number[] = [];
    private dialogType: DialogType;

    private dtLocale: string;
    private dtViewFormat: string;
    private dtReturnObject: string;
    private dtDialogType: DialogType;

    constructor() {
    }

    public ngOnInit() {
        this.openDialog(this.initialValue, false);
    }

    public openDialog( moment: any, emit: boolean = true ): void {
        this.show = true;
        this.dialogType = this.dtDialogType;
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

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any,
                      dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtDialogType: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;
        this.dtLocale = dtLocale;
        this.dtViewFormat = dtViewFormat;
        this.dtReturnObject = dtReturnObject;

        if (dtDialogType === 'time') {
            this.dtDialogType = DialogType.Time;
        } else {
            this.dtDialogType = DialogType.Date;
        }

        // set moment locale (default is en)
        moment.locale(this.dtLocale);

        // set now value
        this.now = moment();

        // set week days name array
        this.dayNames = moment.weekdaysShort(true);
        // set month name array
        this.monthList = moment.monthsShort();
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
        this.selectedMoment = this.moment.clone().add(daysDifference, 'd');
        if (this.selectedMoment.year() !== this.moment.year() ||
            this.selectedMoment.month() !== this.moment.month()) {
            this.moment = this.selectedMoment.clone();
            this.generateCalendar();
        }
        return;
    }

    public selectToday(): void {
        this.selectedMoment = this.moment.clone()
            .year(this.now.year())
            .month(this.now.month())
            .dayOfYear(this.now.dayOfYear());
        if (this.selectedMoment.year() !== this.moment.year() ||
            this.selectedMoment.month() !== this.moment.month()) {
            this.moment = this.selectedMoment.clone();
            this.generateCalendar();
        }
        return;
    }

    public selectMonth( month: string ): void {
        this.moment = this.moment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Month);
        return;
    }

    public selectYear( year: number ): void {
        this.moment = this.moment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(DialogType.Year);
        return;
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = this.dtDialogType;
            return;
        }

        this.dialogType = type;
        if (type === DialogType.Year) {
            this.generateYearList();
        }
        return;
    }

    public generateYearList( param?: string ): void {
        let start;

        if (param === 'prev') {
            start = this.yearList[0] - 9;
        } else if (param === 'next') {
            start = this.yearList[8] + 1;
        } else {
            start = +this.moment.clone().subtract(4, 'y').format('YYYY');
        }

        for (let i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    }

    public confirm(): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : moment();
        let selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.cancelDialog();
    }

    private setMomentFromString( value: any, emit: boolean = true ) {
        if (value) {
            this.moment = this.dtReturnObject === 'string' ? moment(value, this.dtViewFormat) :
                moment(value);
            this.selectedMoment = this.moment.clone();
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

enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
