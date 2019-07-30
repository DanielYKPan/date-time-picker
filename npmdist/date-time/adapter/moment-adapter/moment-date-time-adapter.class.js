var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Inject, Injectable, Optional, InjectionToken } from '@angular/core';
import * as _moment from 'moment/moment';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '../date-time-adapter.class';
var moment = _moment.default ? _moment.default : _moment;
export var OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS = new InjectionToken('OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS', {
    providedIn: 'root',
    factory: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY
});
export function OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY() {
    return {
        useUtc: false
    };
}
function range(length, valueFunction) {
    var valuesArray = Array(length);
    for (var i = 0; i < length; i++) {
        valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
}
var MomentDateTimeAdapter = (function (_super) {
    __extends(MomentDateTimeAdapter, _super);
    function MomentDateTimeAdapter(owlDateTimeLocale, options) {
        var _this = _super.call(this) || this;
        _this.owlDateTimeLocale = owlDateTimeLocale;
        _this.options = options;
        _this.setLocale(owlDateTimeLocale || moment.locale());
        return _this;
    }
    MomentDateTimeAdapter.prototype.setLocale = function (locale) {
        var _this = this;
        _super.prototype.setLocale.call(this, locale);
        var momentLocaleData = moment.localeData(locale);
        this._localeData = {
            longMonths: momentLocaleData.months(),
            shortMonths: momentLocaleData.monthsShort(),
            longDaysOfWeek: momentLocaleData.weekdays(),
            shortDaysOfWeek: momentLocaleData.weekdaysShort(),
            narrowDaysOfWeek: momentLocaleData.weekdaysMin(),
            dates: range(31, function (i) { return _this.createDate(2017, 0, i + 1).format('D'); }),
        };
    };
    MomentDateTimeAdapter.prototype.getYear = function (date) {
        return this.clone(date).year();
    };
    MomentDateTimeAdapter.prototype.getMonth = function (date) {
        return this.clone(date).month();
    };
    MomentDateTimeAdapter.prototype.getDay = function (date) {
        return this.clone(date).day();
    };
    MomentDateTimeAdapter.prototype.getDate = function (date) {
        return this.clone(date).date();
    };
    MomentDateTimeAdapter.prototype.getHours = function (date) {
        return this.clone(date).hours();
    };
    MomentDateTimeAdapter.prototype.getMinutes = function (date) {
        return this.clone(date).minutes();
    };
    MomentDateTimeAdapter.prototype.getSeconds = function (date) {
        return this.clone(date).seconds();
    };
    MomentDateTimeAdapter.prototype.getTime = function (date) {
        return this.clone(date).valueOf();
    };
    MomentDateTimeAdapter.prototype.getNumDaysInMonth = function (date) {
        return this.clone(date).daysInMonth();
    };
    MomentDateTimeAdapter.prototype.differenceInCalendarDays = function (dateLeft, dateRight) {
        return this.clone(dateLeft).diff(dateRight, 'days');
    };
    MomentDateTimeAdapter.prototype.getYearName = function (date) {
        return this.clone(date).format('YYYY');
    };
    MomentDateTimeAdapter.prototype.getMonthNames = function (style) {
        return style === 'long' ? this._localeData.longMonths : this._localeData.shortMonths;
    };
    MomentDateTimeAdapter.prototype.getDayOfWeekNames = function (style) {
        if (style === 'long') {
            return this._localeData.longDaysOfWeek;
        }
        if (style === 'short') {
            return this._localeData.shortDaysOfWeek;
        }
        return this._localeData.narrowDaysOfWeek;
    };
    MomentDateTimeAdapter.prototype.getDateNames = function () {
        return this._localeData.dates;
    };
    MomentDateTimeAdapter.prototype.toIso8601 = function (date) {
        return this.clone(date).format();
    };
    MomentDateTimeAdapter.prototype.isEqual = function (dateLeft, dateRight) {
        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight));
        }
        return dateLeft === dateRight;
    };
    MomentDateTimeAdapter.prototype.isSameDay = function (dateLeft, dateRight) {
        if (dateLeft && dateRight) {
            return this.clone(dateLeft).isSame(this.clone(dateRight), 'day');
        }
        return dateLeft === dateRight;
    };
    MomentDateTimeAdapter.prototype.isValid = function (date) {
        return this.clone(date).isValid();
    };
    MomentDateTimeAdapter.prototype.invalid = function () {
        return moment.invalid();
    };
    MomentDateTimeAdapter.prototype.isDateInstance = function (obj) {
        return moment.isMoment(obj);
    };
    MomentDateTimeAdapter.prototype.addCalendarYears = function (date, amount) {
        return this.clone(date).add({ years: amount });
    };
    MomentDateTimeAdapter.prototype.addCalendarMonths = function (date, amount) {
        return this.clone(date).add({ months: amount });
    };
    MomentDateTimeAdapter.prototype.addCalendarDays = function (date, amount) {
        return this.clone(date).add({ days: amount });
    };
    MomentDateTimeAdapter.prototype.setHours = function (date, amount) {
        return this.clone(date).hours(amount);
    };
    MomentDateTimeAdapter.prototype.setMinutes = function (date, amount) {
        return this.clone(date).minutes(amount);
    };
    MomentDateTimeAdapter.prototype.setSeconds = function (date, amount) {
        return this.clone(date).seconds(amount);
    };
    MomentDateTimeAdapter.prototype.createDate = function (year, month, date, hours, minutes, seconds) {
        if (hours === void 0) { hours = 0; }
        if (minutes === void 0) { minutes = 0; }
        if (seconds === void 0) { seconds = 0; }
        if (month < 0 || month > 11) {
            throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
        }
        if (date < 1) {
            throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
        }
        if (hours < 0 || hours > 23) {
            throw Error("Invalid hours \"" + hours + "\". Hours has to be between 0 and 23.");
        }
        if (minutes < 0 || minutes > 59) {
            throw Error("Invalid minutes \"" + minutes + "\". Minutes has to between 0 and 59.");
        }
        if (seconds < 0 || seconds > 59) {
            throw Error("Invalid seconds \"" + seconds + "\". Seconds has to be between 0 and 59.");
        }
        var result = this.createMoment({ year: year, month: month, date: date, hours: hours, minutes: minutes, seconds: seconds }).locale(this.locale);
        if (!result.isValid()) {
            throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
        }
        return result;
    };
    MomentDateTimeAdapter.prototype.clone = function (date) {
        return this.createMoment(date).clone().locale(this.locale);
    };
    MomentDateTimeAdapter.prototype.now = function () {
        return this.createMoment().locale(this.locale);
    };
    MomentDateTimeAdapter.prototype.format = function (date, displayFormat) {
        date = this.clone(date);
        if (!this.isValid(date)) {
            throw Error('MomentDateTimeAdapter: Cannot format invalid date.');
        }
        return date.format(displayFormat);
    };
    MomentDateTimeAdapter.prototype.parse = function (value, parseFormat) {
        if (value && typeof value === 'string') {
            return this.createMoment(value, parseFormat, this.locale);
        }
        return value ? this.createMoment(value).locale(this.locale) : null;
    };
    MomentDateTimeAdapter.prototype.deserialize = function (value) {
        var date;
        if (value instanceof Date) {
            date = this.createMoment(value);
        }
        if (typeof value === 'string') {
            if (!value) {
                return null;
            }
            date = this.createMoment(value, moment.ISO_8601).locale(this.locale);
        }
        if (date && this.isValid(date)) {
            return date;
        }
        return _super.prototype.deserialize.call(this, value);
    };
    MomentDateTimeAdapter.prototype.createMoment = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (this.options && this.options.useUtc) ? moment.utc.apply(moment, args) : moment.apply(void 0, args);
    };
    MomentDateTimeAdapter = __decorate([
        Injectable(),
        __param(0, Optional()), __param(0, Inject(OWL_DATE_TIME_LOCALE)),
        __param(1, Optional()), __param(1, Inject(OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS)),
        __metadata("design:paramtypes", [String, Object])
    ], MomentDateTimeAdapter);
    return MomentDateTimeAdapter;
}(DateTimeAdapter));
export { MomentDateTimeAdapter };
