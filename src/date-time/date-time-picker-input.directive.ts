/**
 * date-time-picker-input.directive
 */

import {
    AfterContentInit, AfterViewInit, Directive, ElementRef, EventEmitter,
    forwardRef, HostBinding, HostListener, Inject, Input, OnDestroy, OnInit, Optional, Output, Renderer2
} from '@angular/core';
import {
    AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator,
    ValidatorFn, Validators
} from '@angular/forms';
import { DOWN_ARROW } from '@angular/cdk/keycodes';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';
import { Subscription } from 'rxjs/Subscription';
import { SelectMode } from './date-time.class';

export const OWL_DATETIME_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};

export const OWL_DATETIME_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => OwlDateTimeInputDirective),
    multi: true
};

@Directive({
    selector: 'input[owlDateTime]',
    exportAs: 'owlDateTimeInput',
    providers: [
        OWL_DATETIME_VALUE_ACCESSOR,
        OWL_DATETIME_VALIDATORS,
    ],
})
export class OwlDateTimeInputDirective<T> implements OnInit, AfterViewInit, AfterContentInit,
    OnDestroy, ControlValueAccessor, Validator {

    /**
     * The date time picker that this input is associated with.
     * */
    @Input()
    set owlDateTime( value: OwlDateTimeComponent<T> ) {
        this.registerDateTimePicker(value);
    }

    /**
     * A function to filter date time
     * @default {null}
     * @type {Function}
     * */
    @Input()
    set owlDateTimeFilter( filter: ( date: T | null ) => boolean ) {
        this._dateTimeFilter = filter;
        this.validatorOnChange();
    }

    private _dateTimeFilter: ( date: T | null ) => boolean;
    get dateTimeFilter() {
        return this._dateTimeFilter;
    }

    /** Whether the date time picker's input is disabled. */
    @Input()
    private _disabled: boolean;
    get disabled() {
        return this._disabled;
    }

    set disabled( value: boolean ) {
        if (this._disabled !== value) {
            this._disabled = value;
            this.disabledChange.emit(value);
        }
    }

    /** The minimum valid date. */
    private _min: T | null;
    @Input()
    get min(): T | null {
        return this._min;
    }

    set min( value: T | null ) {
        this._min = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.validatorOnChange();
    }

    /** The maximum valid date. */
    private _max: T | null;
    @Input()
    get max(): T | null {
        return this._max;
    }

    set max( value: T | null ) {
        this._max = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.validatorOnChange();
    }

    /**
     * The picker's select mode
     * @default {'single'}
     * @type {'single' | 'range'}
     * */
    @Input() selectMode: SelectMode = 'single';

    /**
     * The character to separate the 'from' and 'to' in input value
     * @default {'~'}
     * @type {string}
     * */
    @Input() rangeSeparator = '~';

    private _value: T | null;
    @Input()
    get value() {
        return this._value;
    }

    set value( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        this.lastValueValid = !value || this.dateTimeAdapter.isValid(value);
        value = this.getValidDate(value);
        const oldDate = this.value;
        this._value = value;

        // set the input property 'value'
        this.renderer.setProperty(this.elmRef.nativeElement, 'value',
            value ? this.dateTimeAdapter.format(value, this.dtPicker.formatString) : '');

        // check if the input value changed
        if (!this.dateTimeAdapter.isEqual(oldDate, value)) {
            this.valueChange.emit(value);
        }
    }

    private _values: T[] = [];
    @Input()
    get values() {
        return this._values;
    }

    set values( values: T[] ) {
        if (values && values.length > 0) {
            this._values = values.map(( v ) => {
                v = this.dateTimeAdapter.deserialize(v);
                return this.getValidDate(v);
            });
            const from = this._values[0];
            const to = this._values[1];
            this.lastValueValid = (!from || this.dateTimeAdapter.isValid(from)) && (!to || this.dateTimeAdapter.isValid(to));
            const fromFormatted = from ? this.dateTimeAdapter.format(from, this.dtPicker.formatString) : null;
            const toFormatted = to ? this.dateTimeAdapter.format(to, this.dtPicker.formatString) : null;

            if (!fromFormatted && !toFormatted) {
                this.renderer.setProperty(this.elmRef.nativeElement, 'value', null);
            } else {
                this.renderer.setProperty(this.elmRef.nativeElement, 'value', fromFormatted + ' ' + this.rangeSeparator + ' ' + toFormatted);
            }

            this.valueChange.emit(this._values);
        }
    }

    /**
     * Callback to invoke when `change` event is fired on this `<input>`
     * */
    @Output() dateTimeChange = new EventEmitter<any>();

    /**
     * Callback to invoke when an `input` event is fired on this `<input>`.
     * */
    @Output() dateTimeInput = new EventEmitter<any>();

    get elementRef(): ElementRef {
        return this.elmRef;
    }

    /** The date-time-picker that this input is associated with. */
    public dtPicker: OwlDateTimeComponent<T>;

    private dtPickerSub: Subscription = Subscription.EMPTY;
    private localeSub: Subscription = Subscription.EMPTY;

    private lastValueValid = true;

    private onModelChange: Function = () => {
    }
    private onModelTouched: Function = () => {
    }
    private validatorOnChange: Function = () => {
    }

    /** The form control validator for whether the input parses. */
    private parseValidator: ValidatorFn = (): ValidationErrors | null => {
        return this.lastValueValid ?
            null : {'owlDateTimeParse': {'text': this.elmRef.nativeElement.value}};
    }

    /** The form control validator for the min date. */
    private minValidator: ValidatorFn = ( control: AbstractControl ): ValidationErrors | null => {
        if (this.selectMode === 'single') {

            const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
            return (!this.min || !controlValue ||
                this.dateTimeAdapter.compare(this.min, controlValue) <= 0) ?
                null : {'owlDateTimeMin': {'min': this.min, 'actual': controlValue}};

        } else if (this.selectMode === 'range' && control.value) {

            const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
            const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
            return (!this.min || !controlValueFrom || !controlValueTo ||
                this.dateTimeAdapter.compare(this.min, controlValueFrom) <= 0) ?
                null : {'owlDateTimeMin': {'min': this.min, 'actual': [controlValueFrom, controlValueTo]}};

        }
    }

    /** The form control validator for the max date. */
    private maxValidator: ValidatorFn = ( control: AbstractControl ): ValidationErrors | null => {
        if (this.selectMode === 'single') {

            const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
            return (!this.max || !controlValue ||
                this.dateTimeAdapter.compare(this.max, controlValue) >= 0) ?
                null : {'owlDateTimeMax': {'max': this.max, 'actual': controlValue}};

        } else if (this.selectMode === 'range' && control.value) {

            const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
            const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));
            return (!this.max || !controlValueFrom || !controlValueTo ||
                this.dateTimeAdapter.compare(this.max, controlValueTo) >= 0) ?
                null : {'owlDateTimeMax': {'max': this.max, 'actual': [controlValueFrom, controlValueTo]}};

        }
    }

    /** The form control validator for the date filter. */
    private filterValidator: ValidatorFn = ( control: AbstractControl ): ValidationErrors | null => {
        const controlValue = this.getValidDate(this.dateTimeAdapter.deserialize(control.value));
        return !this._dateTimeFilter || !controlValue || this._dateTimeFilter(controlValue) ?
            null : {'owlDateTimeFilter': true};
    }

    /**
     * The form control validator for the range.
     * Check whether the 'before' value is before the 'to' value
     * */
    private rangeValidator: ValidatorFn = ( control: AbstractControl ): ValidationErrors | null => {
        if (this.selectMode === 'single' || !control.value) {
            return null;
        }

        const controlValueFrom = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[0]));
        const controlValueTo = this.getValidDate(this.dateTimeAdapter.deserialize(control.value[1]));

        return !controlValueFrom || !controlValueTo || this.dateTimeAdapter.compare(controlValueFrom, controlValueTo) <= 0 ?
            null : {'owlDateTimeRange': true};
    }

    /** The combined form control validator for this input. */
    private validator: ValidatorFn | null =
        Validators.compose(
            [this.parseValidator, this.minValidator, this.maxValidator, this.filterValidator, this.rangeValidator]);

    /** Emits when the value changes (either due to user input or programmatic change). */
    public valueChange = new EventEmitter<T[] | T | null>();

    /** Emits when the disabled state has changed */
    public disabledChange = new EventEmitter<boolean>();

    @HostBinding('attr.aria-haspopup')
    get owlDateTimeInputAriaHaspopup(): boolean {
        return true;
    }

    @HostBinding('attr.aria-owns')
    get owlDateTimeInputAriaOwns(): string {
        return (this.dtPicker.opened && this.dtPicker.id) || null;
    }

    @HostBinding('attr.min')
    get minIso8601(): string {
        return this.min ? this.dateTimeAdapter.toIso8601(this.min) : null;
    }

    @HostBinding('attr.max')
    get maxIso8601(): string {
        return this.max ? this.dateTimeAdapter.toIso8601(this.max) : null;
    }

    @HostBinding('disabled')
    get owlDateTimeInputDisabled(): boolean {
        return this.disabled;
    }

    constructor( private elmRef: ElementRef,
                 private renderer: Renderer2,
                 @Optional() private dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) private dateTimeFormats: OwlDateTimeFormats ) {
        if (!this.dateTimeAdapter) {
            throw Error(
                `OwlDateTimePicker: No provider found for DateTimePicker. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }

        if (!this.dateTimeFormats) {
            throw Error(
                `OwlDateTimePicker: No provider found for OWL_DATE_TIME_FORMATS. You must import one of the following ` +
                `modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a ` +
                `custom implementation.`);
        }

        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(() => {
            this.value = this.value;
        });
    }

    public ngOnInit(): void {
        if (!this.dtPicker) {
            throw Error(
                `OwlDateTimePicker: the picker input doesn't have any associated owl-date-time component`);
        }
    }

    public ngAfterViewInit(): void {
    }

    public ngAfterContentInit(): void {
        this.dtPickerSub = this.dtPicker.confirmSelectedChange.subscribe(( selecteds: T[] | T ) => {

            if (Array.isArray(selecteds)) {
                this.values = selecteds;
            } else {
                this.value = selecteds;
            }

            this.onModelChange(selecteds);
            this.onModelTouched();
            this.dateTimeChange.emit({source: this, value: selecteds, input: this.elmRef.nativeElement});
        });
    }

    public ngOnDestroy(): void {
        this.dtPickerSub.unsubscribe();
        this.localeSub.unsubscribe();
        this.valueChange.complete();
        this.disabledChange.complete();
    }

    public writeValue( value: any ): void {
        if (this.selectMode === 'single') {
            this.value = value;
        } else {
            this.values = value;
        }
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

    public validate( c: AbstractControl ): { [key: string]: any; } {
        return this.validator ? this.validator(c) : null;
    }

    public registerOnValidatorChange( fn: () => void ): void {
        this.validatorOnChange = fn;
    }

    /**
     * Open the picker when user hold alt + DOWN_ARROW
     * */
    @HostListener('keydown', ['$event'])
    public handleKeydownOnHost( event: KeyboardEvent ): void {
        if (event.altKey && event.keyCode === DOWN_ARROW) {
            this.dtPicker.open();
            event.preventDefault();
        }
    }

    @HostListener('blur', ['$event'])
    public handleBlurOnHost( event: Event ): void {
        this.onModelTouched();
    }

    @HostListener('input', ['$event'])
    public handleInputOnHost( event: any ): void {
        let value = event.target.value;
        let result;

        if (this.dtPicker.selectMode === 'single') {

            if (this.dtPicker.pickerType === 'timer') {
                value = this.convertTimeStringToDateTimeString(value, this.value);
            }

            result = this.dateTimeAdapter.parse(value, this.dateTimeFormats.parseInput);
            this.lastValueValid = !result || this.dateTimeAdapter.isValid(result);
            result = this.getValidDate(result);

            // if the result is valid, we update the value
            if (this.lastValueValid) {
                this._value = result;
            }

        } else if (this.dtPicker.selectMode === 'range') {
            const selecteds = value.split(this.rangeSeparator);
            let fromString = selecteds[0];
            let toString = selecteds[1];

            if (this.dtPicker.pickerType === 'timer') {
                fromString = this.convertTimeStringToDateTimeString(fromString, this.values[0]);
                toString = this.convertTimeStringToDateTimeString(toString, this.values[1]);
            }

            let from = this.dateTimeAdapter.parse(fromString, this.dateTimeFormats.parseInput);
            let to = this.dateTimeAdapter.parse(toString, this.dateTimeFormats.parseInput);
            this.lastValueValid = (!from || this.dateTimeAdapter.isValid(from)) && (!to || this.dateTimeAdapter.isValid(to));
            from = this.getValidDate(from);
            to = this.getValidDate(to);
            result = [from, to];

            // if the result is valid, we update the values
            if (this.lastValueValid) {
                this._values = result;
            }
        }

        this.valueChange.emit(result);
        this.onModelChange(result);
        this.dateTimeInput.emit({source: this, value: result, input: this.elmRef.nativeElement});
    }

    @HostListener('change', ['$event'])
    public handleChangeOnHost( event: any ): void {

        let v;
        if (this.dtPicker.selectMode === 'single') {
            v = this.value;
        } else if (this.dtPicker.selectMode === 'range') {
            v = this.values;
        }

        this.dateTimeChange.emit({
            source: this,
            value: v,
            input: this.elmRef.nativeElement
        });
    }

    /**
     * Register the relationship between this input and its picker component
     * @param {OwlDateTimeComponent} picker -- associated picker component to this input
     * @return {void}
     * */
    private registerDateTimePicker( picker: OwlDateTimeComponent<T> ) {
        if (picker) {
            this.dtPicker = picker;
            this.dtPicker.registerInput(this);
        }
    }

    /**
     * Convert a given obj to a valid date object
     *
     * @param {any} obj The object to check.
     * @return {T | null} The given object if it is both a date instance and valid, otherwise null.
     * */
    private getValidDate( obj: any ): T | null {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    }

    /**
     * Convert a time string to a date-time string
     * When pickerType is 'timer', the value in the picker's input is a time string.
     * The dateTimeAdapter parse fn could not parse a time string to a Date Object.
     * Therefore we need this fn to convert a time string to a date-time string.
     * @param {string} timeString
     * @param {T} dateTime
     * @return {string}
     * */
    private convertTimeStringToDateTimeString( timeString: string, dateTime: T ): string | null {
        if (timeString) {
            const v = dateTime || this.dateTimeAdapter.now();
            const dateString = this.dateTimeAdapter.format(v, this.dateTimeFormats.datePickerInput);
            return dateString + ' ' + timeString;
        } else {
            return null;
        }
    }
}
