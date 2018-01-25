/**
 * calendar.component
 */

import {
    AfterContentInit,
    ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Inject, Input, NgZone, OnInit, Optional,
    Output
} from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import {
    DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW,
    UP_ARROW
} from '@angular/cdk/keycodes';
import { take } from 'rxjs/operators';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';

@Component({
    selector: 'owl-date-time-calendar',
    exportAs: 'owlDateTimeCalendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OwlCalendarComponent<T> implements OnInit, AfterContentInit {

    /**
     * Date filter for the month and year view
     * @type {Function}
     * */
    @Input() dateFilter: Function;

    /**
     * Set the first day of week
     * @default {0} -- 0: Sunday ~ 6: Saturday
     * @type {number}
     * */
    @Input() firstDayOfWeek = 0;

    /** The minimum selectable date. */
    private _minDate: T | null;
    @Input()
    get minDate(): T | null {
        return this._minDate;
    }

    set minDate( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);

        this._minDate = value ?
            this.dateTimeAdapter.createDate(
                this.dateTimeAdapter.getYear(value),
                this.dateTimeAdapter.getMonth(value),
                this.dateTimeAdapter.getDate(value),
            ) : null;
    }

    /** The maximum selectable date. */
    private _maxDate: T | null;
    @Input()
    get maxDate(): T | null {
        return this._maxDate;
    }

    set maxDate( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);

        this._maxDate = value ?
            this.dateTimeAdapter.createDate(
                this.dateTimeAdapter.getYear(value),
                this.dateTimeAdapter.getMonth(value),
                this.dateTimeAdapter.getDate(value),
            ) : null;
    }

    /** The current picker moment */
    private _pickerMoment: T;
    @Input()
    get pickerMoment() {
        return this._pickerMoment;
    }

    set pickerMoment( value: T ) {
        value = this.dateTimeAdapter.deserialize(value);
        this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
    }

    @Input() selectMode: 'single' | 'range';

    /** The currently selected moment. */
    private _selected: T | null;
    @Input()
    get selected(): T | null {
        return this._selected;
    }

    set selected( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        this._selected = this.getValidDate(value);
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
    }

    /**
     * The view that the calendar should start in.
     * @default {'month'}
     * @type {'month' | 'year'}
     * */
    @Input() startView: 'month' | 'year' = 'month';

    /** Emits when the currently picker moment changes. */
    @Output() pickerMomentChange = new EventEmitter<T>();

    /** Emits when the currently selected date changes. */
    @Output() selectedChange = new EventEmitter<T>();

    /** Emits when any date is selected. */
    @Output() userSelection = new EventEmitter<void>();

    get periodButtonText(): string {
        return this._isMonthView ? this.dateTimeAdapter.format(this.pickerMoment, this.dateTimeFormats.monthYearLabel) :
            this.dateTimeAdapter.getYearName(this.pickerMoment);
    }

    get periodButtonLabel(): string {
        return this._isMonthView ? this.pickerIntl.switchToYearViewLabel :
            this.pickerIntl.switchToMonthViewLabel;
    }

    get prevButtonLabel(): string {
        return this._isMonthView ? this.pickerIntl.prevMonthLabel :
            this.pickerIntl.prevYearLabel;
    }

    get nextButtonLabel(): string {
        return this._isMonthView ? this.pickerIntl.nextMonthLabel :
            this.pickerIntl.nextYearLabel;
    }

    private _isMonthView = true;
    get isMonthView() {
        return this._isMonthView;
    }

    /**
     * Date filter for the month and year view
     * @type {Function}
     * */
    public dateFilterForViews = ( date: T ) => {
        return !!date &&
            (!this.dateFilter || this.dateFilter(date)) &&
            (!this.minDate || this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
            (!this.maxDate || this.dateTimeAdapter.compare(date, this.maxDate) <= 0);
    }

    /**
     * Bind class 'owl-dt-calendar' to host
     * */
    @HostBinding('class.owl-dt-calendar')
    get owlDTCalendarClass(): boolean {
        return true;
    }

    constructor( private elmRef: ElementRef,
                 private pickerIntl: OwlDateTimeIntl,
                 private ngZone: NgZone,
                 @Optional() private dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) private dateTimeFormats: OwlDateTimeFormats ) {
    }

    public ngOnInit() {
    }

    public ngAfterContentInit(): void {
        this._isMonthView = this.startView !== 'year';
    }

    /**
     * Toggle between month view and year view
     * @return {void}
     * */
    public toggleClicked(): void {
        this._isMonthView = !this._isMonthView;
        this.focusActiveCell();
    }

    /**
     * Handles user clicks on the previous button.
     * */
    public previousClicked(): void {
        this.pickerMoment = this.isMonthView ?
            this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1) :
            this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1);

        this.pickerMomentChange.emit(this.pickerMoment);
    }

    /**
     * Handles user clicks on the next button.
     * */
    public nextClicked(): void {
        this.pickerMoment = this.isMonthView ?
            this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1) :
            this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1);

        this.pickerMomentChange.emit(this.pickerMoment);
    }

    public dateSelected( date: T ): void {
        if ((this.selectMode === 'single' && !this.dateTimeAdapter.isSameDay(date, this.selected)) ||
            this.selectMode === 'range') {
            this.selectedChange.emit(date);
        }
    }

    public monthSelected( month: T ): void {
        this.pickerMoment = this.dateTimeAdapter.clampDate(month, this.minDate, this.maxDate);
        this.pickerMomentChange.emit(this.pickerMoment);
        this._isMonthView = true;
    }

    public userSelected(): void {
        this.userSelection.emit();
    }

    /**
     * Whether the previous period button is enabled.
     * @return {boolean}
     * */
    public prevButtonEnabled(): boolean {
        return !this.minDate || !this.isSameView(this.pickerMoment, this.minDate);
    }

    /**
     * Whether the next period button is enabled.
     * @return {boolean}
     * */
    public nextButtonEnabled(): boolean {
        return !this.maxDate || !this.isSameView(this.pickerMoment, this.maxDate);
    }

    /**
     * Focus to a active cell
     * */
    public focusActiveCell(): void {
        this.ngZone.runOutsideAngular(() => {
            this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this.elmRef.nativeElement.querySelector('.owl-dt-calendar-cell-active').focus();
            });
        });
    }

    /**
     * Handle keydown event on calendar
     * @param {KeyboardEvent} event
     * @return {void}
     * */
    public handleCalendarKeydown( event: KeyboardEvent ): void {
        if (this.isMonthView) {
            this.handleCalendarKeydownInMonthView(event);
        } else {
            this.handleCalendarKeydownInYearView(event);
        }
    }

    /**
     * Handle keydown event on calendar when calendar is in monthView
     * @param {KeyboardEvent} event
     * @return {void}
     * */
    private handleCalendarKeydownInMonthView( event: KeyboardEvent ): void {
        switch (event.keyCode) {
            // minus 1 day
            case LEFT_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 1 day
            case RIGHT_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // minus 1 week
            case UP_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, -7);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 1 week
            case DOWN_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment, 7);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // move to first day of current month
            case HOME:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment,
                    1 - this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // move to last day of current month
            case END:
                this.pickerMoment = this.dateTimeAdapter.addCalendarDays(this.pickerMoment,
                    this.dateTimeAdapter.getNumDaysInMonth(this.pickerMoment) -
                    this.dateTimeAdapter.getDate(this.pickerMoment));
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // minus 1 month (or 1 year)
            case PAGE_UP:
                this.pickerMoment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 1 month (or 1 year)
            case PAGE_DOWN:
                this.pickerMoment = event.altKey ?
                    this.dateTimeAdapter.addCalendarYears(this.pickerMoment, 1) :
                    this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // select the pickerMoment
            case ENTER:
                if (this.dateFilterForViews(this.pickerMoment)) {
                    this.dateSelected(this.pickerMoment);
                    event.preventDefault();
                }
                break;
            default:
                return;
        }

        this.focusActiveCell();
        event.preventDefault();
    }

    /**
     * Handle keydown event on calendar when calendar is in yearView
     * @param {KeyboardEvent} event
     * @return {void}
     * */
    private handleCalendarKeydownInYearView( event: KeyboardEvent ): void {
        switch (event.keyCode) {
            // minus 1 month
            case LEFT_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 1 month
            case RIGHT_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // minus 3 months
            case UP_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -3);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 3 months
            case DOWN_ARROW:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 3);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // move to first month of current year
            case HOME:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment,
                    -this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // move to last month of current year
            case END:
                this.pickerMoment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment,
                    11 - this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // minus 1 year (or 10 year)
            case PAGE_UP:
                this.pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? -10 : -1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // add 1 year (or 10 year)
            case PAGE_DOWN:
                this.pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? 10 : 1);
                this.pickerMomentChange.emit(this.pickerMoment);
                break;

            // Select current month
            case ENTER:
                this.monthSelected(this.pickerMoment);
                break;
            default:
                return;
        }

        this.focusActiveCell();
        event.preventDefault();
    }

    /**
     * Whether the two dates represent the same view in the current view mode (month or year).
     * @param {Date} date1
     * @param {Date} date2
     * @return {boolean}
     * */
    private isSameView( date1: T, date2: T ): boolean {
        return this.isMonthView ?
            !!(date1 && date2 &&
                this.dateTimeAdapter.getYear(date1) === this.dateTimeAdapter.getYear(date2) &&
                this.dateTimeAdapter.getMonth(date1) === this.dateTimeAdapter.getMonth(date2)) :
            !!(date1 && date2 &&
                this.dateTimeAdapter.getYear(date1) === this.dateTimeAdapter.getYear(date2));
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
