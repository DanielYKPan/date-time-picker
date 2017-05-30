/**
 * picker.service
 */

import { Injectable } from '@angular/core';
import { DialogType } from './dialog.component';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { Observable, Subject } from 'rxjs/Rx';
import { shadeBlendConvert } from './utils';

@Injectable()
export class PickerService {

    public selectedMomentSource: Subject<Moment> = new Subject<Moment>();
    public selectedMomentChange: Observable<Moment> = this.selectedMomentSource.asObservable();

    /* Property _dtLocale */
    private _dtLocale: string;

    get dtLocale(): string {
        return this._dtLocale;
    }
    /* Property _dtLocale */
    private _dtMinDate: string;

    get dtMinDate(): string {
        return this._dtMinDate;
    }

    /* Property _dtLocale */
    private _dtMaxDate: string;

    get dtMaxDate(): string {
        return this._dtMaxDate;
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

    /* Property _dtOnlyCurrent */
    private _dtOnlyCurrent: boolean;

    get dtOnlyCurrent(): boolean {
        return this._dtOnlyCurrent;
    }

    /* Property _moment */
    private _moment: Moment;

    get moment(): Moment {
        return this._moment;
    }

    /* Property _selectedMoment */
    private _selectedMoment: Moment;

    get selectedMoment(): Moment {
        return this._selectedMoment;
    }

    set selectedMoment( value: Moment ) {
        if (!this._selectedMoment || !this._selectedMoment.isSame(value)) {
            this._selectedMoment = value;
            this.selectedMomentSource.next(value);
        }
    }

    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    constructor() {
    }

    public setPickerOptions(dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                             dtPosition: 'top' | 'right' | 'bottom' | 'left',
                             dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                             dtHourTime: '12' | '24', dtTheme: string,
                             dtPickerType: 'both' | 'date' | 'time',
                             dtShowSeconds: boolean, dtOnlyCurrent: boolean,
                             dtMinDate: any, dtMaxDate: any): void {
        this._dtLocale = dtLocale;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPosition = dtPosition;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtShowSeconds = dtShowSeconds;
        this._dtOnlyCurrent = dtOnlyCurrent;
        this.dtPickerType = dtPickerType;
        this.dtTheme = dtTheme;
        this._dtMinDate = dtMinDate;
        this._dtMaxDate = dtMaxDate;
    }

    public setMoment( value: any, minDate: any, maxDate: any ): void {
        if (value) {
            this._moment = this._dtReturnObject === 'string' ? this.momentFunc(value, this._dtViewFormat) :
                this.momentFunc(value);
            this.selectedMoment = this._moment.clone();
        } else {
            this._moment = this.momentFunc();
        }
        if(minDate){
            this._dtMinDate = minDate;
        }
        if(maxDate){
            this._dtMaxDate = maxDate;
        }
    }

    public setDate( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment;
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
    }

    public setTime( hour: number, minute: number, second: number, meridian: string ) {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();

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

    public parseToReturnObjectType( selectedMoment: Moment ): any {
        switch (this.dtReturnObject) {
            case 'string':
                return selectedMoment.format(this.dtViewFormat);

            case 'moment':
                return selectedMoment;

            case 'json':
                return selectedMoment.toJSON();

            case 'array':
                return selectedMoment.toArray();

            case 'iso':
                return selectedMoment.toISOString();

            case 'object':
                return selectedMoment.toObject();

            case 'js':
            default:
                return selectedMoment.toDate();
        }
    }
}
