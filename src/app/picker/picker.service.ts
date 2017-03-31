/**
 * picker.service
 */

import { Injectable } from '@angular/core';
import { DialogType } from './dialog.component';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PickerService {

    public eventSource: Subject<Moment> = new Subject<Moment>();
    public events: Observable<Moment> = this.eventSource.asObservable();

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
        this._selectedMoment = value;
        this.eventSource.next(value);
    }

    constructor() {
    }

    public setPickerOptions( dtLocal: string, dtViewFormat: string, dtReturnObject: string, dialogType: string,
                             dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                             dtHourTime: '12' | '24', dtTheme: string ): void {
        this._dtLocale = dtLocal;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtTheme = dtTheme;

        if (dialogType === 'time') {
            this._dtDialogType = DialogType.Time;
        } else {
            this._dtDialogType = DialogType.Date;
        }
    }

    public setMoment( value: any ): void {
        if (value) {
            this._moment = this._dtReturnObject === 'string' ? moment(value, this._dtViewFormat) :
                moment(value);
            this.selectedMoment = this._moment.clone();
        } else {
            this._moment = moment();
        }
    }

    public setDate( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment;
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
    }

    public setTime( hour: number, minute: number, meridian: string ) {
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
        this.selectedMoment = m;
    }

    public parseToReturnObjectType(): any {
        switch (this.dtReturnObject) {
            case 'string':
                return this.selectedMoment.format(this.dtViewFormat);

            case 'moment':
                return this.selectedMoment;

            case 'json':
                return this.selectedMoment.toJSON();

            case 'array':
                return this.selectedMoment.toArray();

            case 'iso':
                return this.selectedMoment.toISOString();

            case 'object':
                return this.selectedMoment.toObject();

            case 'js':
            default:
                return this.selectedMoment.toDate();
        }
    }
}
