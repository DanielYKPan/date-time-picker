/**
 * date-time-adapter.class
 */
import { Observable, Subject } from 'rxjs';
import { InjectionToken, LOCALE_ID } from '@angular/core';

/** InjectionToken for date time picker that can be used to override default locale code. */
export const OWL_DATE_TIME_LOCALE = new InjectionToken<string>('OWL_DATE_TIME_LOCALE');

/** Provider for OWL_DATE_TIME_LOCALE injection token. */
export const OWL_DATE_TIME_LOCALE_PROVIDER = {provide: OWL_DATE_TIME_LOCALE, useExisting: LOCALE_ID};

export abstract class DateTimeAdapter<T> {

    /** The locale to use for all dates. */
    protected locale: any;

    /** A stream that emits when the locale changes. */
    protected _localeChanges = new Subject<void>();
    get localeChanges(): Observable<void> {
        return this._localeChanges;
    }

    /** total milliseconds in a day. */
    protected readonly millisecondsInDay = 86400000;

    /** total milliseconds in a minute. */
    protected readonly milliseondsInMinute = 60000;

    /**
     * Get the year of the given date
     * @param date
     * @return {number}
     * */
    abstract getYear( date: T ): number;

    /**
     * Get the month of the given date
     * @param date
     * @return {number} -- from 0-11
     * 0 -- January
     * 11 -- December
     * */
    abstract getMonth( date: T ): number;

    /**
     * Get the day of the week of the given date
     * @param date
     * @return {number} -- from 0-6
     * 0 -- Sunday
     * 6 -- Saturday
     * */
    abstract getDay( date: T ): number;

    /**
     * Get the day num of the given date
     * @param date
     * @return {number} -- from 1-31
     * */
    abstract getDate( date: T ): number;

    /**
     * Get the hours of the given date
     * @param date
     * @return {number} -- from 0-23
     * */
    abstract getHours( date: T ): number;

    /**
     * Get the minutes of the given date
     * @param date
     * @return {number} -- from 0-59
     * */
    abstract getMinutes( date: T ): number;

    /**
     * Get the seconds of the given date
     * @param date
     * @return {number} -- from 0-59
     * */
    abstract getSeconds( date: T ): number;

    /**
     * Get the milliseconds timestamp of the given date
     * @param  date
     * @return {number}
     * */
    abstract getTime( date: T ): number;

    /**
     * Gets the number of days in the month of the given date.
     * @param date -- The date whose month should be checked.
     * @return {number} -- The number of days in the month of the given date.
     */
    abstract getNumDaysInMonth( date: T ): number;

    /**
     * Get the number of calendar days between the given dates.
     * If dateLeft is before dateRight, it would return positive value
     * If dateLeft is after dateRight, it would return negative value
     * @param dateLeft -- the first date
     * @param dateRight -- the second date
     * @return {number} -- the number of calendar days between two given dates
     *
     * */
    abstract differenceInCalendarDays( dateLeft: T, dateRight: T ): number;

    /**
     * Gets the name for the year of the given date.
     * @param date The date to get the year name for.
     * @returns The name of the given year (e.g. '2017').
     */
    abstract getYearName( date: T ): string;

    /**
     * Get a list of month names
     * @param {'long' | 'short' | 'narrow'} style -- e.g. long = 'January', short = 'Jan', narrow = 'J'
     * @return {string[]} -- An ordered list of all month names, starting with January.
     * */
    abstract getMonthNames( style: 'long' | 'short' | 'narrow' ): string[];

    /**
     * Get a list of week names
     * @param {'long' | 'short' | 'narrow'} style -- e.g. long = 'Sunday', short = 'Sun', narrow = 'S'
     * @return {string[]} -- An ordered list of all week names, starting with Sunday.
     * */
    abstract getDayOfWeekNames( style: 'long' | 'short' | 'narrow' ): string[];

    /**
     * Return a Date object as a string, using the ISO standard
     * @param date -- The date to get the ISO date string for.
     * @return {string} -- The ISO date string date string.
     * */
    abstract toIso8601( date: T ): string;

    /**
     * Check if the give dates are equal
     * @param dateLeft
     * @param dateRight
     * @return {boolean}
     * */
    abstract isEqual( dateLeft: T, dateRight: T ): boolean;

    /**
     * Check if the give dates are the same day
     * @param {Date} dateLeft
     * @param {Date} dateRight
     * @return {boolean}
     * */
    abstract isSameDay( dateLeft: T, dateRight: T ): boolean;

    /**
     * Checks whether the given date is valid.
     * @param date The date to check.
     * @returns Whether the date is valid.
     */
    abstract isValid( date: T ): boolean;

    /**
     * Gets date instance that is not valid.
     * @returns An invalid date.
     */
    abstract invalid(): T;

    /**
     * Checks whether the given object is considered a date instance by this DateTimeAdapter.
     * @param obj The object to check
     * @returns Whether the object is a date instance.
     */
    abstract isDateInstance( obj: any ): boolean;

    /**
     * Add the specified number of years to the given date
     * @param date -- The date to add years to.
     * @param {number} amount -- The number of years to add (may be negative).
     * @returns A new date equal to the given one with the specified number of years added.
     * */
    abstract addCalendarYears( date: T, amount: number ): T;

    /**
     * Add the specified number of months to the given date
     * @param date -- The date to add months to.
     * @param {number} amount -- The number of months to add (may be negative).
     * @return A new date equal to the given one with the specified number of months added.
     * */
    abstract addCalendarMonths( date: T, amount: number ): T;

