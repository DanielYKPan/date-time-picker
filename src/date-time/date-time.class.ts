/**
 * date-time.class
 */
import { Inject, Input, Optional } from '@angular/core';
import { OwlDateTimeInputDirective } from './date-time-picker-input.directive';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';

let nextUniqueId = 0;

export type PickerType = 'both' | 'calendar' | 'timer';

export abstract class OwlDateTime<T> {

    /**
     * Set the type of the dateTime picker
     *      'both' -- show both calendar and timer
     *      'calendar' -- show only calendar
     *      'timer' -- show only timer
     * @default 'both'
     * @type {'both' | 'calendar' | 'timer'}
     * */
    @Input() pickerType: PickerType = 'both';

    /**
     * Whether to show the second's timer
     * @default false
     * @type {Boolean}
     * */
    @Input() showSecondsTimer: boolean;

    /**
     * The view that the calendar should start in.
     * @default {'month'}
     * @type {'month' | 'year'}
     * */
    @Input() startView: 'month' | 'year' = 'month';

    /**
     * Hours to change per step
     * @default {1}
     * @type {number}
     * */
    @Input() stepHour = 1;

    /**
     * Minutes to change per step
     * @default {1}
     * @type {number}
     * */
    @Input() stepMinute = 1;

    /**
     * Seconds to change per step
     * @default {1}
     * @type {number}
     * */
    @Input() stepSecond = 1;

    /**
     * Set the first day of week
     * @default {0} -- 0: Sunday ~ 6: Saturday
     * @type {number}
     * */
    private _firstDayOfWeek = 0;
    @Input()
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }

    set firstDayOfWeek( value: number ) {
        if (value > 6 || value < 0) {
            this._firstDayOfWeek = 0;
        } else {
            this._firstDayOfWeek = value;
        }
    }

    private _id: string;
    get id(): string {
        return this._id;
    }

    abstract get selected(): T | null;

    abstract get selecteds(): T[] | null;

    abstract get dateTimeFilter(): ( date: T | null ) => boolean;

    abstract get dtInput(): OwlDateTimeInputDirective<T> | null;

    abstract get maxDateTime(): T | null;

    abstract get minDateTime(): T | null;

    abstract get selectMode(): 'single' | 'range';

    abstract get startAt(): T | null;

    abstract get pickerMode(): 'popup' | 'dialog' | 'inline';

    abstract select( date: T | T[] ): void;

    get formatString(): string {
        return this.pickerType === 'both' ? this.dateTimeFormats.fullPickerInput :
            this.pickerType === 'calendar' ? this.dateTimeFormats.datePickerInput :
                this.dateTimeFormats.timePickerInput;
    }

    /**
     * Date Time Checker to check if the give dateTime is selectable
     * @type {Function}
     * */
    public dateTimeChecker = ( dateTime: T ) => {
        return !!dateTime &&
            (!this.dateTimeFilter || this.dateTimeFilter(dateTime)) &&
            (!this.minDateTime || this.dateTimeAdapter.compare(dateTime, this.minDateTime) >= 0) &&
            (!this.maxDateTime || this.dateTimeAdapter.compare(dateTime, this.maxDateTime) <= 0);
    }

    get disabled(): boolean {
        return false;
    }

    constructor( @Optional() protected dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) protected dateTimeFormats: OwlDateTimeFormats ) {
        this._id = `owl-dt-picker-${nextUniqueId++}`;
    }

    /**
     * @param obj The object to check.
     * @returns The given object if it is both a date instance and valid, otherwise null.
     */
    protected getValidDate( obj: any ): T | null {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    }
}

