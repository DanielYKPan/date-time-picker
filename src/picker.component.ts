/**
 * picker.component
 */

import {
    Component, ElementRef, EventEmitter, forwardRef, Input, NgZone, OnDestroy, OnInit, Output, Renderer2,
    ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
    parse,
    isValid,
    startOfMonth,
    getDate,
    setDate,
    getDay,
    addDays,
    addMonths,
    isSameDay,
    isSameMonth,
    getMonth,
    setMonth,
    getYear,
    addYears,
    differenceInCalendarDays,
    setYear,
    getHours,
    setHours,
    getMinutes,
    setMinutes,
    addMinutes,
    getSeconds,
    setSeconds,
    addSeconds,
    isBefore,
    isAfter,
    compareAsc,
    startOfDay,
    format,
} from 'date-fns';
import { NumberFixedLenPipe } from './numberedFixLen.pipe';

export interface LocaleSettings {
    firstDayOfWeek?: number;
    dayNames: string[];
    dayNamesShort: string[];
    monthNames: string[];
    monthNamesShort: string[];
    dateFns: any;
    btnNow: string;
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}

export const DATETIMEPICKER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimePickerComponent),
    multi: true
};

@Component({
    selector: 'owl-date-time',
    templateUrl: './picker.component.html',
    styleUrls: ['./picker.component.scss'],
    providers: [NumberFixedLenPipe, DATETIMEPICKER_VALUE_ACCESSOR],
    animations: [
        trigger('fadeInOut', [
            state('hidden', style({
                opacity: 0,
                display: 'none'
            })),
            state('visible', style({
                opacity: 1,
                display: 'block'
            })),
            transition('visible => hidden', animate('200ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
})

export class DateTimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

    /**
     * When specify, the calendar would be close when selected a date
     * @default false
     * @type {boolean}
     * */
    @Input() autoClose: boolean;

    /**
     * Type of the value to write back to ngModel
     * @default 'date' -- Javascript Date type
     * @type {'string' | 'date'}
     * */
    @Input() dataType: 'string' | 'date' = 'date';

    /**
     * Format of the date
     * @default 'y/MM/dd'
     * @type {String}
     * */
    @Input() dateFormat: string = 'YYYY/MM/DD HH:mm';

    /**
     * Set the date to highlight and timer picker default value on first opening if the field is blank
     * @default null
     * @type {Date | string}
     * */
    @Input() defaultMoment: Date | string;

    /**
     * When present, it specifies that the component should be disabled
     * @default false
     * @type {Boolean}
     * */
    @Input() disabled: boolean;

    /**
     * Array with dates that should be disabled (not selectable)
     * @default null
     * @type {Date[]}
     * */
    @Input() disabledDates: Date[] = [];

    /**
     * Array with weekday numbers that should be disabled (not selectable)
     * @default null
     * @type {number[]}
     * */
    @Input() disabledDays: number[];

    /**
     * Hide the clear button on input
     * @default false
     * @type {boolean}
     * */
    @Input() hideClearButton: boolean = false;

    /**
     * When enabled, displays the calendar as inline
     * @default false -- popup mode
     * @type {boolean}
     * */
    @Input() inline: boolean;

    /**
     * Identifier of the focus input to match a label defined for the component
     * @default null
     * @type {String}
     * */
    @Input() inputId: string;

    /**
     * Inline style of the picker text input
     * @default null
     * @type {any}
     * */
    @Input() inputStyle: any;

    /**
     * Style class of the picker text input
     * @default null
     * @type {String}
     * */
    @Input() inputStyleClass: string;

    /**
     * Maximum number of selectable dates in multiple mode
     * @default null
     * @type {number}
     * */
    @Input() maxDateCount: number;

    /**
     * The minimum selectable date time
     * @default null
     * @type {Date | string}
     * */
    private _max: Date;
    @Input()
    get max() {
        return this._max;
    }

    set max( val: Date | string ) {
        this._max = this.parseToDate(val);
    }

    /**
     * The maximum selectable date time
     * @default null
     * @type {Date | string }
     * */
    private _min: Date;
    @Input()
    get min() {
        return this._min;
    }

    set min( val: Date | string ) {
        this._min = this.parseToDate(val);
    }

    /**
     * Picker input placeholder value
     * @default
     * @type {String}
     * */
    @Input() placeHolder: string = 'yyyy/mm/dd hh:mm';

    /**
     * When specified to false, allows to enter the date manually with keyboard
     * @default true
     * @type {boolean}
     * */
    @Input() readonlyInput: boolean = true;

    /**
     * When present, it specifies that an input field must be filled out before submitting the form
     * @default false
     * @type {Boolean}
     * */
    @Input() required: boolean;

    /**
     * Defines the quantity of the selection
     *      'single' -- allow only a date value to be selected
     *      'multiple' -- allow multiple date value to be selected
     *      'range' -- allow to select an range ot date values
     * @default 'single'
     * @type {string}
     * */
    @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';

    /**
     * When specify, the picker would have a confirm button and cancel button
     * @default false
     * @type {boolean}
     * */
    @Input() showButtons: boolean;

    /**
     * Whether to show the picker dialog header
     * @default false
     * @type {Boolean}
     * */
    @Input() showHeader: boolean;

    /**
     * Whether to show the second's timer
     * @default false
     * @type {Boolean}
     * */
    @Input() showSecondsTimer: boolean;

    /**
     * Inline style of the element
     * @default null
     * @type {any}
     * */
    @Input() style: any;

    /**
     * Style class of the element
     * @default null
     * @type {String}
     * */
    @Input() styleClass: string;

    /**
     * Index of the element in tabbing order
     * @default null
     * @type {Number}
     * */
    @Input() tabIndex: number = 0;

    /**
     * Set the type of the dateTime picker
     *      'both' -- show both calendar and timer
     *      'calendar' -- show only calendar
     *      'timer' -- show only timer
     * @default 'both'
     * @type {'both' | 'calendar' | 'timer'}
     * */
    @Input() type: 'both' | 'calendar' | 'timer' = 'both';

    /**
     * An object having regional configuration properties for the dateTimePicker
     * */
    @Input()
    get locale() {
        return this._locale;
    }

    set locale( val: any ) {
        this._locale = Object.assign({}, this._locale, val);
    }

    /**
     * Determine the hour format (12 or 24)
     * @default '24'
     * @type {'24'| '12'}
     * */
    @Input() hourFormat: '12' | '24' = '24';

    /**
     * When it is set to false, only show current month's days in calendar
     * @default true
     * @type {boolean}
     * */
    @Input() showOtherMonths: boolean = true;

    /**
     * Callback to invoke when dropdown gets focus.
     * */
    @Output() onFocus = new EventEmitter<any>();

    /**
     * Callback to invoke when dropdown loses focus.
     * */
    @Output() onBlur = new EventEmitter<any>();

    /**
     * Callback to invoke when input value is clear.
     * */
    @Output() onClear = new EventEmitter<any>();

    /**
     * Callback to invoke when dropdown dialog close.
     * */
    @Output() onClose = new EventEmitter<any>();

    /**
     * Callback to invoke when confirm button clicked
     * */
    @Output() onConfirm = new EventEmitter<any>();

    /**
     * Callback to invoke when a invalid date is selected.
     * */
    @Output() onInvalid = new EventEmitter<any>();

    /**
     * Callback to invoke when a date or time is selected.
     * */
    @Output() onSelect = new EventEmitter<any>();

    @ViewChild('container') containerElm: ElementRef;
    @ViewChild('textInput') textInputElm: ElementRef;
    @ViewChild('dialog') dialogElm: ElementRef;

    public calendarDays: Array<any[]>;
    public calendarWeekdays: string[];
    public calendarMonths: Array<string[]>;
    public calendarYears: Array<string[]> = [];
    public dialogType: DialogType = DialogType.Date;
    public dialogVisible: boolean;
    public focus: boolean;
    public formattedValue: string = '';
    public value: any;
    public pickerMoment: Date;
    public pickerMonth: string;
    public pickerYear: string;

    public hourValue: number;
    public minValue: number;
    public secValue: number;
    public meridianValue: string = 'AM';

    private _locale: LocaleSettings = {
        firstDayOfWeek: 0,
        dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dateFns: null,
        btnNow: "Now"
    };
    private dialogClick: boolean;
    private documentClickListener: Function;
    private valueIndex: number = 0;
    private inputValueChanged: boolean = false; // a flag to indicate if the text input value was changed
    private onModelChange: Function = () => {
    };
    private onModelTouched: Function = () => {
    };
    private now: Date;

    constructor( private renderer: Renderer2,
                 private ngZone: NgZone,
                 private numFixedLenPipe: NumberFixedLenPipe ) {
    }

    public ngOnInit() {
        this.now = new Date();
        this.pickerMoment = this.defaultMoment ? this.parseToDate(this.defaultMoment) : this.now;

        this.generateWeekDays();
        this.generateMonthList();
        this.generateCalendar();
        this.updateTimer(null);
    }

    public ngOnDestroy(): void {
        this.unbindDocumentClickListener();
    }

    public writeValue( obj: any ): void {

        if (obj instanceof Array) {
            this.value = [];
            for (let o of obj) {
                let v = this.parseToDate(o);
                this.value.push(v);
            }
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        } else {
            this.value = this.parseToDate(obj);
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        }
        this.updateFormattedValue();
    }

    public registerOnChange( fn: any ): void {
        this.onModelChange = fn;
    }

    public registerOnTouched( fn: any ): void {
        this.onModelTouched = fn;
    }

    public setDisabledState( isDisabled: boolean ): void {
        this.disabled = isDisabled;
    }

    /**
     * Handle input value change event on the text input
     * @param {any} event
     * @return {void}
     * */
    public onInputUpdate( event: any ): void {

        this.inputValueChanged = true;
        let value = this.parseValueFromString(event.target.value);

        if (!value) {
            this.value = null;
        } else if (this.isSingleSelection()) {
            if (!this.isValidValue(value)) {
                value = null;
            }
            this.value = value;
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        } else if (this.isMultiSelection()) {
            for (let i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        } else if (this.isRangeSelection()) {
            for (let i = 0; i < value.length; i++) {
                if (!this.isValidValue(value[i])) {
                    value[i] = null;
                }
            }

            // check if the first date time is after the second one
            if (value[0] && value [1] && isAfter(value[0], value[1])) {
                value[1] = null;
            }
            this.value = value;
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }

        this.updateModel(this.value);
    }

    /**
     * Handle click event on the text input
     * @param {any} event
     * @return {void}
     * */
    public onInputClick( event: any ): void {

        if (this.disabled) {
            event.preventDefault();
            return;
        }

        this.dialogClick = true;
        if (!this.dialogVisible) {
            this.show(event);
        }
        event.preventDefault();
        return;
    }

    /**
     * Set the element on focus
     * @param {any} event
     * @return {void}
     * */
    public onInputFocus( event: any ): void {
        this.focus = true;
        this.onFocus.emit(event);
        event.preventDefault();
        return;
    }

    /**
     * Set the element on blur
     * @param {any} event
     * @return {void}
     * */
    public onInputBlur( event: any ): void {
        this.focus = false;
        if (this.inputValueChanged) {
            this.updateFormattedValue();
            this.inputValueChanged = false;
        }
        this.onModelTouched();
        this.onBlur.emit(event);
        event.preventDefault();
        return;
    }

    /**
     * Handle click event on the dialog
     * @param {any} event
     * @return {void}
     * */
    public onDialogClick( event: any ): void {
        this.dialogClick = true;
    }

    /**
     * Handle click event on the confirm button
     * @param {any} event
     * @return {void}
     * */
    public onConfirmClick( event: any ): void {
        this.updateModel(this.value);
        this.updateFormattedValue();
        this.onConfirm.next({
            originalEvent: event,
            value: this.value
        });
        this.hide(event);
        event.stopPropagation();
        event.preventDefault();
        return;
    }
    
    /**
     * Handle click event on the now button
     * @param {any} event
     * @return {void}
     * */
    public onNowClick( event: any ): void {
        // Set current date
        if(this.value instanceof Array){
            this.value = [];
            this.value[0] = new Date();
        } else {
            this.value = new Date();
        }

        // Update the calendar
        this.updateCalendar(this.value);
        this.updateTimer(this.value);

        event.stopPropagation();
        event.preventDefault();
        return;
    }

    /**
     * Handle click event on the close button
     * @param {any} event
     * @return {void}
     * */
    public onCloseClick( event: any ): void {
        this.hide(event);
        event.stopPropagation();
        event.preventDefault();
        return;
    }

    /**
     * Handle click event on calendar date
     * @param {any} event
     * @param {Date} date
     * @return {void}
     * */
    public onSelectDate( event: any, date: Date ): void {
        if (this.disabled || !date) {
            event.preventDefault();
            return;
        }

        // handle set date based on the current selection mode
        let selected;
        if (this.isSingleSelection()) {
            selected = this.setDateOnSingleSelection(date);
        } else if (this.isRangeSelection()) {
            selected = this.setDateOnRangeSelection(date);
        } else if (this.isMultiSelection()) {
            selected = this.setDateOnMultiSelection(date);
        }

        if (selected) {

            if (!this.showButtons) {
                this.updateModel(selected);
                this.updateFormattedValue();
            } else {
                this.value = selected;
            }

            if (this.value instanceof Array) {
                this.updateCalendar(this.value[this.valueIndex]);
                this.updateTimer(this.value[this.valueIndex]);
                this.onSelect.emit({event, value: this.value[this.valueIndex]});
            } else {
                this.updateCalendar(this.value);
                this.updateTimer(this.value);
                this.onSelect.emit({event, value: this.value});
            }

        }

        // hide the dialog if the autoClose is set to true
        if (this.autoClose) {
            this.hide(event);
        }

    }

    /**
     * Go to previous month
     * @param {any} event
     * @return {void}
     * */
    public prevMonth( event: any ): void {

        if (this.disabled) {
            event.preventDefault();
            return;
        }

        this.pickerMoment = addMonths(this.pickerMoment, -1);
        this.generateCalendar();
        event.preventDefault();
        return;
    }

    /**
     * Go to next month
     * @param {any} event
     * @return {void}
     * */
    public nextMonth( event: any ): void {

        if (this.disabled) {
            event.preventDefault();
            return;
        }

        this.pickerMoment = addMonths(this.pickerMoment, 1);
        this.generateCalendar();
        event.preventDefault();
        return;
    }

    /**
     * Set a pickerMoment's month
     * @param {Number} monthNum
     * @return {void}
     * */
    public selectMonth( monthNum: number ): void {
        this.pickerMoment = setMonth(this.pickerMoment, monthNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Month);
    }

    /**
     * Set a pickerMoment's year
     * @param {Number} yearNum
     * @return {void}
     * */
    public selectYear( yearNum: number ): void {
        this.pickerMoment = setYear(this.pickerMoment, yearNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Year);
    }

    /**
     * Set the selected moment's meridian
     * @param {any} event
     * @return {void}
     * */
    public toggleMeridian( event: any ): void {

        let value = this.value ? (this.value.length ? this.value[this.valueIndex] : this.value) : null;

        if (this.disabled) {
            event.preventDefault();
            return;
        }

        if (!value) {
            this.meridianValue = this.meridianValue === 'AM' ? 'PM' : 'AM';
            return;
        }

        let hours = getHours(value);
        if (this.meridianValue === 'AM') {
            hours += 12;
        } else if (this.meridianValue === 'PM') {
            hours -= 12;
        }

        let selectedTime = setHours(value, hours);
        this.setSelectedTime(event, selectedTime);
        event.preventDefault();
        return;
    }

    /**
     * Set the selected moment's hour
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase hour value by 1
     *      'decrease' -- decrease hour value by 1
     *      number -- set hour value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    public setHours( event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement ): boolean {

        let value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            } else {
                value = this.value;
            }
        } else {
            if (this.type === 'timer') {
                value = new Date();
            } else {
                value = null;
            }
        }

        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }

        let hours = getHours(value);
        if (val === 'increase') {
            hours += 1;
        } else if (val === 'decrease') {
            hours -= 1;
        } else {
            hours = val;
        }

        if (hours > 23) {
            hours = 0;
        } else if (hours < 0) {
            hours = 23;
        }

        let selectedTime = setHours(value, hours);
        let done = this.setSelectedTime(event, selectedTime);

        // Focus the input and select its value when model updated
        if (input) {
            this.runTimeoutOutsideZone(() => {
                input.focus();
            }, 0)
        }

        event.preventDefault();
        return done;
    }

    /**
     * Set the selected moment's minute
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase minute value by 1
     *      'decrease' -- decrease minute value by 1
     *      number -- set minute value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    public setMinutes( event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement ): boolean {

        let value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            } else {
                value = this.value;
            }
        } else {
            if (this.type === 'timer') {
                value = new Date();
            } else {
                value = null;
            }
        }

        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }

        let minutes = getMinutes(value);
        if (val === 'increase') {
            minutes += 1;
        } else if (val === 'decrease') {
            minutes -= 1;
        } else {
            minutes = val;
        }

        if (minutes > 59) {
            minutes = 0;
        } else if (minutes < 0) {
            minutes = 59;
        }

        let selectedTime = setMinutes(value, minutes);
        let done = this.setSelectedTime(event, selectedTime);

        // Focus the input and select its value when model updated
        if (input) {
            this.runTimeoutOutsideZone(() => {
                input.focus();
            }, 0)
        }

        event.preventDefault();
        return done;
    }

    /**
     * Set the selected moment's second
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase second value by 1
     *      'decrease' -- decrease second value by 1
     *      number -- set second value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    public setSeconds( event: any, val: 'increase' | 'decrease' | number, input?: HTMLInputElement ): boolean {

        let value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            } else {
                value = this.value;
            }
        } else {
            if (this.type === 'timer') {
                value = new Date();
            } else {
                value = null;
            }
        }

        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }

        let seconds = getSeconds(value);
        if (val === 'increase') {
            seconds = this.secValue + 1;
        } else if (val === 'decrease') {
            seconds = this.secValue - 1;
        } else {
            seconds = val;
        }

        if (seconds > 59) {
            seconds = 0;
        } else if (seconds < 0) {
            seconds = 59;
        }

        let selectedTime = setSeconds(value, seconds);
        let done = this.setSelectedTime(event, selectedTime);

        // Focus the input and select its value when model updated
        if (input) {
            this.runTimeoutOutsideZone(() => {
                input.focus();
            }, 0)
        }

        event.preventDefault();
        return done;
    }

    /**
     * Check if the date is selected
     * @param {Date} date
     * @return {Boolean}
     * */
    public isSelectedDay( date: Date ): boolean {
        if (this.isSingleSelection()) {
            return this.value && isSameDay(this.value, date);
        } else if (this.isRangeSelection() && this.value && this.value.length) {
            if (this.value[1]) {
                return (isSameDay(this.value[0], date) || isSameDay(this.value[1], date) ||
                    this.isDayBetween(this.value[0], this.value[1], date)) && this.isValidDay(date);
            } else {
                return isSameDay(this.value[0], date);
            }
        } else if (this.isMultiSelection() && this.value && this.value.length) {
            let selected;
            for (let d of this.value) {
                selected = isSameDay(d, date);
                if (selected) {
                    break;
                }
            }
            return selected;
        }
        return false;
    }

    /**
     * Check if a day is between two specific days
     * @param {Date} start
     * @param {Date} end
     * @param {Date} day
     * @return {boolean}
     * */
    public isDayBetween( start: Date, end: Date, day: Date ): boolean {
        if (start && end) {
            return isAfter(day, start) && isBefore(day, end);
        } else {
            return false;
        }
    }

    /**
     * Check if the calendar day is a valid day
     * @param {Date}  date
     * @return {Boolean}
     * */
    public isValidDay( date: Date ): boolean {
        let isValid = true;

        if (this.disabledDates && this.disabledDates.length) {
            for (let disabledDate of this.disabledDates) {
                if (isSameDay(disabledDate, date)) {
                    return false;
                }
            }
        }

        if (isValid && this.disabledDays && this.disabledDays.length) {
            let weekdayNum = getDay(date);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }

        if (isValid && this.min) {
            isValid = isValid && !isBefore(date, startOfDay(this.min));
        }

        if (isValid && this.max) {
            isValid = isValid && !isAfter(date, startOfDay(this.max));
        }
        return isValid;
    }

    /**
     * Check if the month is current pickerMoment's month
     * @param {Number} monthNum
     * @return {Boolean}
     * */
    public isCurrentMonth( monthNum: number ): boolean {
        return getMonth(this.pickerMoment) == monthNum;
    }

    /**
     * Check if the year is current pickerMoment's year
     * @param {Number} yearNum
     * @return {Boolean}
     * */
    public isCurrentYear( yearNum: number ): boolean {
        return getYear(this.pickerMoment) == yearNum;
    }

    /**
     * Change the dialog type
     * @param {DialogType} type
     * @return {void}
     * */
    public changeDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
            return;
        } else {
            this.dialogType = type;
        }

        if (this.dialogType === DialogType.Year) {
            this.generateYearList();
        }
    }

    /**
     * Handle blur event on timer input
     * @param {any} event
     * @param {HTMLInputElement} input
     * @param {string} type
     * @param {number} modelValue
     * @return {void}
     * */
    public onTimerInputBlur( event: any, input: HTMLInputElement, type: string, modelValue: number ): void {
        let val = +input.value;

        if (this.disabled || val === modelValue) {
            event.preventDefault();
            return;
        }

        let done;
        if (!isNaN(val)) {
            switch (type) {
                case 'hours':
                    if (this.hourFormat === '24' &&
                        val >= 0 && val <= 23) {
                        done = this.setHours(event, val);
                    } else if (this.hourFormat === '12'
                        && val >= 1 && val <= 12) {
                        if (this.meridianValue === 'AM' && val === 12) {
                            val = 0;
                        } else if (this.meridianValue === 'PM' && val < 12) {
                            val = val + 12;
                        }
                        done = this.setHours(event, val);
                    }
                    break;
                case 'minutes':
                    if (val >= 0 && val <= 59) {
                        done = this.setMinutes(event, val);
                    }
                    break;
                case 'seconds':
                    if (val >= 0 && val <= 59) {
                        done = this.setSeconds(event, val);
                    }
                    break;
            }
        }

        if (!done) {
            input.value = this.numFixedLenPipe.transform(modelValue, 2);
            return;
        }
        event.preventDefault();
        return;
    }

    /**
     * Set value to null
     * @param {any} event
     * @return {void}
     * */
    public clearValue( event: any ): void {
        this.dialogClick = true;
        this.updateModel(null);
        this.updateTimer(this.value);
        this.updateFormattedValue();
        this.onClear.emit({originalEvent: event, value: this.value});
        event.preventDefault();
    }

    /**
     * Show the dialog
     * @param {any} event
     * @return {void}
     * */
    private show( event: any ): void {
        this.alignDialog();
        this.dialogVisible = true;
        this.dialogType = DialogType.Date;
        this.bindDocumentClickListener();
        return;
    }

    /**
     * Hide the dialog
     * @param {any} event
     * @return {void}
     * */
    private hide( event: any ): void {
        this.dialogVisible = false;
        this.onClose.emit({event});
        this.unbindDocumentClickListener();
        return;
    }

    /**
     * Set the dialog position
     * @return {void}
     * */
    private alignDialog(): void {
        let element = this.dialogElm.nativeElement;
        let target = this.containerElm.nativeElement;
        let elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        let targetHeight = target.offsetHeight;
        let targetWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let viewport = this.getViewport();
        let top, left;

        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = 0;
            }
        }
        else {
            top = targetHeight;
        }


        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    /**
     * Bind click event on document
     * @return {void}
     * */
    private bindDocumentClickListener(): void {
        let firstClick = true;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', ( event: any ) => {
                if (!firstClick && !this.dialogClick) {
                    this.hide(event);
                }

                firstClick = false;
                this.dialogClick = false;
            });
        }
        return;
    }

    /**
     * Unbind click event on document
     * @return {void}
     * */
    private unbindDocumentClickListener(): void {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        return;
    }

    /**
     * Parse a object to Date object
     * @param {any} val
     * @return {Date}
     * */
    private parseToDate( val: any ): Date {
        if (!val) {
            return;
        }

        let parsedVal;
        if (typeof val === 'string') {
            parsedVal = parse(val);
        } else {
            parsedVal = val;
        }

        return isValid(parsedVal) ? parsedVal : null;
    }

    /**
     * Generate the calendar days array
     * @return {void}
     * */
    private generateCalendar(): void {

        if (!this.pickerMoment) {
            return;
        }

        this.calendarDays = [];
        let startDateOfMonth = startOfMonth(this.pickerMoment);
        let startWeekdayOfMonth = getDay(startDateOfMonth);

        let dayDiff = 0 - (startWeekdayOfMonth + (7 - this.locale.firstDayOfWeek)) % 7;

        for (let i = 1; i < 7; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                let date = addDays(startDateOfMonth, dayDiff);
                let inOtherMonth = !isSameMonth(date, this.pickerMoment);
                week.push({
                    date,
                    num: getDate(date),
                    today: isSameDay(this.now, date),
                    otherMonth: inOtherMonth,
                    hide: !this.showOtherMonths && inOtherMonth,
                });
                dayDiff += 1;
            }
            this.calendarDays.push(week);
        }

        this.pickerMonth = this.locale.monthNames[getMonth(this.pickerMoment)];
        this.pickerYear = getYear(this.pickerMoment).toString();
    }

    /**
     * Generate the calendar weekdays array
     * */
    private generateWeekDays(): void {

        if (this.type === 'timer') {
            return;
        }

        this.calendarWeekdays = [];
        let dayIndex = this.locale.firstDayOfWeek;
        for (let i = 0; i < 7; i++) {
            this.calendarWeekdays.push(this.locale.dayNamesShort[dayIndex]);
            dayIndex = (dayIndex == 6) ? 0 : ++dayIndex;
        }
        return;
    }

    /**
     * Generate the calendar month array
     * @return {void}
     * */
    private generateMonthList(): void {

        if (this.type === 'timer') {
            return;
        }

        this.calendarMonths = [];
        let monthIndex = 0;
        for (let i = 0; i < 4; i++) {
            let months = [];
            for (let j = 0; j < 3; j++) {
                months.push(this.locale.monthNamesShort[monthIndex]);
                monthIndex += 1;
            }
            this.calendarMonths.push(months);
        }

        return;
    }

    /**
     * Generate the calendar year array
     * @return {void}
     * */
    public generateYearList( dir?: string ): void {

        if (!this.pickerMoment) {
            return;
        }

        let start;

        if (dir === 'prev') {
            start = +this.calendarYears[0][0] - 12;
        } else if (dir === 'next') {
            start = +this.calendarYears[3][2] + 1;
        } else {
            start = getYear(addYears(this.pickerMoment, -4));
        }

        for (let i = 0; i < 4; i++) {
            let years = [];
            for (let j = 0; j < 3; j++) {
                let year = (start + i * 3 + j).toString();
                years.push(year);
            }
            this.calendarYears[i] = years;
        }
        return;
    }

    /**
     * Update the calendar
     * @param {Date} value
     * @return {void}
     * */
    private updateCalendar( value: Date ): void {

        // if the dateTime picker is only the timer,
        // no need to update the update Calendar.
        if (this.type === 'timer') {
            return;
        }

        if (value && (!this.calendarDays || !isSameMonth(value, this.pickerMoment))) {
            this.pickerMoment = setMonth(this.pickerMoment, getMonth(value));
            this.pickerMoment = setYear(this.pickerMoment, getYear(value));
            this.generateCalendar();
        } else if (!value && !this.calendarDays) {
            this.generateCalendar();
        }
        return;
    }

    /**
     * Update the timer
     * @param {Date} value
     * @return {boolean}
     * */
    private updateTimer( value: Date ): boolean {

        // if the dateTime picker is only the calendar,
        // no need to update the timer
        if (this.type === 'calendar') {
            return false;
        }

        if (!value && !this.defaultMoment) {
            this.hourValue = null;
            this.minValue = null;
            this.secValue = null;
            return true;
        }
        let time = value || this.parseToDate(this.defaultMoment);
        let hours = getHours(time);

        if (this.hourFormat === '12') {
            if (hours < 12 && hours > 0) {
                this.hourValue = hours;
                this.meridianValue = 'AM';
            } else if (hours > 12) {
                this.hourValue = hours - 12;
                this.meridianValue = 'PM';
            } else if (hours === 12) {
                this.hourValue = 12;
                this.meridianValue = 'PM';
            } else if (hours === 0) {
                this.hourValue = 12;
                this.meridianValue = 'AM';
            }
        } else if (this.hourFormat === '24') {
            this.hourValue = hours;
        }

        this.minValue = getMinutes(time);
        this.secValue = getSeconds(time);
        return true;
    }

    /**
     * Update ngModel
     * @param {Date} value
     * @return {Boolean}
     * */
    private updateModel( value: Date | Date[] ): boolean {
        this.value = value;
        if (this.dataType === 'date') {
            this.onModelChange(this.value);
        } else if (this.dataType === 'string') {
            if (this.value && this.value.length) {
                let formatted = [];
                for (let v of this.value) {
                    if (v) {
                        formatted.push(format(v, this.dateFormat, {locale: this.locale.dateFns}));
                    } else {
                        formatted.push(null);
                    }
                }
                this.onModelChange(formatted);
            } else {
                this.onModelChange(format(this.value, this.dateFormat, {locale: this.locale.dateFns}));
            }
        }
        return true;
    }

    /**
     * Update variable formattedValue
     * @return {void}
     * */
    private updateFormattedValue(): void {
        let formattedValue = '';

        if (this.value) {
            if (this.isSingleSelection()) {
                formattedValue = format(this.value, this.dateFormat, {locale: this.locale.dateFns});
            } else if (this.isRangeSelection()) {
                let startDate = this.value[0];
                let endDate = this.value[1];

                formattedValue = format(startDate, this.dateFormat, {locale: this.locale.dateFns});

                if (endDate) {
                    formattedValue += ' - ' + format(endDate, this.dateFormat, {locale: this.locale.dateFns});
                } else {
                    formattedValue += ' - ' + this.dateFormat;
                }
            } else if (this.isMultiSelection()) {
                for (let i = 0; i < this.value.length; i++) {
                    let dateAsString = format(this.value[i], this.dateFormat, {locale: this.locale.dateFns});
                    formattedValue += dateAsString;
                    if (i !== (this.value.length - 1)) {
                        formattedValue += ', ';
                    }
                }
            }
        }

        this.formattedValue = formattedValue;

        return;
    }

    /**
     * Set the time
     * @param {any} event
     * @param {Date} val
     * @return {boolean}
     * */
    private setSelectedTime( event: any, val: Date ): boolean {
        let done;
        let selected;

        if (this.isSingleSelection()) {
            selected = this.setTimeOnSingleSelection(val);
        } else if (this.isRangeSelection()) {
            selected = this.setTimeOnRangeSelection(val);
        } else if (this.isMultiSelection()) {
            selected = this.setTimeOnMultiSelection(val);
        }

        if (selected) {
            this.value = selected;

            if (!this.showButtons) {
                done = this.updateModel(this.value);
                this.updateFormattedValue();
            } else {
                done = true;
            }

            if (this.value instanceof Array) {
                done = done && this.updateTimer(this.value[this.valueIndex]);
            } else {
                done = done && this.updateTimer(this.value);
            }
            this.onSelect.emit({event, value: this.value});
        } else {
            this.onInvalid.emit({originalEvent: event, value: val});
            done = false;
        }
        return done;
    }

    /**
     * set date value on single selection mode
     * @param {Date} moment
     * @return {Date}
     * */
    private setDateOnSingleSelection( moment: Date ): Date {

        if (!moment || isSameDay(this.value, moment)) {
            return null;
        }

        let temp;
        if (this.value) {
            let date = getDate(moment);
            let month = getMonth(moment);
            let year = getYear(moment);

            temp = setYear(this.value, year);
            temp = setMonth(temp, month);
            temp = setDate(temp, date);
        } else {
            temp = moment;
        }

        if (this.isValidValue(temp)) {
            return temp;
        } else {
            if (isSameDay(temp, this._min)) {
                return this._min;
            } else if (isSameDay(temp, this._max)) {
                return this._max;
            } else {
                this.onInvalid.emit({originalEvent: event, value: moment});
                return null;
            }
        }
    }

    /**
     * Set time value on single selection mode
     * @param {Date} moment
     * @return {Date}
     * */
    private setTimeOnSingleSelection( moment: Date ): Date {
        if (!moment) {
            return null;
        }
        return this.isValidValue(moment) ? moment : null;
    }

    /**
     * set date value on range selection mode
     * @param {Date} moment
     * @return {Date[]} -- range selection value
     * */
    private setDateOnRangeSelection( moment: Date ): Date[] {

        if (!moment) {
            return null;
        }

        let temp;

        // the the param moment is valid
        if (this.isValidValue(moment)) {
            temp = moment;
        } else {
            if (isSameDay(moment, this._min)) {
                temp = this._min;
            } else if (isSameDay(moment, this._max)) {
                temp = this._max;
            } else {
                this.onInvalid.emit({originalEvent: event, value: moment});
                return null;
            }
        }

        // check if the current value has value
        if (this.value && this.value.length) {
            let startMoment = this.value[0];
            let endMoment = this.value[1];

            // check if there is endMoment value
            if (!endMoment && differenceInCalendarDays(temp, startMoment) > 0) {
                // if the param moment calendar day is after startMoment calendar day,
                // set the endMoment as moment.
                endMoment = temp;
                this.valueIndex = 1;
            } else if (!endMoment && differenceInCalendarDays(temp, startMoment) === 0) {
                // if the param moment calendar day is the same as startMoment calendar day,
                // set the endMoment as 1 minute(or 1 second) after current startMoment
                temp = this.showSecondsTimer ? addSeconds(startMoment, 1) : addMinutes(startMoment, 1);

                // check if the temp value is valid
                endMoment = this.isValidValue(temp) ? temp : null;
                this.valueIndex = 1;
            } else {
                startMoment = temp;
                endMoment = null;
                this.valueIndex = 0;
            }
            return [startMoment, endMoment]
        } else {
            this.valueIndex = 0;
            return [temp, null];
        }
    }

    /**
     * Set time value on range selection
     * @param {Date} moment
     * @return {Date[]}
     * */
    private setTimeOnRangeSelection( moment: Date ): Date[] {

        if (!moment) {
            return null;
        }

        if (this.isValidValue(moment)) {
            // check if the param moment value is after the start moment of the range
            if (this.valueIndex > 0 && isAfter(moment, this.value[0])) {
                return [this.value[0], moment];
            } else {

                // if the param moment value is before the start moment of the range,
                // we reset the start moment of the range to the param moment value
                // and the the end moment of the range to null
                return [moment, null];
            }
        } else {
            return null;
        }
    }

    /**
     * Set date value on multiple selection mode
     * @param {Date} moment
     * @return {Date[]}
     * */
    private setDateOnMultiSelection( moment: Date ): Date[] {

        if (!moment) {
            return null;
        }

        // check if it exceeds the maxDateCount limit
        if (this.maxDateCount && this.value &&
            this.value.length && this.value.length >= this.maxDateCount) {
            this.onInvalid.emit({originalEvent: event, value: 'Exceed max date count.'});
            return null;
        }

        // if the param moment's date has been selected,
        // we deselect that date.
        if (this.isSelectedDay(moment)) {
            return this.value.filter(( d: Date ) => {
                return !isSameDay(d, moment);
            });
        }

        let temp: Date;
        // check if the selected date is valid
        if (this.isValidValue(moment)) {
            temp = moment;
        } else {
            if (isSameDay(moment, this._min)) {
                temp = this._min;
            } else if (isSameDay(moment, this._max)) {
                temp = this._max;
            } else {
                this.onInvalid.emit({originalEvent: event, value: moment});
                return null;
            }
        }

        let selected = this.value ? [...this.value, temp] : [temp];
        this.valueIndex = selected.length - 1;

        return selected;
    }

    /**
     * Set time value on multiple selection mode
     * @param {Date} moment
     * @return {Date[]}
     * */
    private setTimeOnMultiSelection( moment: Date ): Date[] {
        if (!moment) {
            return null;
        }

        if (this.isValidValue(moment)) {
            let selected = this.value.map(( m: Date, index: number ) => {
                if (index === this.valueIndex) {
                    return moment;
                } else {
                    return m;
                }
            });
            return selected;
        } else {
            return null;
        }
    }

    private isValidValue( value: Date ): boolean {
        let isValid = true;

        if (this.disabledDates && this.disabledDates.length) {
            for (let disabledDate of this.disabledDates) {
                if (isSameDay(disabledDate, value)) {
                    return false;
                }
            }
        }

        if (isValid && this.disabledDays && this.disabledDays.length) {
            let weekdayNum = getDay(value);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }

        if (isValid && this.min) {
            isValid = isValid && !isBefore(value, this.min);
        }

        if (isValid && this.max) {
            isValid = isValid && !isAfter(value, this.max);
        }

        return isValid;
    }

    /**
     * Check if the selection mode is 'single'
     * @return {boolean}
     * */
    private isSingleSelection(): boolean {
        return this.selectionMode === 'single';
    }

    /**
     * Check if the selection mode is 'range'
     * @return {boolean}
     * */
    private isRangeSelection(): boolean {
        return this.selectionMode === 'range';
    }

    /**
     * Check if the selection mode is 'multiple'
     * @return {boolean}
     * */
    private isMultiSelection(): boolean {
        return this.selectionMode === 'multiple'
    }

    /**
     * Parse a string to date value
     * @param text {string}
     * @return Date | Date[]
     * */
    private parseValueFromString( text: string ): any {
        if (!text || text.trim().length === 0) {
            return null;
        }

        let value: any;

        if (this.isSingleSelection()) {
            value = this.parseToDate(text);
        } else if (this.isMultiSelection()) {
            let tokens = text.split(',');
            value = [];
            for (let token of tokens) {
                value.push(this.parseToDate(token.trim()));
            }
        } else if (this.isRangeSelection()) {
            let tokens = text.split(' - ');
            value = [];
            for (let i = 0; i < tokens.length; i++) {
                value[i] = this.parseToDate(tokens[i].trim());
            }
        }

        return value;
    }

    /**
     * Runs a timeout outside of the Angular zone to avoid triggering the change detection.
     * @param {Function} fn
     * @param {number} delay -- optional
     * @return {void}
     */
    private runTimeoutOutsideZone( fn: Function, delay?: number ): void {
        if (!delay) {
            delay = 0;
        }

        this.ngZone.runOutsideAngular(() => {
            return setTimeout(fn, delay);
        });
    }

    private getHiddenElementDimensions( element: any ): any {
        let dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return dimensions;
    }

    private getViewport(): any {
        let win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;

        return {width: w, height: h};
    }
}
