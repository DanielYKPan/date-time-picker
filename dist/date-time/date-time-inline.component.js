var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostBinding, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OwlDateTime } from './date-time.class';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
export var OWL_DATETIME_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return OwlDateTimeInlineComponent; }),
    multi: true
};
var OwlDateTimeInlineComponent = (function (_super) {
    __extends(OwlDateTimeInlineComponent, _super);
    function OwlDateTimeInlineComponent(changeDetector, dateTimeAdapter, dateTimeFormats) {
        var _this = _super.call(this, dateTimeAdapter, dateTimeFormats) || this;
        _this.changeDetector = changeDetector;
        _this.dateTimeAdapter = dateTimeAdapter;
        _this.dateTimeFormats = dateTimeFormats;
        _this._pickerType = 'both';
        _this._disabled = false;
        _this._selectMode = 'single';
        _this._values = [];
        _this.yearSelected = new EventEmitter();
        _this.monthSelected = new EventEmitter();
        _this._selecteds = [];
        _this.onModelChange = function () {
        };
        _this.onModelTouched = function () {
        };
        return _this;
    }
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "pickerType", {
        get: function () {
            return this._pickerType;
        },
        set: function (val) {
            if (val !== this._pickerType) {
                this._pickerType = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "disabled", {
        get: function () {
            return !!this._disabled;
        },
        set: function (value) {
            this._disabled = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "selectMode", {
        get: function () {
            return this._selectMode;
        },
        set: function (mode) {
            if (mode !== 'single' && mode !== 'range' &&
                mode !== 'rangeFrom' && mode !== 'rangeTo') {
                throw Error('OwlDateTime Error: invalid selectMode value!');
            }
            this._selectMode = mode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "startAt", {
        get: function () {
            if (this._startAt) {
                return this._startAt;
            }
            if (this.selectMode === 'single') {
                return this.value || null;
            }
            else if (this.selectMode === 'range' ||
                this.selectMode === 'rangeFrom') {
                return this.values[0] || null;
            }
            else if (this.selectMode === 'rangeTo') {
                return this.values[1] || null;
            }
            else {
                return null;
            }
        },
        set: function (date) {
            this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "dateTimeFilter", {
        get: function () {
            return this._dateTimeFilter;
        },
        set: function (filter) {
            this._dateTimeFilter = filter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "minDateTime", {
        get: function () {
            return this._min || null;
        },
        set: function (value) {
            this._min = this.getValidDate(this.dateTimeAdapter.deserialize(value));
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "maxDateTime", {
        get: function () {
            return this._max || null;
        },
        set: function (value) {
            this._max = this.getValidDate(this.dateTimeAdapter.deserialize(value));
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            value = this.getValidDate(value);
            this._value = value;
            this.selected = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "values", {
        get: function () {
            return this._values;
        },
        set: function (values) {
            var _this = this;
            if (values && values.length > 0) {
                values = values.map(function (v) {
                    v = _this.dateTimeAdapter.deserialize(v);
                    v = _this.getValidDate(v);
                    return v ? _this.dateTimeAdapter.clone(v) : null;
                });
                this._values = values.slice();
                this.selecteds = values.slice();
            }
            else {
                this._values = [];
                this.selecteds = [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            this._selected = value;
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "selecteds", {
        get: function () {
            return this._selecteds;
        },
        set: function (values) {
            this._selecteds = values;
            this.changeDetector.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "opened", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "pickerMode", {
        get: function () {
            return 'inline';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "isInSingleMode", {
        get: function () {
            return this._selectMode === 'single';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "isInRangeMode", {
        get: function () {
            return this._selectMode === 'range' || this._selectMode === 'rangeFrom'
                || this._selectMode === 'rangeTo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeInlineComponent.prototype, "owlDTInlineClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    OwlDateTimeInlineComponent.prototype.ngOnInit = function () {
        this.container.picker = this;
    };
    OwlDateTimeInlineComponent.prototype.writeValue = function (value) {
        if (this.isInSingleMode) {
            this.value = value;
            this.container.pickerMoment = value;
        }
        else {
            this.values = value;
            this.container.pickerMoment = this._values[this.container.activeSelectedIndex];
        }
    };
    OwlDateTimeInlineComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    OwlDateTimeInlineComponent.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    OwlDateTimeInlineComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    OwlDateTimeInlineComponent.prototype.select = function (date) {
        if (this.disabled) {
            return;
        }
        if (Array.isArray(date)) {
            this.values = date.slice();
        }
        else {
            this.value = date;
        }
        this.onModelChange(date);
        this.onModelTouched();
    };
    OwlDateTimeInlineComponent.prototype.selectYear = function (normalizedYear) {
        this.yearSelected.emit(normalizedYear);
    };
    OwlDateTimeInlineComponent.prototype.selectMonth = function (normalizedMonth) {
        this.monthSelected.emit(normalizedMonth);
    };
    OwlDateTimeInlineComponent.decorators = [
        { type: Component, args: [{
                    selector: 'owl-date-time-inline',
                    template: "<owl-date-time-container></owl-date-time-container>",
                    styles: [""],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    providers: [
                        OWL_DATETIME_VALUE_ACCESSOR,
                    ],
                },] },
    ];
    OwlDateTimeInlineComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [OWL_DATE_TIME_FORMATS,] },] },
    ]; };
    OwlDateTimeInlineComponent.propDecorators = {
        "container": [{ type: ViewChild, args: [OwlDateTimeContainerComponent,] },],
        "pickerType": [{ type: Input },],
        "disabled": [{ type: Input },],
        "selectMode": [{ type: Input },],
        "startAt": [{ type: Input },],
        "dateTimeFilter": [{ type: Input, args: ['owlDateTimeFilter',] },],
        "minDateTime": [{ type: Input, args: ['min',] },],
        "maxDateTime": [{ type: Input, args: ['max',] },],
        "value": [{ type: Input },],
        "values": [{ type: Input },],
        "yearSelected": [{ type: Output },],
        "monthSelected": [{ type: Output },],
        "owlDTInlineClass": [{ type: HostBinding, args: ['class.owl-dt-inline',] },],
    };
    return OwlDateTimeInlineComponent;
}(OwlDateTime));
export { OwlDateTimeInlineComponent };
