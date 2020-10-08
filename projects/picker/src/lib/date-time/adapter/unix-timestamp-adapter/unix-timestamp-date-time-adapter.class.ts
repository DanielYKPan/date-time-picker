/**
 * unix-timestamp-date-time-adapter.class
 */

import {Inject, Injectable, Optional} from '@angular/core';
import {DateTimeAdapter, OWL_DATE_TIME_LOCALE} from '../date-time-adapter.class';
import {Platform} from '@angular/cdk/platform';
import {range} from '../../../utils/array.utils';
import {createDate, getNumDaysInMonth} from '../../../utils/date.utils';
import {DEFAULT_DATE_NAMES, DEFAULT_DAY_OF_WEEK_NAMES, DEFAULT_MONTH_NAMES, SUPPORTS_INTL_API} from '../../../utils/constants';

@Injectable()
export class UnixTimestampDateTimeAdapter extends DateTimeAdapter<number> {

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

    /** Whether to clamp the date between 1 and 9999 to avoid IE and Edge errors. */
    private readonly _clampDate: boolean;

    /**
     * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
     * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
     * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
     * will produce `'8/13/1800'`.
     */
    useUtcForDisplay: boolean;

    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     */
    private static stripDirectionalityCharacters(str: string) {
        return str.replace(/[\u200e\u200f]/g, '');
    }

    /**
     * When converting Date object to string, javascript built-in functions may return wrong
     * results because it applies its internal DST rules. The DST rules around the world change
     * very frequently, and the current valid rule is not always valid in previous years though.
     * We work around this problem building a new Date object which has its internal UTC
     * representation with the local date and time.
     */
    private static _format(dtf: Intl.DateTimeFormat, date: Date) {
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

    addCalendarDays(date: number, amount: number): number {
        const result = new Date(date);
        amount = Number(amount);
        result.setDate(result.getDate() + amount);
        return result.getTime();
    }

    addCalendarMonths(date: number, amount: number): number {
        const result = new Date(date);
        amount = Number(amount);

        const desiredMonth = result.getMonth() + amount;
        const dateWithDesiredMonth = new Date(0);
        dateWithDesiredMonth.setFullYear(result.getFullYear(), desiredMonth, 1);
        dateWithDesiredMonth.setHours(0, 0, 0, 0);

        const daysInMonth = this.getNumDaysInMonth(dateWithDesiredMonth.getTime());
        // Set the last day of the new month
        // if the original date was the last day of the longer month
        result.setMonth(desiredMonth, Math.min(daysInMonth, result.getDate()));
        return result.getTime();
    }

    addCalendarYears(date: number, amount: number): number {
        return this.addCalendarMonths(date, amount * 12);
    }

    clone(date: number): number {
        return date;
    }

    public createDate(
        year: number,
        month: number,
        date: number,
        hours: number = 0,
        minutes: number = 0,
        seconds: number = 0
    ): number {
        return createDate(year, month, date, hours, minutes, seconds).getTime();
    }

    differenceInCalendarDays(dateLeft: number, dateRight: number): number {
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
                new Date(dateLeftStartOfDay).getTimezoneOffset() *
                this.milliseondsInMinute;
            const timeStampRight =
                this.getTime(dateRightStartOfDay) -
                new Date(dateRightStartOfDay).getTimezoneOffset() *
                this.milliseondsInMinute;
            return Math.round(
                (timeStampLeft - timeStampRight) / this.millisecondsInDay
            );
        } else {
            return null;
        }
    }

    format(date: number, displayFormat: any): string {
        if (!this.isValid(date)) {
            throw Error('JSNativeDate: Cannot format invalid date.');
        }

        const jsDate = new Date(date);

        if (SUPPORTS_INTL_API) {
            if (this._clampDate &&
                (jsDate.getFullYear() < 1 || jsDate.getFullYear() > 9999)) {
                jsDate.setFullYear(
                    Math.max(1, Math.min(9999, jsDate.getFullYear()))
                );
            }

            displayFormat = {...displayFormat, timeZone: 'utc'};
            const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
            return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, jsDate));
        }

        return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(jsDate.toDateString());
    }

    getDate(date: number): number {
        return new Date(date).getDate();
    }

    getDateNames(): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                day: 'numeric',
                timeZone: 'utc'
            });
            return range(31, i =>
                UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(
                    UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, 0, i + 1))
                )
            );
        }
        return DEFAULT_DATE_NAMES;
    }

    getDay(date: number): number {
        return new Date(date).getDay();
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                weekday: style,
                timeZone: 'utc'
            });
            return range(7, i =>
                UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(
                    UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, 0, i + 1))
                )
            );
        }

        return DEFAULT_DAY_OF_WEEK_NAMES[style];
    }

    getHours(date: number): number {
        return new Date(date).getHours();
    }

    getMinutes(date: number): number {
        return new Date(date).getMinutes();
    }

    getMonth(date: number): number {
        return new Date(date).getMonth();
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                month: style,
                timeZone: 'utc'
            });
            return range(12, i =>
                UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(
                    UnixTimestampDateTimeAdapter._format(dtf, new Date(2017, i, 1))
                )
            );
        }
        return DEFAULT_MONTH_NAMES[style];
    }

    getNumDaysInMonth(date: number): number {
        return getNumDaysInMonth(new Date(date));
    }

    getSeconds(date: number): number {
        return new Date(date).getSeconds();
    }

    getTime(date: number): number {
        return date;
    }

    getYear(date: number): number {
        return new Date(date).getFullYear();
    }

    getYearName(date: number): string {
        if (SUPPORTS_INTL_API) {
            const dtf = new Intl.DateTimeFormat(this.locale, {
                year: 'numeric',
                timeZone: 'utc'
            });
            return UnixTimestampDateTimeAdapter.stripDirectionalityCharacters(UnixTimestampDateTimeAdapter._format(dtf, new Date(date)));
        }
        return String(this.getYear(date));
    }

    invalid(): number {
        return NaN;
    }

    isDateInstance(obj: any): boolean {
        return typeof obj === 'number';
    }

    isEqual(dateLeft: number, dateRight: number): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            return dateLeft === dateRight;
        } else {
            return false;
        }
    }

    isSameDay(dateLeft: number, dateRight: number): boolean {
        if (this.isValid(dateLeft) && this.isValid(dateRight)) {
            const dateLeftStartOfDay = new Date(dateLeft);
            const dateRightStartOfDay = new Date(dateRight);
            dateLeftStartOfDay.setHours(0, 0, 0, 0);
            dateRightStartOfDay.setHours(0, 0, 0, 0);
            return (dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime());
        } else {
            return false;
        }
    }

    isValid(date: number): boolean {
        return (date || date === 0) && !isNaN(date);
    }

    now(): number {
        return new Date().getTime();
    }

    parse(value: any, parseFormat: any): number | null {
        // There is no way using the native JS Date to set the parse format or locale
        if (typeof value === 'number') {
            return value;
        }
        return value ? new Date(Date.parse(value)).getTime() : null;
    }

    setHours(date: number, amount: number): number {
        const result = new Date(date);
        result.setHours(amount);
        return result.getTime();
    }

    setMinutes(date: number, amount: number): number {
        const result = new Date(date);
        result.setMinutes(amount);
        return result.getTime();
    }

    setSeconds(date: number, amount: number): number {
        const result = new Date(date);
        result.setSeconds(amount);
        return result.getTime();
    }

    toIso8601(date: number): string {
        return new Date(date).toISOString();
    }
}
