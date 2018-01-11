/**
 * native-date-time-adapter.class
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from './date-time-adapter.class';

/** The default month names to use if Intl API is not available. */
const DEFAULT_MONTH_NAMES = {
    'long': [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ],
    'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
};

/** The default day of the week names to use if Intl API is not available. */
const DEFAULT_DAY_OF_WEEK_NAMES = {
    'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
};

/** Whether the browser supports the Intl API. */
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX =
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;

/** Creates an array and fills it with values. */
function range<T>( length: number, valueFunction: ( index: number ) => T ): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

@Injectable()
export class NativeDateTimeAdapter extends DateTimeAdapter<Date> {

    constructor( @Optional() @Inject(OWL_DATE_TIME_LOCALE) private owlDateTimeLocale: string ) {
        super();
        super.setLocale(owlDateTimeLocale);
    }

    public getYear( date: Date ): number {
        return date.getFullYear();
    }

    public getMonth( date: Date ): number {
        return date.getMonth();
    }

    public getDay( date: Date ): number {
        return date.getDay();
    }

    public getDate( date: Date ): number {
        return date.getDate();
    }

    public getHours( date: Date ): number {
        return date.getHours();
    }

    public getMinutes( date: Date ): number {
        return date.getMinutes();
    }

    public getSeconds( date: Date ): number {
        return date.getSeconds();
    }

    public getTime( date: Date ): number {
        return date.getTime();
    }

    public getNumDaysInMonth( date: Date ): number {
        const lastDateOfMonth = this.createDateWithOverflow(
            this.getYear(date),
            this.getMonth(date) + 1,
            0
        );

        return this.getDate(lastDateOfMonth);
    }

    public differenceInCalendarDays( dateLeft: Date, dateRight: Date ): number {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.createDate(
                this.getYear(dateLeft),
                this.getMonth(dateLeft),
                this.getDate(dateLeft)
            );
            const dateRightStartOfDay = this.createDate(
                this.getYear(dateRight),
                this.getMonth(dateRight),
                this.getDate(dateRight)
            );

            const timeStampLeft = this.getTime(dateLeftStartOfDay);
            const timeStampRight = this.getTime(dateRightStartOfDay);
            return Math.round((timeStampLeft - timeStampRight) / this.millisecondsInDay);
        } else {
            return null;
        }
    }

    public getYearName( date: Date ): string {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {year: 'numeric'});
            return this.stripDirectionalityCharacters(dtf.format(date));
        }
        return String(this.getYear(date));
    }

    public getMonthNames( style: 'long' | 'short' | 'narrow' ): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {month: style});
            return range(12, i => this.stripDirectionalityCharacters(dtf.format(new Date(2017, i, 1))));
        }
        return DEFAULT_MONTH_NAMES[style];
    }

    public getDayOfWeekNames( style: 'long' | 'short' | 'narrow' ): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {weekday: style});
            return range(7, i => this.stripDirectionalityCharacters(
                dtf.format(new Date(2017, 0, i + 1))));
        }

        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }

    public toIso8601( date: Date ): string {
        return date.toISOString();
    }

    public isEqual( dateLeft: Date, dateRight: Date ): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft.getTime() === dateRight.getTime();
        } else {
            return false;
        }
    }

    public isSameDay( dateLeft: Date, dateRight: Date ): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.clone(dateLeft);
            const dateRightStartOfDay = this.clone(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
        } else {
            return false;
        }
    }

    public isValid( date: Date ): boolean {
        return date && !isNaN(date.getTime());
    }

    public invalid(): Date {
        return new Date(NaN);
    }

    public isDateInstance( obj: any ): boolean {
        return obj instanceof Date;
    }

    public addCalendarYears( date: Date, amount: number ): Date {
        return this.addCalendarMonths(date, amount * 12);
    }

    public addCalendarMonths( date: Date, amount: number ): Date {
        const result = this.clone(date);
        amount = Number(amount);

        const desiredMonth = result.getMonth() + amount;
        const dateWithDesiredMonth = new Date(0);
        dateWithDesiredMonth.setFullYear(result.getFullYear(), desiredMonth, 1);
        dateWithDesiredMonth.setHours(0, 0, 0, 0);

        const daysInMonth = this.getNumDaysInMonth(dateWithDesiredMonth);
        // Set the last day of the new month
        // if the original date was the last day of the longer month
        result.setMonth(desiredMonth, Math.min(daysInMonth, result.getDate()));
        return result;
    }

    public addCalendarDays( date: Date, amount: number ): Date {
        const result = this.clone(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result;
    }

    public setHours( date: Date, amount: number ): Date {
        const result = this.clone(date);
        result.setHours(amount);
        return result;
    }

    public setMinutes( date: Date, amount: number ): Date {
        const result = this.clone(date);
        result.setMinutes(amount);
        return result;
    }

    public setSeconds( date: Date, amount: number ): Date {
        const result = this.clone(date);
        result.setSeconds(amount);
        return result;
    }

    public createDate( year: number, month: number, date: number, hours: number = 0, minutes: number = 0, seconds: number = 0 ): Date {
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

        const result = this.createDateWithOverflow(year, month, date, hours, minutes, seconds);

        // Check that the date wasn't above the upper bound for the month, causing the month to overflow
        // For example, createDate(2017, 1, 31) would try to create a date 2017/02/31 which is invalid
        if (result.getMonth() !== month) {
            throw Error(`Invalid date "${date}" for month with index "${month}".`);
        }

        return result;
    }

    public clone( date: Date ): Date {
        return new Date(date.getTime());
    }

    public now(): Date {
        return new Date();
    }

    public format( date: Date, displayFormat: any ): string {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }

        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return this.stripDirectionalityCharacters(dtf.format(date));
        }

        return this.stripDirectionalityCharacters(date.toDateString());
    }

    public parse( value: any, parseFormat: any ): Date | null {
        // There is no way using the native JS Date to set the parse format or locale
        if (typeof value === 'number') {
            return new Date(value);
        }
        return value ? new Date(Date.parse(value)) : null;
    }

    /**
     * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
     * invalid date for all other values.
     */
    public deserialize( value: any ): Date | null {
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
            // string is the right format first.
            if (ISO_8601_REGEX.test(value)) {
                const date = new Date(value);
                if (this.isValid(date)) {
                    return date;
                }
            }
        }
        return super.deserialize(value);
    }

    /**
     * Creates a date but allows the month and date to overflow.
     * @param {number} year
     * @param {number} month
     * @param {number} date
     * @param {number} hours -- default 0
     * @param {number} minutes -- default 0
     * @param {number} seconds -- default 0
     * @returns The new date, or null if invalid.
     * */
    private createDateWithOverflow( year: number, month: number, date: number,
                                    hours: number = 0, minutes: number = 0, seconds: number = 0 ): Date {
        const result = new Date(year, month, date, hours, minutes, seconds);

        if (year >= 0 && year < 100) {
            result.setFullYear(this.getYear(result) - 1900);
        }
        return result;
    }

    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private stripDirectionalityCharacters( str: string ) {
        return str.replace(/[\u200e\u200f]/g, '');
    }
}
