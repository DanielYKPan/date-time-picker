/**
 * date-time-inline.component
 */

import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit, Optional,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OwlDateTime } from './date-time.class';
import { OwlDateTimeInputDirective } from './date-time-picker-input.directive';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';

export const OWL_DATETIME_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwlDateTimeInlineComponent),
    multi: true
};

@Component({
    selector: 'owl-date-time-inline',
    templateUrl: './date-time-inline.component.html',
    styleUrls: ['./date-time-inline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    providers: [
        OWL_DATETIME_VALUE_ACCESSOR,
    ],
})

export class OwlDateTimeInlineComponent<T> extends OwlDateTime<T> implements OnInit, ControlValueAccessor {

    @ViewChild(OwlDateTimeContainerComponent) container: OwlDateTimeContainerComponent<T>;

    private _disabled: boolean;
    @Input()
    get disabled(): boolean {
        return !!this._disabled;
    }

    set disabled( value: boolean ) {
        this._disabled = value;
    }

    private _selectMode: 'single' | 'range' = 'single';
    @Input()
    get selectMode() {
        return this._selectMode;
    }

    set selectMode( mode: 'single' | 'range' ) {
        this._selectMode = mode;
    }

    /** The date to open the calendar to initially. */
    private _startAt: T | null;
    get startAt(): T | null {
        return this._startAt;
    }

    @Input()
    set startAt( date: T | null ) {
        this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }

    private _dateTimeFilter: ( date: T | null ) => boolean;
    @Input('owlDateTimeFilter')
    get dateTimeFilter() {
        return this._dateTimeFilter;
    }

    set dateTimeFilter( filter: ( date: T | null ) => boolean ) {
        this._dateTimeFilter = filter;
    }

    /** The minimum valid date. */
    private _min: T | null;

    get minDateTime(): T | null {
        return this._min || null;
    }

    @Input('min')
    set minDateTime( value: T | null ) {
        this._min = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.changeDetector.markForCheck();
    }

    /** The maximum valid date. */
    private _max: T | null;

    get maxDateTime(): T | null {
        return this._max || null;
    }

    @Input('max')
    set maxDateTime( value: T | null ) {
        this._max = this.getValidDate(this.dateTimeAdapter.deserialize(value));
        this.changeDetector.markForCheck();
    }

    private _value: T | null;
    @Input()
    get value() {
        return this._value;
    }

    set value( value: T | null ) {
        value = this.dateTimeAdapter.deserialize(value);
        value = this.getValidDate(value);
        this._value = value;
        this.selected = value;
        this.container.pickerMoment = value;
    }

    private _values: T[] = [];
    @Input()
    get values() {
        return this._values;
    }

    set values( values: T[] ) {
        if (values && values.length > 0) {
            values = values.map(( v ) => {
                v = this.dateTimeAdapter.deserialize(v);
                v = this.getValidDate(v);
                return v ? this.dateTimeAdapter.clone(v) : null;
            });
            this._values = [...values];
            this.selecteds = [...values];
            this.container.pickerMoment = values[this.container.activeSelectedIndex];
        }
    }

    private _selected: T | null;
    get selected() {
        return this._selected;
    }

    set selected( value: T | null ) {
        this._selected = value;
        this.changeDetector.markForCheck();
    }

    private _selecteds: T[] = [];
    get selecteds() {
        return this._selecteds;
    }

    set selecteds( values: T[] ) {
        this._selecteds = values;
        this.changeDetector.markForCheck();
    }

    get dtInput(): OwlDateTimeInputDirective<T> | null {
        return null;
    }

    get pickerMode(): 'popup' | 'dialog' | 'inline' {
        return 'inline';
    }

    private onModelChange: Function = () => {
    }
    private onModelTouched: Function = () => {
    }

    constructor( protected changeDetector: ChangeDetectorRef,
                 @Optional() protected dateTimeAdapter: DateTimeAdapter<T>,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) protected dateTimeFormats: OwlDateTimeFormats ) {
        super(dateTimeAdapter, dateTimeFormats);
    }

    public ngOnInit() {
        this.container.picker = this;
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

    public select( date: T[] | T ): void {

        if (this.disabled) {
            return;
        }

        if (Array.isArray(date)) {
            this.values = [...date];
        } else {
            this.value = date;
        }
        this.onModelChange(date);
        this.onModelTouched();
    }
}
