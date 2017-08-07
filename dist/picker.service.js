"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialog_component_1 = require("./dialog.component");
var moment = require("moment/moment");
var Subject_1 = require("rxjs/Subject");
var PickerService = (function () {
    function PickerService() {
        this.refreshCalendarSource = new Subject_1.Subject();
        this.refreshCalendar = this.refreshCalendarSource.asObservable();
        this.momentFunc = moment.default ? moment.default : moment;
        this._now = this.momentFunc();
    }
    Object.defineProperty(PickerService.prototype, "dtAutoClose", {
        get: function () {
            return this._dtAutoClose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtDisabled", {
        get: function () {
            return this._dtDisabled;
        },
        set: function (value) {
            this._dtDisabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtLocale", {
        get: function () {
            return this._dtLocale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtViewFormat", {
        get: function () {
            return this._dtViewFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtReturnObject", {
        get: function () {
            return this._dtReturnObject;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtDialogType", {
        get: function () {
            return this._dtDialogType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtPickerType", {
        get: function () {
            return this._dtPickerType;
        },
        set: function (value) {
            this._dtPickerType = value;
            if (value === 'both' || value === 'date') {
                this._dtDialogType = dialog_component_1.DialogType.Date;
            }
            else if (value === 'time') {
                this._dtDialogType = dialog_component_1.DialogType.Time;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtPosition", {
        get: function () {
            return this._dtPosition;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtPositionOffset", {
        get: function () {
            return this._dtPositionOffset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtMode", {
        get: function () {
            return this._dtMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtHourTime", {
        get: function () {
            return this._dtHourTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtShowSeconds", {
        get: function () {
            return this._dtShowSeconds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtOnlyCurrentMonth", {
        get: function () {
            return this._dtOnlyCurrentMonth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtMinMoment", {
        get: function () {
            return this._dtMinMoment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "dtMaxMoment", {
        get: function () {
            return this._dtMaxMoment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "selectedMoment", {
        set: function (value) {
            if (value === null) {
                this._selectedMoment = null;
                this.refreshCalendarSource.next(this._selectedMoment);
            }
            else if (!this._selectedMoment || !this._selectedMoment.isSame(value)) {
                this._selectedMoment = value.clone();
                this.refreshCalendarSource.next(this._selectedMoment);
            }
        },
        get: function () {
          return this._selectedMoment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "now", {
        get: function () {
            return this._now.clone();
        },
        enumerable: true,
        configurable: true
    });
    PickerService.prototype.setPickerOptions = function (dtAutoClose, dtLocale, dtViewFormat, dtReturnObject, dtPosition, dtPositionOffset, dtMode, dtHourTime, dtPickerType, dtShowSeconds, dtOnlyCurrentMonth, dtMinMoment, dtMaxMoment) {
        this._dtAutoClose = dtAutoClose;
        this._dtLocale = dtLocale;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPosition = dtPosition;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtShowSeconds = dtShowSeconds;
        this._dtOnlyCurrentMonth = dtOnlyCurrentMonth;
        this.setMinMoment(dtMinMoment);
        this.setMaxMoment(dtMaxMoment);
        this.dtPickerType = dtPickerType;
    };
    PickerService.prototype.setMoment = function (value) {
        if (value) {
            var m = this._dtReturnObject === 'string' ?
                this.momentFunc(value, this._dtViewFormat) :
                this.momentFunc(value);
            if (m.isValid()) {
                this.selectedMoment = m.clone();
            }
            else {
                this.selectedMoment = null;
            }
        }
        else {
            this.selectedMoment = null;
        }
    };
    PickerService.prototype.setDate = function (moment) {
        if (this._selectedMoment &&
            this._selectedMoment.isSame(moment, 'day')) {
            return true;
        }
        var m = this._selectedMoment ? this._selectedMoment.clone() : this._now;
        var daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        m = m.clone().add(daysDifference, 'd');
        if (!this.isValidMoment(m)) {
            return false;
        }
        else {
            this.selectedMoment = m;
            return true;
        }
    };
    PickerService.prototype.setTime = function (hour, minute, second, meridian) {
        var m = this._selectedMoment ? this._selectedMoment.clone() : this._now;
        if (this.dtHourTime === '12') {
            if (meridian === 'AM') {
                if (hour === 12) {
                    m = m.clone().hours(0);
                }
                else {
                    m = m.clone().hours(hour);
                }
            }
            else {
                if (hour === 12) {
                    m = m.clone().hours(12);
                }
                else {
                    m = m.clone().hours(hour + 12);
                }
            }
        }
        else if (this.dtHourTime === '24') {
            m = m.clone().hours(hour);
        }
        m = m.clone().minutes(minute);
        m = m.clone().seconds(second);
        if (!this.isValidMoment(m)) {
            return false;
        }
        else {
            this.selectedMoment = m;
            return true;
        }
    };
    PickerService.prototype.parseToReturnObjectType = function () {
        if (!this._selectedMoment) {
            return;
        }
        switch (this.dtReturnObject) {
            case 'string':
                return this._selectedMoment.format(this.dtViewFormat);
            case 'moment':
                return this._selectedMoment;
            case 'json':
                return this._selectedMoment.toJSON();
            case 'array':
                return this._selectedMoment.toArray();
            case 'iso':
                return this._selectedMoment.toISOString();
            case 'object':
                return this._selectedMoment.toObject();
            case 'js':
            default:
                return this._selectedMoment.toDate();
        }
    };
    PickerService.prototype.isValidDate = function (moment) {
        var isValid = true;
        if (this._dtMinMoment) {
            var minDate = this._dtMinMoment.clone().startOf('day');
            isValid = isValid && this.momentFunc(moment).isSameOrAfter(minDate);
        }
        if (this._dtMaxMoment) {
            var maxDate = this._dtMaxMoment.clone().endOf('day');
            isValid = isValid && this.momentFunc(moment).isSameOrBefore(maxDate);
        }
        return isValid;
    };
    PickerService.prototype.isValidMoment = function (moment) {
        var isValid = true;
        if (this._dtMinMoment) {
            isValid = isValid && this.momentFunc(moment).isSameOrAfter(this._dtMinMoment);
        }
        if (this._dtMaxMoment) {
            isValid = isValid && this.momentFunc(moment).isSameOrBefore(this._dtMaxMoment);
        }
        return isValid;
    };
    PickerService.prototype.isTheSameDay = function (day_1, day_2) {
        return day_1 && day_2 && day_1.isSame(day_2, 'date');
    };
    PickerService.prototype.resetMinMaxMoment = function (minString, maxString) {
        this.setMinMoment(minString);
        this.setMaxMoment(maxString);
        this.refreshCalendarSource.next(this._selectedMoment);
    };
    PickerService.prototype.setMinMoment = function (minString) {
        if (this.momentFunc(minString, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
            this._dtMinMoment = this.momentFunc(minString, "YYYY-MM-DD HH:mm:ss", true);
        }
        else if (this.momentFunc(minString, "YYYY-MM-DD", true).isValid()) {
            this._dtMinMoment = this.momentFunc(minString, "YYYY-MM-DD", true);
        }
        else {
            this._dtMinMoment = null;
        }
    };
    PickerService.prototype.setMaxMoment = function (maxString) {
        if (this.momentFunc(maxString, "YYYY-MM-DD HH:mm:ss", true).isValid()) {
            this._dtMaxMoment = this.momentFunc(maxString, "YYYY-MM-DD HH:mm:ss", true);
        }
        else if (this.momentFunc(maxString, "YYYY-MM-DD", true).isValid()) {
            this._dtMaxMoment = this.momentFunc(maxString, "YYYY-MM-DD", true).endOf('day');
        }
        else {
            this._dtMaxMoment = null;
        }
    };
    return PickerService;
}());
PickerService.decorators = [
    { type: core_1.Injectable },
];
PickerService.ctorParameters = function () { return []; };
exports.PickerService = PickerService;
//# sourceMappingURL=picker.service.js.map
