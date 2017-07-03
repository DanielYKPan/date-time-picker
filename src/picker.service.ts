/**
 * picker.service
 */

import { Injectable } from '@angular/core';
import { DialogType } from './dialog.component';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { Observable } from 'rxjs/Rx';
import { shadeBlendConvert } from './utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class PickerService {

    public selectedMomentSource: BehaviorSubject<Moment> = new BehaviorSubject<Moment>(null);
    public selectedMomentChange: Observable<Moment> = this.selectedMomentSource.asObservable();

    /* Property _dtAutoClose */
    private _dtAutoClose: boolean;

    get dtAutoClose(): boolean {
        return this._dtAutoClose;
    }

    /* Property _dtLocale */
    private _dtLocale: string;

    get dtLocale(): string {
        return this._dtLocale;
    }

    /* Property _dtViewFormat */
    private _dtViewFormat: string;

    get dtViewFormat(): string {
        return this._dtViewFormat;
    }

    /* Property _dtReturnObject */
    private _dtReturnObject: string;

    get dtReturnObject(): string {
        return this._dtReturnObject;
    }

    /* Property _dtDialogType */
    private _dtDialogType: DialogType;

    get dtDialogType(): DialogType {
        return this._dtDialogType;
    }

    /* Property _dtPickerType */
    private _dtPickerType: 'both' | 'date' | 'time';

    get dtPickerType(): 'both' | 'date' | 'time' {
        return this._dtPickerType;
    }

    set dtPickerType( value: 'both' | 'date' | 'time' ) {
        this._dtPickerType = value;
        if (value === 'both' || value === 'date') {
            this._dtDialogType = DialogType.Date;
        } else if (value === 'time') {
            this._dtDialogType = DialogType.Time;
        }
    }

    /* Property _dtPosition */
    private _dtPosition: 'top' | 'right' | 'bottom' | 'left';

    get dtPosition(): 'top' | 'right' | 'bottom' | 'left' {
        return this._dtPosition;
    }


    /* Property _dtPositionOffset */
    private _dtPositionOffset: string;

    get dtPositionOffset(): string {
        return this._dtPositionOffset;
    }

    /* Property _dtMode */
    private _dtMode: 'popup' | 'dropdown' | 'inline';

    get dtMode(): 'popup' | 'dropdown' | 'inline' {
        return this._dtMode;
    }

    /* Property _dtHourTime */
    private _dtHourTime: '12' | '24';

    get dtHourTime(): '12' | '24' {
        return this._dtHourTime;
    }

    /* Property _dtTheme */
    private _dtTheme: string;

    get dtTheme(): string {
        return this._dtTheme;
    }

    set dtTheme( value: string ) {
        this._dtTheme = shadeBlendConvert(0, value) || '#0070ba';
    }

    /* Property _dtShowSeconds */
    private _dtShowSeconds: boolean;

    get dtShowSeconds(): boolean {
        return this._dtShowSeconds;
    }

    /* Property _dtOnlyCurrentMonth */
    private _dtOnlyCurrentMonth: boolean;

    get dtOnlyCurrentMonth(): boolean {
        return this._dtOnlyCurrentMonth;
    }

    /* Property _dtMinDate */
    private _dtMinDate: Moment;

    get dtMinDate(): Moment {
        return this._dtMinDate;
    }

    /* Property _dtMaxDate */
    private _dtMaxDate: Moment;

    get dtMaxDate(): Moment {
        return this._dtMaxDate;
    }

    /* Property _selectedMoment */
    private _selectedMoment: Moment;
    set selectedMoment( value: Moment ) {
        if (value === null) {
            this._selectedMoment = null;
        } else if (!this._selectedMoment || !this._selectedMoment.isSame(value)) {
            this._selectedMoment = value.clone();
        }
        this.selectedMomentSource.next(this._selectedMoment);
    }

    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    /* Property _now */
    private _now: Moment = this.momentFunc();

    get now(): Moment {
        return this._now.clone();
    }

    constructor() {
    }

    public setPickerOptions( dtAutoClose: boolean, dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                             dtPosition: 'top' | 'right' | 'bottom' | 'left',
                             dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                             dtHourTime: '12' | '24', dtTheme: string,
                             dtPickerType: 'both' | 'date' | 'time',
                             dtShowSeconds: boolean, dtOnlyCurrentMonth: boolean,
                             dtMinDate: string, dtMaxDate: string ): void {
        this._dtAutoClose = dtAutoClose;
        this._dtLocale = dtLocale;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPosition = dtPosition;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtShowSeconds = dtShowSeconds;
        this._dtOnlyCurrentMonth = dtOnlyCurrentMonth;
        this._dtMinDate = this.momentFunc(dtMinDate, "YYYY-MM-DD");
        this._dtMaxDate = this.momentFunc(dtMaxDate, "YYYY-MM-DD");
        this.dtPickerType = dtPickerType;
        this.dtTheme = dtTheme;
    }

    public setMoment( value: any ): void {
        if (value) {
            this.selectedMoment = this._dtReturnObject === 'string' ?
                this.momentFunc(value, this._dtViewFormat) :
                this.momentFunc(value);
        } else {
            this.selectedMoment = null;
        }
    }

    /**
     * Set the date moment to selectedMoment
     * @param moment
     * @returns {boolean}
     * */
    public setDate( moment: Moment ): boolean {
        if (!this.isValidDate(moment)) {
            return false;
        }
        let m = this._selectedMoment ? this._selectedMoment.clone() : this._now;
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
        return true;
    }

    public setTime( hour: number, minute: number, second: number, meridian: string ) {
        let m = this._selectedMoment ? this._selectedMoment.clone() : this._now;

        if (this.dtHourTime === '12') {
            if (meridian === 'AM') {
                if (hour === 12) {
                    m.hours(0);
                } else {
                    m.hours(hour);
                }
            } else {
                if (hour === 12) {
                    m.hours(12);
                } else {
                    m.hours(hour + 12);
                }
            }
        } else if (this.dtHourTime === '24') {
            m.hours(hour);
        }
        m.minutes(minute);
        m.seconds(second);
        this.selectedMoment = m;
    }

    public parseToReturnObjectType(): any {
        if (!this._selectedMoment) {
            return;
        }
        switch (this.dtReturnObject) {
            case 'string':
                return this._selectedMoment.format(this.dtViewFormat);

            case 'moment':
                return this._selectedMoment;

            case 'json':
                return this._selectedMoment.toJSON();

            case 'array':
                return this._selectedMoment.toArray();

            case 'iso':
                return this._selectedMoment.toISOString();

            case 'object':
                return this._selectedMoment.toObject();

            case 'js':
            default:
                return this._selectedMoment.toDate();
        }
    }

    /**
     * Check if the provided moment is valid between minDate and maxDate
     * @param moment
     * @returns {boolean}
     * */
    public isValidDate( moment: Moment ): boolean {
        let isValid = true;
        if (this._dtMinDate.isValid()) {
            isValid = isValid && this.momentFunc(moment).isSameOrAfter(this._dtMinDate);
        }
        if (this._dtMaxDate.isValid()) {
            isValid = isValid && this.momentFunc(moment).isSameOrBefore(this._dtMaxDate);
        }
        return isValid
    }

    /**
     * Check if the days is the same day
     * @param day_1 {Moment}
     * @param day_2 {Moment}
     * @returns {boolean}
     * */
    public isTheSameDay( day_1: Moment, day_2: Moment ): boolean {
        return day_1 && day_2 && day_1.isSame(day_2, 'date');
    }
}
