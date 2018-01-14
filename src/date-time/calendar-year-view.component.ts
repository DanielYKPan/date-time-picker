/**
 * calendar-year-view.component
 */

import {
    ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Optional,
    Output
} from '@angular/core';
import { CalendarCell } from './calendar-body.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';

const MONTHS_PER_YEAR = 12;
const MONTHS_PER_ROW = 3;

@Component({
    selector: 'owl-date-time-year-view',
    exportAs: 'owlMonthView',
    templateUrl: './calendar-year-view.component.html',
    styleUrls: ['./calendar-year-view.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlYearViewComponent<T> implements OnInit {

    /**
     * The select mode of the picker;
     * */
    @Input() selectMode: 'single' | 'range' = 'single';

    /** The currently selected date. */
    private _selected: T | null;
    @Input()
    get selected(): T | null {
        return this._selected;
    }

    set selected( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
        this.setSelectedMonths();
    }

    private _selecteds: T[] = [];
    @Input()
    get selecteds(): T[] {
        return this._selecteds;
    }

    set selecteds( values: T[] ) {
        this._selecteds = [];
        for (let i = 0; i < values.length; i++) {
            const value = this.dateTimeAdapter.deserialize(values[i]);
            this._selecteds.push(this.getValidDate(value));
        }

        this.setSelectedMonths();
    }

    private _pickerMoment: T | null;
    @Input()
    get pickerMoment() {
        return this._pickerMoment;
    }

    set pickerMoment( value: T ) {
        const oldMoment = this._pickerMoment;
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();

        if (!this.hasSameYear(oldMoment, this._pickerMoment)) {
            this.generateMonthList();
        }
    }

    /**
     * A function used to filter which dates are selectable
     * */
    private _dateFilter: ( date: T ) => boolean;
    @Input()
    get dateFilter() {
        return this._dateFilter;
    }

    set dateFilter( filter: ( date: T ) => boolean ) {
        this._dateFilter = filter;
        this.generateMonthList();
    }

    /** The minimum selectable date. */
    private _minDate: T | null;
    @Input()
    get minDate(): T | null {
        return this._minDate;
    }

    set minDate( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        this._minDate = this.getValidDate(value);
        this.generateMonthList();
    }

    /** The maximum selectable date. */
    private _maxDate: T | null;
    @Input()
    get maxDate(): T | null {
        return this._maxDate;
    }

    set maxDate( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        this._maxDate = this.getValidDate(value);
        this.generateMonthList();
    }

    private monthNames: string[];

    private _months: CalendarCell[][];
    get months() {
        return this._months;
    }

    get activeCell(): number {
        if (this.pickerMoment) {
            return this.dateTimeAdapter.getMonth(this.pickerMoment);
        }
    }

    public todayMonth: number | null;

    /**
     * An array to hold all selectedDates' month value
     * the value is the month number in current year
     * */
    public selectedMonths: number[] = [];

    /**
     * Callback to invoke when a new month is selected
     * */
    @Output() selectedChange = new EventEmitter<T>();

    constructor( @Optional() private dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) private dateTimeFormats: OwlDateTimeFormats ) {
        this.monthNames = this.dateTimeAdapter.getMonthNames('short');
    }

    public ngOnInit() {
    }

    /**
     * Handle a new month selected
     * @param {number} month -- a new month's numeric value
     * @return {void}
     * */
    public monthSelected( month: number ): void {
        const firstDateOfMonth = this.dateTimeAdapter.createDate(
            this.dateTimeAdapter.getYear(this.pickerMoment),
            month,
            1
        );
        const daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(firstDateOfMonth);
        const selected = this.dateTimeAdapter.createDate(
            this.dateTimeAdapter.getYear(this.pickerMoment),
            month,
            Math.min(daysInMonth, this.dateTimeAdapter.getDate(this.pickerMoment)),
            this.dateTimeAdapter.getHours(this.pickerMoment),
            this.dateTimeAdapter.getMinutes(this.pickerMoment),
            this.dateTimeAdapter.getSeconds(this.pickerMoment),
        );

        this.selectedChange.emit(selected);
    }

    /**
     * Generate the calendar month list
     * */
    private generateMonthList(): void {

        if (!this.pickerMoment) {
            return;
        }

        this.setSelectedMonths();
        this.todayMonth = this.getMonthInCurrentYear(this.dateTimeAdapter.now());

        this._months = [];
        for (let i = 0; i < MONTHS_PER_YEAR / MONTHS_PER_ROW; i++) {
            const row = [];

            for (let j = 0; j < MONTHS_PER_ROW; j++) {
                const month = j + i * MONTHS_PER_ROW;
                const monthCell = this.createMonthCell(month);
                row.push(monthCell);
            }

            this._months.push(row);
        }

        return;
    }

    /**
     * Creates an CalendarCell for the given month.
     * @param {number} month
     * @return {CalendarCell}
     * */
    private createMonthCell( month: number ): CalendarCell {
        const startDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        const ariaLabel = this.dateTimeAdapter.format(startDateOfMonth, this.dateTimeFormats.monthYearA11yLabel);
        return new CalendarCell(month, this.monthNames[month], ariaLabel, this.isMonthEnabled(month));
    }

    /**
     * Check if the given month is enable
     * @param {number} month -- the month's numeric value
     * @return {boolean}
     * */
    private isMonthEnabled( month: number ): boolean {

        const firstDateOfMonth = this.dateTimeAdapter.createDate(
            this.dateTimeAdapter.getYear(this.pickerMoment),
            month,
            1
        );

        // If any date in the month is selectable,
        // we count the month as enable
        for (let date = firstDateOfMonth;
             this.dateTimeAdapter.getMonth(date) === month;
             date = this.dateTimeAdapter.addCalendarDays(date, 1)) {
            if (!!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate || this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
                (!this.maxDate || this.dateTimeAdapter.compare(date, this.maxDate) <= 0)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the month in this year that the given Date falls on.
     * Returns null if the given Date is in another year.
     * @param {Date | null} date
     * @return {number | null}
     */
    private getMonthInCurrentYear( date: T | null ): number {
        return this.hasSameYear(date, this.pickerMoment) ?
            this.dateTimeAdapter.getMonth(date) : null;
    }

    /**
     * Set the selectedMonths value
     * In single mode, it has only one value which represent the month the selected date in
     * In range mode, it would has two values, one for the month the fromValue in and the other for the month the toValue in
     * */
    private setSelectedMonths(): void {
        this.selectedMonths = [];
        if (this.selectMode === 'single' && this.selected) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selected);
        }

        if (this.selectMode === 'range' && this.selecteds) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selecteds[0]);
            this.selectedMonths[1] = this.getMonthInCurrentYear(this.selecteds[1]);
        }
    }

    /**
     * Check the given dates are in the same year
     * @param {Date} dateLeft
     * @param {Date} dateRight
     * @return {boolean}
     * */
    private hasSameYear( dateLeft: T, dateRight: T ) {
        return !!(dateLeft && dateRight &&
            this.dateTimeAdapter.getYear(dateLeft) === this.dateTimeAdapter.getYear(dateRight));
    }

    /**
     * Get a valid date object
     * @param {any} obj -- The object to check.
     * @return {Date | null} -- The given object if it is both a date instance and valid, otherwise null.
     */
    private getValidDate( obj: any ): T | null {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    }
}
