import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import {
    DateTimeAdapter,
    OWL_DATE_TIME_LOCALE
} from '../date-time-adapter.class';

import * as _dayjs from 'dayjs';
import * as localData from 'dayjs/plugin/localeData';
_dayjs.extend(localData);

export const CUSTOM_DATE_TIME_FORMATS = {
    parseInput: 'your custom value',
    fullPickerInput: 'your custom value',
    datePickerInput: 'your custom value',
    timePickerInput: 'your custom value',
    monthYearLabel: 'your custom value',
    dateA11yLabel: 'your custom value',
    monthYearA11yLabel: 'your custom value'
};

export interface OwlDayjsDateTimeAdapterOptions {
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how the DateTimePicker output value.
     * {@default false}
     */
    useUtc: boolean;
}

/** InjectionToken for dayjs date adapter to configure options. */
export const OWL_DAYJS_DATE_TIME_ADAPTER_OPTIONS = new InjectionToken<
    OwlDayjsDateTimeAdapterOptions
>('OWL_DAYJS_DATE_TIME_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: OWL_DAYJS_DATE_TIME_ADAPTER_OPTIONS_FACTORY
});

/** @docs-private */
export function OWL_DAYJS_DATE_TIME_ADAPTER_OPTIONS_FACTORY(): OwlDayjsDateTimeAdapterOptions {
    return {
        useUtc: false
    };
}

function range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}

@Injectable()
export class DayjsDateTimeAdapter extends DateTimeAdapter<_dayjs.Dayjs> {
    private _localeData: {
        longMonths: string[];
        shortMonths: string[];
        longDaysOfWeek: string[];
        shortDaysOfWeek: string[];
        narrowDaysOfWeek: string[];
        dates: string[];
    };

    constructor(
        @Optional()
        @Inject(OWL_DATE_TIME_LOCALE)
        private owlDateTimeLocale: string,
        @Optional()
        @Inject(OWL_DAYJS_DATE_TIME_ADAPTER_OPTIONS)
        private options?: OwlDayjsDateTimeAdapterOptions
    ) {
        super();
        this.setLocale(owlDateTimeLocale || _dayjs().locale());
    }

    public setLocale(locale: string) {
        super.setLocale(locale);

        const dayjsLocalData = _dayjs()
            .locale(locale)
            .localeData();
        this._localeData = {
            longMonths: dayjsLocalData.months(),
            shortMonths: dayjsLocalData.monthsShort(),
            longDaysOfWeek: dayjsLocalData.weekdays(),
            shortDaysOfWeek: dayjsLocalData.weekdaysShort(),
            narrowDaysOfWeek: dayjsLocalData.weekdaysMin(),
            dates: range(31, i => this.createDate(2017, 0, i + 1).format('D'))
        };
    }

    getYear(date: _dayjs.Dayjs): number {
        return this.clone(date).year();
    }
    getMonth(date: _dayjs.Dayjs): number {
        return this.clone(date).month();
    }
    getDay(date: _dayjs.Dayjs): number {
        return this.clone(date).day();
    }
    getDate(date: _dayjs.Dayjs): number {
        return this.clone(date).date();
    }
    getHours(date: _dayjs.Dayjs): number {
        return this.clone(date).hour();
    }
    getMinutes(date: _dayjs.Dayjs): number {
        return this.clone(date).minute();
    }
    getSeconds(date: _dayjs.Dayjs): number {
        return this.clone(date).second();
    }
    getTime(date: _dayjs.Dayjs): number {
        return this.clone(date).valueOf();
    }
    getNumDaysInMonth(date: _dayjs.Dayjs): number {
        return this.clone(date).daysInMonth();
    }
    differenceInCalendarDays(
        dateLeft: _dayjs.Dayjs,
        dateRight: _dayjs.Dayjs
    ): number {
        return dateLeft.diff(dateRight, 'day');
    }
    getYearName(date: _dayjs.Dayjs): string {
        return date.format('YYYY');
    }
    public getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        return style === 'long'
            ? this._localeData.longMonths
            : this._localeData.shortMonths;
    }

    public getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
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

    toIso8601(date: _dayjs.Dayjs): string {
        return this.clone(date).toISOString();
    }
    isEqual(dateLeft: _dayjs.Dayjs, dateRight: _dayjs.Dayjs): boolean {
        return this.clone(dateLeft).isSame(this.clone(dateRight));
    }
    isSameDay(dateLeft: _dayjs.Dayjs, dateRight: _dayjs.Dayjs): boolean {
        return this.clone(dateLeft).isSame(this.clone(dateRight), 'day');
    }
    isValid(date: _dayjs.Dayjs): boolean {
        return date.isValid();
    }
    invalid(): _dayjs.Dayjs {
        return _dayjs(NaN);
    }
    isDateInstance(obj: any): boolean {
        return _dayjs.isDayjs(obj);
    }
    addCalendarYears(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).add(amount, 'year');
    }
    addCalendarMonths(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).add(amount, 'month');
    }
    addCalendarDays(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).add(amount, 'day');
    }
    setHours(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).hour(amount);
    }
    setMinutes(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).minute(amount);
    }
    setSeconds(date: _dayjs.Dayjs, amount: number): _dayjs.Dayjs {
        return this.clone(date).second(amount);
    }
    createDate(year: number, month: number, date: number): _dayjs.Dayjs;
    createDate(
        year: number,
        month: number,
        date: number,
        hours: number,
        minutes: number,
        seconds: number
    ): _dayjs.Dayjs;
    createDate(
        year: any,
        month: any,
        date: any,
        hours?: any,
        minutes?: any,
        seconds?: any
    ) {
        if (month < 0 || month > 11) {
            throw Error(
                `Invalid month index "${month}". Month index has to be between 0 and 11.`
            );
        }

        if (date < 1) {
            throw Error(
                `Invalid date "${date}". Date has to be greater than 0.`
            );
        }

        if (hours < 0 || hours > 23) {
            throw Error(
                `Invalid hours "${hours}". Hours has to be between 0 and 23.`
            );
        }

        if (minutes < 0 || minutes > 59) {
            throw Error(
                `Invalid minutes "${minutes}". Minutes has to between 0 and 59.`
            );
        }

        if (seconds < 0 || seconds > 59) {
            throw Error(
                `Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`
            );
        }

        const result = this.createDayjs()
            .set('year', year)
            .set('month', month)
            .set('date', date)
            .set('hour', hours)
            .set('minute', minutes)
            .set('second', seconds)
            .locale(this.locale);

        // If the result isn't valid, the date must have been out of bounds for this month.
        if (!result.isValid()) {
            throw Error(
                `Invalid date "${date}" for month with index "${month}".`
            );
        }

        return result;
    }
    public clone(date: _dayjs.Dayjs): _dayjs.Dayjs {
        return this.createDayjs(date)
            .clone()
            .locale(this.locale);
    }

    private createDayjs(...args: any[]): _dayjs.Dayjs {
        return _dayjs(...args, {
            utc: this.options.useUtc
        });
    }

    now(): _dayjs.Dayjs {
        return this.clone(_dayjs());
    }
    format(date: _dayjs.Dayjs, displayFormat: any): string {
        return date.format(displayFormat);
    }
    parse(value: any, parseFormat: any): _dayjs.Dayjs {
        return _dayjs(value, {
            format: parseFormat
        });
    }
}
