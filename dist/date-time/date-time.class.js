import { Inject, Input, Optional } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
var nextUniqueId = 0;
var OwlDateTime = (function () {
    function OwlDateTime(dateTimeAdapter, dateTimeFormats) {
        var _this = this;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        this._showSecondsTimer = false;
        this._hour12Timer = false;
        this.startView = 'month';
        this._stepHour = 1;
        this._stepMinute = 1;
        this._stepSecond = 1;
        this._firstDayOfWeek = 0;
        this.dateTimeChecker = function (dateTime) {
            return !!dateTime &&
                (!_this.dateTimeFilter || _this.dateTimeFilter(dateTime)) &&
                (!_this.minDateTime || _this.dateTimeAdapter.compare(dateTime, _this.minDateTime) >= 0) &&
                (!_this.maxDateTime || _this.dateTimeAdapter.compare(dateTime, _this.maxDateTime) <= 0);
        };
        if (!this.dateTimeAdapter) {
            throw Error("OwlDateTimePicker: No provider found for DateTimeAdapter. You must import one of the following " +
                "modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a " +
                "custom implementation.");
        }
        if (!this.dateTimeFormats) {
            throw Error("OwlDateTimePicker: No provider found for OWL_DATE_TIME_FORMATS. You must import one of the following " +
                "modules at your application root: OwlNativeDateTimeModule, OwlMomentDateTimeModule, or provide a " +
                "custom implementation.");
        }
        this._id = "owl-dt-picker-" + nextUniqueId++;
    }
    Object.defineProperty(OwlDateTime.prototype, "showSecondsTimer", {
        get: function () {
            return this._showSecondsTimer;
        },
        set: function (val) {
            this._showSecondsTimer = coerceBooleanProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "hour12Timer", {
        get: function () {
            return this._hour12Timer;
        },
        set: function (val) {
            this._hour12Timer = coerceBooleanProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "stepHour", {
        get: function () {
            return this._stepHour;
        },
        set: function (val) {
            this._stepHour = coerceNumberProperty(val, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "stepMinute", {
        get: function () {
            return this._stepMinute;
        },
        set: function (val) {
            this._stepMinute = coerceNumberProperty(val, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "stepSecond", {
        get: function () {
            return this._stepSecond;
        },
        set: function (val) {
            this._stepSecond = coerceNumberProperty(val, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "firstDayOfWeek", {
        get: function () {
            return this._firstDayOfWeek;
        },
        set: function (value) {
            value = coerceNumberProperty(value, 0);
            if (value > 6 || value < 0) {
                this._firstDayOfWeek = 0;
            }
            else {
                this._firstDayOfWeek = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "formatString", {
        get: function () {
            return this.pickerType === 'both' ? this.dateTimeFormats.fullPickerInput :
                this.pickerType === 'calendar' ? this.dateTimeFormats.datePickerInput :
                    this.dateTimeFormats.timePickerInput;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTime.prototype, "disabled", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    OwlDateTime.prototype.getValidDate = function (obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    };
    OwlDateTime.ctorParameters = function () { return [
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [OWL_DATE_TIME_FORMATS,] },] },
    ]; };
    OwlDateTime.propDecorators = {
        "showSecondsTimer": [{ type: Input },],
        "hour12Timer": [{ type: Input },],
        "startView": [{ type: Input },],
        "stepHour": [{ type: Input },],
        "stepMinute": [{ type: Input },],
        "stepSecond": [{ type: Input },],
        "firstDayOfWeek": [{ type: Input },],
    };
    return OwlDateTime;
}());
export { OwlDateTime };
