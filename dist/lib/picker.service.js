"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialog_component_1 = require("./dialog.component");
var moment = require("moment/moment");
var Rx_1 = require("rxjs/Rx");
var PickerService = (function () {
    function PickerService() {
        this.eventSource = new Rx_1.Subject();
        this.events = this.eventSource.asObservable();
    }
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
    Object.defineProperty(PickerService.prototype, "dtTheme", {
        get: function () {
            return this._dtTheme;
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
    Object.defineProperty(PickerService.prototype, "moment", {
        get: function () {
            return this._moment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PickerService.prototype, "selectedMoment", {
        get: function () {
            return this._selectedMoment;
        },
        set: function (value) {
            this._selectedMoment = value;
            this.eventSource.next(value);
        },
        enumerable: true,
        configurable: true
    });
    PickerService.prototype.setPickerOptions = function (dtLocale, dtViewFormat, dtReturnObject, dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtShowSeconds) {
        this._dtLocale = dtLocale;
        this._dtViewFormat = dtViewFormat;
        this._dtReturnObject = dtReturnObject;
        this._dtPositionOffset = dtPositionOffset;
        this._dtMode = dtMode;
        this._dtHourTime = dtHourTime;
        this._dtTheme = dtTheme;
        this._dtShowSeconds = dtShowSeconds;
        this.dtPickerType = dtPickerType;
    };
    PickerService.prototype.setMoment = function (value) {
        if (value) {
            this._moment = this._dtReturnObject === 'string' ? moment(value, this._dtViewFormat) :
                moment(value);
            this.selectedMoment = this._moment.clone();
        }
        else {
            this._moment = moment();
        }
    };
    PickerService.prototype.setDate = function (moment) {
        var m = this.selectedMoment ? this.selectedMoment.clone() : this.moment;
        var daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
    };
    PickerService.prototype.setTime = function (hour, minute, second, meridian) {
        var m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        if (this.dtHourTime === '12') {
            if (meridian === 'AM') {
                if (hour === 12) {
                    m.hours(0);
                }
                else {
                    m.hours(hour);
                }
            }
            else {
                if (hour === 12) {
                    m.hours(12);
                }
                else {
                    m.hours(hour + 12);
                }
            }
        }
        else if (this.dtHourTime === '24') {
            m.hours(hour);
        }
        m.minutes(minute);
        m.seconds(second);
        this.selectedMoment = m;
    };
    PickerService.prototype.parseToReturnObjectType = function (selectedMoment) {
        switch (this.dtReturnObject) {
            case 'string':
                return selectedMoment.format(this.dtViewFormat);
            case 'moment':
                return selectedMoment;
            case 'json':
                return selectedMoment.toJSON();
            case 'array':
                return selectedMoment.toArray();
            case 'iso':
                return selectedMoment.toISOString();
            case 'object':
                return selectedMoment.toObject();
            case 'js':
            default:
                return selectedMoment.toDate();
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