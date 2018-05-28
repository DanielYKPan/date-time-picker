/**
 * calendar-month-view.component
 */

import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    ViewChild
} from '@angular/core';
import { CalendarCell, OwlCalendarBodyComponent } from './calendar-body.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';
import { Subscription } from 'rxjs';
import { SelectMode } from './date-time.class';
import {
    DOWN_ARROW,
    END,
    ENTER,
    HOME,
    LEFT_ARROW,
    PAGE_DOWN,
    PAGE_UP,
    RIGHT_ARROW,
    UP_ARROW
} from '@angular/cdk/keycodes';

const DAYS_PER_WEEK = 7;
const WEEKS_PER_VIEW = 6;

@Component({
    selector: 'owl-date-time-month-view',
    exportAs: 'owlYearView',
    templateUrl: './calendar-month-view.component.html',
    styleUrls: ['./calendar-month-view.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlMonthViewComponent<T> implements OnInit, AfterContentInit, OnDestroy {

    /**
     * Whether to hide dates in other months at the start or end of the current month.
     * */
    @Input() hideOtherMonths: boolean;

    @Input() firstDayOfWeek: number;

    /**
     * The select mode of the picker;
     * */
    @Input() selectMode: SelectMode;

    /** The currently selected date. */
    private _selected: T | null;
    @Input()
    get selected(): T | null {
        return this._selected;
    }

    set selected( value: T | null ) {
        const oldSelected = this._selected;
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);

        if (!this.dateTimeAdapter.isSameDay(oldSelected, this._selected)) {
            this.setSelectedDates();
        }
    }

    private _selecteds: T[] = [];
    @Input()
    get selecteds(): T[] {
        return this._selecteds;
    }

    set selecteds( values: T[] ) {
        this._selecteds = values.map(( v ) => {
            v = this.dateTimeAdapter.deserialize(v);
            return this.getValidDate(v);
        });
        this.setSelectedDates();
    }

    private _pickerMoment: T;
    @Input()
    get pickerMoment() {
        return this._pickerMoment;
    }

    set pickerMoment( value: T ) {
        const oldMoment = this._pickerMoment;
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();

        this.firstDateOfMonth = this.dateTimeAdapter.createDate(
            this.dateTimeAdapter.getYear(this._pickerMoment),
            this.dateTimeAdapter.getMonth(this._pickerMoment),
            1
        );

        if (!this.isSameMonth(oldMoment, this._pickerMoment) && this.initiated) {
            this.generateCalendar();
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
        if (this.initiated) {
            this.generateCalendar();
        }
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
        if (this.initiated) {
            this.generateCalendar();
        }
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

        if (this.initiated) {
            this.generateCalendar();
        }
    }

    private _weekdays: Array<{ long: string, short: string, narrow: string }>;
    get weekdays() {
        return this._weekdays;
    }

    private _days: CalendarCell[][];
    get days() {
        return this._days;
    }

    get activeCell(): number {
        if (this.pickerMoment) {
            return this.dateTimeAdapter.getDate(this.pickerMoment) + this.firstRowOffset - 1;
        }
    }

    get isInSingleMode(): boolean {
        return this.selectMode === 'single';
    }

    get isInRangeMode(): boolean {
        return this.selectMode === 'range' || this.selectMode === 'rangeFrom'
            || this.selectMode === 'rangeTo';
    }

    private firstDateOfMonth: T;

    private localeSub: Subscription = Subscription.EMPTY;

    private initiated = false;

    /**
     * The date of the month that today falls on.
     * */
    public todayDate: number | null;

    /**
     * An array to hold all selectedDates' value
     * the value is the day number in current month
     * */
    public selectedDates: number[] = [];

    // the index of cell that contains the first date of the month
    public firstRowOffset: number;

    /**
     * Callback to invoke when a new date is selected
     * */
    @Output() readonly selectedChange = new EventEmitter<T | null>();

    /**
     * Callback to invoke when any date is selected.
     * */
    @Output() readonly userSelection = new EventEmitter<void>();

    /** Emits when any date is activated. */
    @Output() readonly pickerMomentChange: EventEmitter<T> = new EventEmitter<T>();

    /** The body of calendar table */
    @ViewChild(OwlCalendarBodyComponent) calendarBodyElm: OwlCalendarBodyComponent;

    @HostBinding('class.owl-dt-calendar-view')
    get owlDTCalendarView(): boolean {
        return true;
    }

    constructor( private cdRef: ChangeDetectorRef,
                 @Optional() private dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) private dateTimeFormats: OwlDateTimeFormats ) {
    }

    public ngOnInit() {
        this.generateWeekDays();

        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(() => {
            this.generateWeekDays();
            this.generateCalendar();
            this.cdRef.markForCheck();
        });
    }

    public ngAfterContentInit(): void {
        this.generateCalendar();
        this.initiated = true;
    }

    public ngOnDestroy(): void {
        this.localeSub.unsubscribe();
    }

    /**
     * Handle a calendarCell selected
     * @param {CalendarCell} cell
     * @return {void}
     * */
    public selectCalendarCell( cell: CalendarCell ): void {

        // Cases in which the date would not be selected
        // 1, the calendar cell is NOT enabled (is NOT valid)
        // 2, the selected date is NOT in current picker's month and the hideOtherMonths is enabled
        if (!cell.enabled || (this.hideOtherMonths && cell.out)) {
            return;
        }

        this.selectDate(cell.value);
    }

    /**
     * Handle a new date selected
     * @param {number} date -- a new date's numeric value
     * @return {void}
     * */
    private selectDate( date: number ): void {
        const daysDiff = date - 1;
        const selected = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);

        if ((this.isInSingleMode && this.selectedDates[0] !== date) ||
            this.isInRangeMode) {
            this.selectedChange.emit(selected);
        }

        this.userSelection.emit();
    }

    /**
     * Handle keydown event on calendar body
     * @param {KeyboardEvent} event
     * @return {void}
     * */
    public handleCalendarKeydown( event: KeyboardEvent ): void {
        let moment;
        switch (event.keyCode) {
            // minus 1 day
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;

            // add 1 day
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;

            // minus 1 week
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -7);
                this.pickerMomentChange.emit(moment);
                break;

            // add 1 week
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 7);
                this.pickerMomentChange.emit(moment);
                break;

            // move to first day of current month
            case HOME:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment,
                    1 - this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;

            // move to last day of current month
            case END:
                moment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment,
                    this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment) -
                    this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;

            // minus 1 month (or 1 year)
            case PAGE_UP:
                moment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;

            // add 1 month (or 1 year)
            case PAGE_DOWN:
                moment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;

            // select the pickerMoment
            case ENTER:
                if (!this.dateFilter || this.dateFilter(this.pickerMoment)) {
                    this.selectDate(this.dateTimeAdapter.getDate(this.pickerMoment));
                }
                break;
            default:
                return;
        }

        this.focusActiveCell();
        event.preventDefault();
    }

    /**
     * Generate the calendar weekdays array
     * */
    private generateWeekDays(): void {

        const longWeekdays = this.dateTimeAdapter.getDayOfWeekNames('long');
        const shortWeekdays = this.dateTimeAdapter.getDayOfWeekNames('short');
        const narrowWeekdays = this.dateTimeAdapter.getDayOfWeekNames('narrow');
        const firstDayOfWeek = this.firstDayOfWeek;

        const weekdays = longWeekdays.map(( long, i ) => {
            return {long, short: shortWeekdays[i], narrow: narrowWeekdays[i]};
        });

        this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));

        return;
    }

    /**
     * Generate the calendar days array
     * */
    private generateCalendar(): void {
        if (!this.pickerMoment) {
            return;
        }

        this.todayDate = null;

        // the first weekday of the month
        const startWeekdayOfMonth = this.dateTimeAdapter.getDay(this.firstDateOfMonth);
        const firstDayOfWeek = this.firstDayOfWeek;

        // the amount of days from the first date of the month
        // if it is < 0, it means the date is in previous month
        let daysDiff = 0 - (startWeekdayOfMonth + (DAYS_PER_WEEK - firstDayOfWeek)) % DAYS_PER_WEEK;

        // the index of cell that contains the first date of the month
        this.firstRowOffset = Math.abs(daysDiff);

        this._days = [];
        for (let i = 0; i < WEEKS_PER_VIEW; i++) {
            const week = [];
            for (let j = 0; j < DAYS_PER_WEEK; j++) {
                const date = this.dateTimeAdapter.addCalendarDays(this.firstDateOfMonth, daysDiff);
                const dateCell = this.createDateCell(date, daysDiff);

                // check if the date is today
                if (this.dateTimeAdapter.isSameDay(this.dateTimeAdapter.now(), date)) {
                    this.todayDate = daysDiff + 1;
                }

                week.push(dateCell);
                daysDiff += 1;
            }
            this._days.push(week);
        }

        this.setSelectedDates();
    }

    /**
     * Creates CalendarCell for days.
     * @param {Date} date -- the date that the cell represents
     * @param {number} daysDiff -- the amount of days from the first date of the month
     * @return {CalendarCell}
     * */
    private createDateCell( date: T, daysDiff: number ): CalendarCell {
        // total days of the month
        const daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment);
        const dateNum = this.dateTimeAdapter.getDate(date);
        const ariaLabel = this.dateTimeAdapter.format(date, this.dateTimeFormats.dateA11yLabel);

        // check if the date if selectable
        const enabled = this.isDateEnabled(date);

        // check if date is not in current month
        const dayValue = daysDiff + 1;
        const out = dayValue < 1 || dayValue > daysInMonth;
        const cellClass = 'owl-dt-day-' + this.dateTimeAdapter.getDay(date);

        return new CalendarCell(dayValue, dateNum.toString(), ariaLabel, enabled, out, cellClass);
    }

    /**
     * Check if the date is valid
     * @param date
     * @return {boolean}
     * */
    private isDateEnabled( date: T ): boolean {
        return !!date &&
            (!this.dateFilter || this.dateFilter(date)) &&
            (!this.minDate || this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
            (!this.maxDate || this.dateTimeAdapter.compare(date, this.maxDate) <= 0);
    }

    /**
     * Get a valid date object
     * @param {any} obj -- The object to check.
     * @return {Date | null} -- The given object if it is both a date instance and valid, otherwise null.
     */
    private getValidDate( obj: any ): T | null {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    }

    /**
     * Check if the give dates are none-null and in the same month
     * @param {Date} dateLeft
     * @param {Date} dateRight
     * @return {boolean}
     * */
    public isSameMonth( dateLeft: T, dateRight: T ): boolean {
        return !!(dateLeft && dateRight &&
            this.dateTimeAdapter.isValid(dateLeft) && this.dateTimeAdapter.isValid(dateRight) &&
            this.dateTimeAdapter.getYear(dateLeft) === this.dateTimeAdapter.getYear(dateRight) &&
            this.dateTimeAdapter.getMonth(dateLeft) === this.dateTimeAdapter.getMonth(dateRight));
    }

    /**
     * Set the selectedDates value.
     * In single mode, it has only one value which represent the selected date
     * In range mode, it would has two values, one for the fromValue and the other for the toValue
     * */
    private setSelectedDates(): void {
        this.selectedDates = [];

        if (!this.firstDateOfMonth) {
            return;
        }

        if (this.isInSingleMode && this.selected) {
            const dayDiff = this.dateTimeAdapter.differenceInCalendarDays(this.selected, this.firstDateOfMonth);
            this.selectedDates[0] = dayDiff + 1;
            return;
        }

        if (this.isInRangeMode && this.selecteds) {
            this.selectedDates = this.selecteds.map(( selected ) => {
                if (this.dateTimeAdapter.isValid(selected)) {
                    const dayDiff = this.dateTimeAdapter.differenceInCalendarDays(selected, this.firstDateOfMonth);
                    return dayDiff + 1;
                } else {
                    return null;
                }
            });
        }
    }

    private focusActiveCell() {
        this.calendarBodyElm.focusActiveCell();
    }
}
