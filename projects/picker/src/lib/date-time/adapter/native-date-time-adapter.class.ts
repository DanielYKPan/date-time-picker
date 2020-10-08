/**
 * native-date-time-adapter.class
 */

import { Inject, Injectable, Optional } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import {
    DateTimeAdapter,
    OWL_DATE_TIME_LOCALE
} from './date-time-adapter.class';
import { range } from '../../utils/array.utils';
import { createDate, getNumDaysInMonth } from '../../utils/date.utils';
import {
    DEFAULT_DATE_NAMES,
    DEFAULT_DAY_OF_WEEK_NAMES,
    DEFAULT_MONTH_NAMES,
    SUPPORTS_INTL_API
} from '../../utils/constants';

/**
 * Matches strings that have the form of a valid RFC 3339 string
 * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
 * because the regex will match strings an with out of bounds month, date, etc.
 */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:[+\-]\d{2}:\d{2}))?)?$/;

@Injectable()
export class NativeDateTimeAdapter extends DateTimeAdapter<Date> {
    /** Whether to clamp the date between 1 and 9999 to avoid IE and Edge errors. */
    private readonly _clampDate: boolean;

    /**
     * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
     * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
     * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
     * will produce `'8/13/1800'`.
     */
    useUtcForDisplay: boolean;

    constructor(
        @Optional()
        @Inject(OWL_DATE_TIME_LOCALE)
        private owlDateTimeLocale: string,
        platform: Platform
    ) {
        super();
        super.setLocale(owlDateTimeLocale);

        // IE does its own time zone correction, so we disable this on IE.
        this.useUtcForDisplay = !platform.TRIDENT;
        this._clampDate = platform.TRIDENT || platform.EDGE;
    }

    public getYear(date: Date): number {
        return date.getFullYear();
    }

    public getMonth(date: Date): number {
        return date.getMonth();
    }

    public getDay(date: Date): number {
        return date.getDay();
    }

    public getDate(date: Date): number {
        return date.getDate();
    }

    public getHours(date: Date): number {
        return date.getHours();
    }

    public getMinutes(date: Date): number {
        return date.getMinutes();
    }

    public getSeconds(date: Date): number {
        return date.getSeconds();
    }

    public getTime(date: Date): number {
        return date.getTime();
    }

    public getNumDaysInMonth(date: Date): number {
        return getNumDaysInMonth(date);
    }

    public differenceInCalendarDays(dateLeft: Date, dateRight: Date): number {
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

            const timeStampLeft =
                this.getTime(dateLeftStartOfDay) -
                dateLeftStartOfDay.getTimezoneOffset() *
                    this.milliseondsInMinute;
            const timeStampRight =
                this.getTime(dateRightStartOfDay) -
                dateRightStartOfDay.getTimezoneOffset() *
                    this.milliseondsInMinute;
            return Math.round(
                (timeStampLeft - timeStampRight) / this.millisecondsInDay
            );
        } else {
            return null;
        }
    }

    public getYearName(date: Date): string {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                year: 'numeric',
                timeZone: 'utc'
            });
            return this.stripDirectionalityCharacters(this._format(dtf, date));
        }
        return String(this.getYear(date));
    }

    public getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                month: style,
                timeZone: 'utc'
            });
            return range(12, i =>
                this.stripDirectionalityCharacters(
                    this._format(dtf, new Date(2017, i, 1))
                )
            );
        }
        return DEFAULT_MONTH_NAMES[style];
    }

    public getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                weekday: style,
                timeZone: 'utc'
            });
            return range(7, i =>
                this.stripDirectionalityCharacters(
                    this._format(dtf, new Date(2017, 0, i + 1))
                )
            );
        }

        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }

    public getDateNames(): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.getLocale(), {
                day: 'numeric',
                timeZone: 'utc'
            });
            return range(31, i =>
                this.stripDirectionalityCharacters(
                    this._format(dtf, new Date(2017, 0, i + 1))
                )
            );
        }
        return DEFAULT_DATE_NAMES;
    }

    public toIso8601(date: Date): string {
        return date.toISOString();
    }

    public isEqual(dateLeft: Date, dateRight: Date): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft.getTime() === dateRight.getTime();
        } else {
            return false;
        }
    }

    public isSameDay(dateLeft: Date, dateRight: Date): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = this.clone(dateLeft);
            const dateRightStartOfDay = this.clone(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return (
                dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime()
            );
        } else {
            return false;
        }
    }

    public isValid(date: Date): boolean {
        return date && !isNaN(date.getTime());
    }

    public invalid(): Date {
        return new Date(NaN);
    }

    public isDateInstance(obj: any): boolean {
        return obj instanceof Date;
    }

    public addCalendarYears(date: Date, amount: number): Date {
        return this.addCalendarMonths(date, amount * 12);
    }

    public addCalendarMonths(date: Date, amount: number): Date {
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

    public addCalendarDays(date: Date, amount: number): Date {
        const result = this.clone(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result;
    }

    public setHours(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setHours(amount);
        return result;
    }

    public setMinutes(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setMinutes(amount);
        return result;
    }

    public setSeconds(date: Date, amount: number): Date {
        const result = this.clone(date);
        result.setSeconds(amount);
        return result;
    }

    public createDate(
        year: number,
        month: number,
        date: number,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0
    ): Date {
        return createDate(year, month, date, hours, minutes, seconds);
    }

    public clone(date: Date): Date {
        return this.createDate(
            this.getYear(date),
            this.getMonth(date),
            this.getDate(date),
            this.getHours(date),
            this.getMinutes(date),
            this.getSeconds(date)
        );
    }

    public now(): Date {
        return new Date();
    }

    public format(date: Date, displayFormat: any): string {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }

        if (SUPPORTS_INTL_API) {
            if (
                this._clampDate &&
                (date.getFullYear() < 1 || date.getFullYear() > 9999)
            ) {
                date = this.clone(date);
                date.setFullYear(
                    Math.max(1, Math.min(9999, date.getFullYear()))
                );
            }

            displayFormat = { ...displayFormat, timeZone: 'utc' };
            const dtf = new Intl.DateTimeFormat(this.getLocale(), displayFormat);
            return this.stripDirectionalityCharacters(this._format(dtf, date));
        }

        return this.stripDirectionalityCharacters(date.toDateString());
    }

    public parse(value: any, parseFormat: any): Date | null {
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
    public deserialize(value: any): Date | null {
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
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     */
    private stripDirectionalityCharacters(str: string) {
        return str.replace(/[\u200e\u200f]/g, '');
    }

    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     */
    private _format(dtf: Intl.DateTimeFormat, date: Date) {
        const d = new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()
            )
        );
        return dtf.format(d);
    }
}
