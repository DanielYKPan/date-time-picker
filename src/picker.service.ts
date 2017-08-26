/**
 * picker.service
 */

import { Injectable } from '@angular/core';
import { DialogType } from './dialog.component';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PickerService {

    public refreshCalendarSource: Subject<Moment> = new Subject<Moment>();
    public refreshCalendar: Observable<Moment> = this.refreshCalendarSource.asObservable();

    /* Property _dtAutoClose */
    private _dtAutoClose: boolean;

    get dtAutoClose(): boolean {
        return this._dtAutoClose;
    }

    /* Property _dtDisabled */
    private _dtDisabled: boolean;

    get dtDisabled(): boolean {
        return this._dtDisabled;
    }

    set dtDisabled( value: boolean ) {
        this._dtDisabled = value;
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

    /* Property _dtMinMoment */
    private _dtMinMoment: Moment;

    get dtMinMoment(): Moment {
        return this._dtMinMoment;
    }

    /* Property _dtMaxMoment */
    private _dtMaxMoment: Moment;

    get dtMaxMoment(): Moment {
        return this._dtMaxMoment;
    }

    /* Property _selectedMoment */
    private _selectedMoment: Moment;
    set selectedMoment( value: Moment ) {
        if (value === null) {
            this._selectedMoment = null;
        } else if (!this._selectedMoment || !this._selectedMoment.isSame(value)) {
            this._selectedMoment = value.clone();
        }
        this.emitSelectedMoment();
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
                             dtHourTime: '12' | '24',
                             dtPickerType: 'both' | 'date' | 'time',
                             dtShowSeconds: boolean, dtOnlyCurrentMonth: boolean,
                             dtMinMoment: string, dtMaxMoment: string ): void {
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
        this.setMinMoment(dtMinMoment);
        this.setMaxMoment(dtMaxMoment);
        this.dtPickerType = dtPickerType;
    }

    public setMoment( value: any ): void {
        if (value) {
            let m = this._dtReturnObject === 'string' ?
                this.momentFunc(value, this._dtViewFormat) :
                this.momentFunc(value);
            if (m.isValid()) {
                this.selectedMoment = m.clone();
            } else {
                this.selectedMoment = null;
            }
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

        // Check if the moment's day has already been selected
        if (this._selectedMoment &&
            this._selectedMoment.isSame(moment, 'day')) {
            return true;
        }

        let m = this._selectedMoment ? this._selectedMoment.clone() : this._now;
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        m = m.clone().add(daysDifference, 'd');
        if (!this.isValidMoment(m)) {
            return false;
        } else {
            this.selectedMoment = m;
            return true;
        }
    }

    /**
     * Set the time moment to selectedMoment
     * @param hour {number}
     * @param minute {number}
     * @param second {number}
     * @param meridian {string}
     * @returns {boolean}
     * */
    public setTime( hour: number, minute: number, second: number, meridian: string ): boolean {
        let m = this._selectedMoment ? this._selectedMoment.clone() : this._now;

        if (this.dtHourTime === '12') {
            if (meridian === 'AM') {
                if (hour === 12) {
                    m = m.clone().hours(0);
                } else {
                    m = m.clone().hours(hour);
                }
            } else {
                if (hour === 12) {
                    m = m.clone().hours(12);
                } else {
                    m = m.clone().hours(hour + 12);
                }
            }
        } else if (this.dtHourTime === '24') {
            m = m.clone().hours(hour);
        }
        m = m.clone().minutes(minute);
        m = m.clone().seconds(second);

        if (!this.isValidMoment(m)) {
            return false;
        } else {
            this.selectedMoment = m;
            return true;
        }
    }

    /**
     * Emit the selected moment
     *
     * */
    public emitSelectedMoment(): void {
        this.refreshCalendarSource.next(this._selectedMoment);
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
        if (this._dtMinMoment) {
            let minDate = this._dtMinMoment.clone().startOf('day');
            isValid = isValid && this.momentFunc(moment).isSameOrAfter(minDate);
        }
        if (this._dtMaxMoment) {
            let maxDate = this._dtMaxMoment.clone().endOf('day');
            isValid = isValid && this.momentFunc(moment).isSameOrBefore(maxDate);
        }
        return isValid
    }

    /**
     * Check if the provided moment is valid between minMoment and maxMoment
     * @param moment
     * @returns {boolean}
     * */
    public isValidMoment( moment: Moment ): boolean {
        let isValid = true;
        if (this._dtMinMoment) {
            isValid = isValid && this.momentFunc(moment).isSameOrAfter(this._dtMinMoment);
        }
        if (this._dtMaxMoment) {
            isValid = isValid && this.momentFunc(moment).isSameOrBefore(this._dtMaxMoment);
        }
        return isValid
    }

    /**
     * Check if the days is the same day
     * @param day_1 {Moment}
     * @param day_2 {Moment}
     * @returns {boolean}
     * */
    public isTheSameDay( day_1: Moment, day_2?: Moment ): boolean {
        if(day_2) {
            return day_1 && day_2 && day_1.isSame(day_2, 'date');
        }else {
            return day_1 && this._selectedMoment && day_1.isSame(this._selectedMoment, 'date');
        }
    }

    /**
     * Reset the minMoment and maxMoment
     * @param minString
     * @param maxString
     * */
    public resetMinMaxMoment( minString: string, maxString: string ): void {
        this.setMinMoment(minString);
        this.setMaxMoment(maxString);
        this.refreshCalendarSource.next(this._selectedMoment);
    }

    /**
     * Set property _dtMinMoment value
     * */
    private setMinMoment( minString: string ): void {
        if (this.momentFunc(minString, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
            this._dtMinMoment = this.momentFunc(minString, "YYYY-MM-DD HH:mm:ss", true);
        } else if (this.momentFunc(minString, "YYYY-MM-DD", true).isValid()) {
            this._dtMinMoment = this.momentFunc(minString, "YYYY-MM-DD", true);
        } else {
            this._dtMinMoment = null;
        }
    }

    /**
     * Set property _dtMaxMoment value
     * */
    private setMaxMoment( maxString: string ): void {
        if (this.momentFunc(maxString, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
            this._dtMaxMoment = this.momentFunc(maxString, "YYYY-MM-DD HH:mm:ss", true);
        } else if (this.momentFunc(maxString, "YYYY-MM-DD", true).isValid()) {
            this._dtMaxMoment = this.momentFunc(maxString, "YYYY-MM-DD", true).endOf('day');
        } else {
            this._dtMaxMoment = null;
        }
    }
}
