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
    private now: Moment;
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

    }

    public select( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
        return;
    }

    public confirm(): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : moment();
        let selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.cancelDialog();
    }

    public setTime( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        this.selectedMoment = m.hours(moment.hours()).minutes(moment.minutes());
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
        } else {
            this.dialogType = type;
        }
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

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
