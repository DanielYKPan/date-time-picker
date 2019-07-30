var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
        this._hideOtherMonths = false;
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
    Object.defineProperty(OwlDateTime.prototype, "hideOtherMonths", {
        get: function () {
            return this._hideOtherMonths;
        },
        set: function (val) {
            this._hideOtherMonths = coerceBooleanProperty(val);
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
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], OwlDateTime.prototype, "showSecondsTimer", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], OwlDateTime.prototype, "hour12Timer", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], OwlDateTime.prototype, "startView", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], OwlDateTime.prototype, "stepHour", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], OwlDateTime.prototype, "stepMinute", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], OwlDateTime.prototype, "stepSecond", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], OwlDateTime.prototype, "firstDayOfWeek", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], OwlDateTime.prototype, "hideOtherMonths", null);
    OwlDateTime = __decorate([
        __param(0, Optional()),
        __param(1, Optional()), __param(1, Inject(OWL_DATE_TIME_FORMATS)),
        __metadata("design:paramtypes", [DateTimeAdapter, Object])
    ], OwlDateTime);
    return OwlDateTime;
}());
export { OwlDateTime };