    /**
     * Add the specified number of days to the given date
     * @param date -- The date to add days to.
     * @param {number} amount -- The number of days to add (may be negative).
     * @return A new date equal to the given one with the specified number of days added.
     * */
    abstract addCalendarDays( date: T, amount: number ): T;

    /**
     * Set the hours to the given date.
     * @param date -- The date to set hours to.
     * @param {number} amount -- The number of hours to set (0 - 23).
     * @return A new date equal to the given one with the specified hour value
     * */
    abstract setHours( date: T, amount: number ): T;

    /**
     * Set the minutes to the given date.
     * @param date -- The date to set minutes to.
     * @param {number} amount -- The number of minutes to set (0 - 59).
     * @return A new date equal to the given one with the specified minute value
     * */
    abstract setMinutes( date: T, amount: number ): T;

    /**
     * Set the seconds to the given date.
     * @param date -- The date to set seconds to.
     * @param {number} amount -- The number of seconds to set (0 - 59).
     * @return A new date equal to the given one with the specified second value
     * */
    abstract setSeconds( date: T, amount: number ): T;

    /**
     * Creates a date with the given year, month, date, hour, minute and second. Does not allow over/under-flow of the
     * month and date.
     * @param {number} year -- The full year of the date. (e.g. 89 means the year 89, not the year 1989).
     * @param {number} month -- The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
     * @param {number} date -- The date of month of the date. Must be an integer 1 - length of the given month.
     * @param {number} hours -- The hours of the date. Must 0 - 23
     * @param {number} minutes -- The minutes of the date. Must 0 - 59
     * @param {number} seconds -- The seconds of the date. Must 0 - 59
     * @returns The new date, or null if invalid.
     */
    abstract createDate( year: number, month: number, date: number ): T;
    abstract createDate( year: number, month: number, date: number, hours: number, minutes: number, seconds: number ): T;

    /**
     * Clone the given date
     * @param date -- The date to clone
     * @return a new date object equal to the given one
     * */
    abstract clone( date: T ): T;

    /**
     * Get a new moment
     * @return a date object with now value
     * */
    abstract now(): T;

    /**
     * Formats a date as a string according to the given format.
     * @param date -- The value to format.
     * @param displayFormat -- The format to use to display the date as a string.
     * @returns The formatted date string.
     */
    abstract format( date: T, displayFormat: any ): string;

    /**
     * Parse a user-provided value to a Date Object
     * @param value -- The value to parse
     * @param {any} parseFormat -- The expected format of the value being parsed
     * @return Thar parsed date
     * */
    abstract parse( value: any, parseFormat: any ): T | null;

    /**
     * Compare two given dates
     * @return {number} -- 1, 0 or -1
     * 1 if the first date is after the second,
     * -1 if the first date is before the second
     * 0 if dates are equal.
     * */
    compare( first: T, second: T ): number {
        if (!this.isValid(first) || !this.isValid(second)) {
            throw Error('JSNativeDate: Cannot compare invalid dates.');
        }

        const dateFirst = this.clone(first);
        const dateSecond = this.clone(second);

        const diff = this.getTime(dateFirst) - this.getTime(dateSecond);

        if (diff < 0) {
            return -1;
        } else if (diff > 0) {
            return 1;
        } else {
            // Return 0 if diff is 0; return NaN if diff is NaN
            return diff;
        }
    }

    /**
     * Check if two given dates are in the same year
     * @return {number} -- 1, 0 or -1
     * 1 if the first date's year is after the second,
     * -1 if the first date's year is before the second
     * 0 if two given dates are in the same year
     * */
    compareYear( first: T, second: T ): number {

        if (!this.isValid(first) || !this.isValid(second)) {
            throw Error('JSNativeDate: Cannot compare invalid dates.');
        }

        const yearLeft = this.getYear(first);
        const yearRight = this.getYear(second);

        const diff = yearLeft - yearRight;

        if (diff < 0) {
            return -1;
        } else if (diff > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * Attempts to deserialize a value to a valid date object. This is different from parsing in that
     * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
     * string). The default implementation does not allow any deserialization, it simply checks that
     * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
     * method on all of it's `@Input()` properties that accept dates. It is therefore possible to
     * support passing values from your backend directly to these properties by overriding this method
     * to also deserialize the format used by your backend.
     * @param value The value to be deserialized into a date object.
     * @returns The deserialized date object, either a valid date, null if the value can be
     *     deserialized into a null date (e.g. the empty string), or an invalid date.
     */
    deserialize( value: any ): T | null {
        if (value == null || this.isDateInstance(value) && this.isValid(value)) {
            return value;
        }
        return this.invalid();
    }

    /**
     * Sets the locale used for all dates.
     * @param locale The new locale.
     */
    setLocale( locale: any ) {
        this.locale = locale;
        this._localeChanges.next();
    }

    /**
     * Clamp the given date between min and max dates.
     * @param date The date to clamp.
     * @param min The minimum value to allow. If null or omitted no min is enforced.
     * @param max The maximum value to allow. If null or omitted no max is enforced.
     * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
     *     otherwise `date`.
     */
    clampDate( date: T, min?: T | null, max?: T | null ): T {
        if (min && this.compare(date, min) < 0) {
            return min;
        }
        if (max && this.compare(date, max) > 0) {
            return max;
        }
        return date;
    }
}
