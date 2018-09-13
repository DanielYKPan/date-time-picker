/**
 * moment-date-time-adapter.class
 */

import { Inject, Injectable, Optional, InjectionToken } from '@angular/core';
// import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import * as _moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '../date-time-adapter.class';

const moment = (_moment as any).default ? (_moment as any).default : _moment;

/** Configurable options for {@see MomentDateAdapter}. */
export interface OwlMomentDateTimeAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how the DateTimePicker output value.
     * {@default false}
     */
    useUtc: boolean;
}

/** InjectionToken for moment date adapter to configure options. */
export const OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS = new InjectionToken<OwlMomentDateTimeAdapterOptions>(
    'OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS', {
        providedIn: 'root',
        factory: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY
    });

/** @docs-private */
export function OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY(): OwlMomentDateTimeAdapterOptions {
    return {
        useUtc: false
    };
}

/** Creates an array and fills it with values. */
function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}


@Injectable()
export class MomentDateTimeAdapter extends DateTimeAdapter<Moment> {

    private _localeData: {
        longMonths: string[],
        shortMonths: string[],
        longDaysOfWeek: string[],
        shortDaysOfWeek: string[],
        narrowDaysOfWeek: string[],
        dates: string[],
    };

    constructor( @Optional() @Inject(OWL_DATE_TIME_LOCALE) private owlDateTimeLocale: string,
                 @Optional() @Inject(OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS) private options?: OwlMomentDateTimeAdapterOptions ) {
        super();
        this.setLocale(owlDateTimeLocale || moment.locale());
    }

    public setLocale( locale: string ) {
        super.setLocale(locale);

        const momentLocaleData = moment.localeData(locale);
        this._localeData = {
            longMonths: momentLocaleData.months(),
            shortMonths: momentLocaleData.monthsShort(),
            longDaysOfWeek: momentLocaleData.weekdays(),
            shortDaysOfWeek: momentLocaleData.weekdaysShort(),
            narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
            dates: range(31, (i) => this.createDate(2017, 0, i + 1).format('D')),
        };
    }


    public getYear( date: Moment ): number {
        return this.clone(date).year();
    }

    public getMonth( date: Moment ): number {
        return this.clone(date).month();
    }

    public getDay( date: Moment ): number {
        return this.clone(date).day();
    }

    public getDate( date: Moment ): number {
        return this.clone(date).date();
    }

    public getHours( date: Moment ): number {
        return this.clone(date).hours();
    }

    public getMinutes( date: Moment ): number {
        return this.clone(date).minutes();
    }

    public getSeconds( date: Moment ): number {
        return this.clone(date).seconds();
    }

    public getTime( date: Moment ): number {
        return this.clone(date).valueOf();
    }

    public getNumDaysInMonth( date: Moment ): number {
        return this.clone(date).daysInMonth();
    }

    public differenceInCalendarDays( dateLeft: Moment, dateRight: Moment ): number {
        return this.clone(dateLeft).diff(dateRight, 'days');
    }

    public getYearName( date: Moment ): string {
        return this.clone(date).format('YYYY');
    }

    public getMonthNames( style: 'long' | 'short' | 'narrow' ): string[] {
        return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
    }

    public getDayOfWeekNames( style: 'long' | 'short' | 'narrow' ): string[] {
        if (style === 'long') {
            return this._localeData.longDaysOfWeek;
        }
        if (style === 'short') {
            return this._localeData.shortDaysOfWeek;
        }
        return this._localeData.narrowDaysOfWeek;
    }

    public getDateNames(): string[] {
        return this._localeData.dates;
    }

    public toIso8601( date: Moment ): string {
        return this.clone(date).format();
    }

    public isEqual( dateLeft: Moment, dateRight: Moment ): boolean {

        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight));
        }

        return dateLeft === dateRight;
    }

    public isSameDay( dateLeft: Moment, dateRight: Moment ): boolean {

        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight), 'day');
        }

        return dateLeft === dateRight;
    }

    public isValid( date: Moment ): boolean {
        return this.clone(date).isValid();
    }

    public invalid(): Moment {
        return moment.invalid();
    }

    public isDateInstance( obj: any ): boolean {
        return moment.isMoment(obj);
    }

    public addCalendarYears( date: Moment, amount: number ): Moment {
        return this.clone(date).add({years: amount});
    }

    public addCalendarMonths( date: Moment, amount: number ): Moment {
        return this.clone(date).add({months: amount});
    }

    public addCalendarDays( date: Moment, amount: number ): Moment {
        return this.clone(date).add({days: amount});
    }

    public setHours( date: Moment, amount: number ): Moment {
        return this.clone(date).hours(amount);
    }

    public setMinutes( date: Moment, amount: number ): Moment {
        return this.clone(date).minutes(amount);
    }

    public setSeconds( date: Moment, amount: number ): Moment {
        return this.clone(date).seconds(amount);
    }

    public createDate( year: number, month: number, date: number ): Moment;
    public createDate( year: number, month: number, date: number, hours: number = 0, minutes: number = 0, seconds: number = 0 ): Moment {
        if (month < 0 || month > 11) {
            throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
        }

        if (date < 1) {
            throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
        }

        if (hours < 0 || hours > 23) {
            throw Error(`Invalid hours "${hours}". Hours has to be between 0 and 23.`);
        }

        if (minutes < 0 || minutes > 59) {
            throw Error(`Invalid minutes "${minutes}". Minutes has to between 0 and 59.`);
        }

        if (seconds < 0 || seconds > 59) {
            throw Error(`Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`);
        }

        const result = this.createMoment({year, month, date, hours, minutes, seconds}).locale(this.locale);

        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid()) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }

        return result;
    }

    public clone( date: Moment ): Moment {
        return this.createMoment(date).clone().locale(this.locale);
    }

    public now(): Moment {
        return this.createMoment().locale(this.locale);
    }

    public format( date: Moment, displayFormat: any ): string {
        date = this.clone(date);
        if (!this.isValid(date)) {
            throw Error('MomentDateTimeAdapter: Cannot format invalid date.');
        }
        return date.format(displayFormat);
    }

    public parse( value: any, parseFormat: any ): Moment | null {
        if (value && typeof value === 'string') {
            return this.createMoment(value, parseFormat, this.locale);
        }
        return value ? this.createMoment(value).locale(this.locale) : null;
    }

    /**
     * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize( value: any ): Moment | null {
        let date;
        if (value instanceof Date) {
            date = this.createMoment(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.createMoment(value, moment.ISO_8601).locale(this.locale);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return super.deserialize(value);
    }

    /** Creates a Moment instance while respecting the current UTC settings. */
    private createMoment(...args: any[]): Moment {
        return (this.options && this.options.useUtc) ? moment.utc(...args) : moment(...args);
    }
}
