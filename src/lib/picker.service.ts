/**
 * picker.service
 */

import { Injectable } from '@angular/core';
import { DialogType } from './dialog.component';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { Observable, Subject } from 'rxjs/Rx';

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

    /* Property _minMoment */
    private _minMoment: Moment;

     get minMoment(): Moment {
     return this._minMoment;
     }

     set minMoment( value: Moment ) {
     this._minMoment = value;
     }

     /* Property _maxMoment */
     private _maxMoment: Moment;

     get maxMoment(): Moment {
     return this._maxMoment;
     }

     set maxMoment( value: Moment ) {
     this._maxMoment = value;
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

    public setPickerOptions( dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                             dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                             dtHourTime: '12' | '24', dtTheme: string, dtPickerType: 'both' | 'date' | 'time',
                             minMoment: Moment, maxMoment: Moment ): void {
        this._dtLocale = dtLocale;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtTheme = dtTheme;
        this.dtPickerType = dtPickerType;
        this._minMoment = minMoment;
        this._maxMoment = maxMoment;
    }

    public setMoment( value: any ): void {
        if (value) {
            this._moment = this._dtReturnObject === 'string' ? moment(value, this._dtViewFormat) :
                moment(value);
            this.selectedMoment = this._moment.clone();
        } else {
            this._moment = moment();
            this.selectedMoment = null;
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

    public parseToReturnObjectType(selectedMoment: Moment): any {
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
