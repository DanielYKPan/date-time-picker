import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, Input, NgZone, Optional, Output } from '@angular/core';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { take } from 'rxjs/operators';
var OwlTimerComponent = (function () {
    function OwlTimerComponent(ngZone, elmRef, pickerIntl, dateTimeAdapter) {
        this.ngZone = ngZone;
        this.elmRef = elmRef;
        this.pickerIntl = pickerIntl;
        this.dateTimeAdapter = dateTimeAdapter;
        this.isPM = false;
        this.stepHour = 1;
        this.stepMinute = 1;
        this.stepSecond = 1;
        this.selectedChange = new EventEmitter();
    }
    Object.defineProperty(OwlTimerComponent.prototype, "pickerMoment", {
        get: function () {
            return this._pickerMoment;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "minDateTime", {
        get: function () {
            return this._minDateTime;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._minDateTime = this.getValidDate(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "maxDateTime", {
        get: function () {
            return this._maxDateTime;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._maxDateTime = this.getValidDate(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "hourValue", {
        get: function () {
            return this.dateTimeAdapter.getHours(this.pickerMoment);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "hourBoxValue", {
        get: function () {
            var hours = this.hourValue;
            if (!this.hour12Timer) {
                return hours;
            }
            else {
                if (hours === 0) {
                    hours = 12;
                    this.isPM = false;
                }
                else if (hours > 0 && hours < 12) {
                    this.isPM = false;
                }
                else if (hours === 12) {
                    this.isPM = true;
                }
                else if (hours > 12 && hours < 24) {
                    hours = hours - 12;
                    this.isPM = true;
                }
                return hours;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "minuteValue", {
        get: function () {
            return this.dateTimeAdapter.getMinutes(this.pickerMoment);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "secondValue", {
        get: function () {
            return this.dateTimeAdapter.getSeconds(this.pickerMoment);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "upHourButtonLabel", {
        get: function () {
            return this.pickerIntl.upHourLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "downHourButtonLabel", {
        get: function () {
            return this.pickerIntl.downHourLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "upMinuteButtonLabel", {
        get: function () {
            return this.pickerIntl.upMinuteLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "downMinuteButtonLabel", {
        get: function () {
            return this.pickerIntl.downMinuteLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "upSecondButtonLabel", {
        get: function () {
            return this.pickerIntl.upSecondLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "downSecondButtonLabel", {
        get: function () {
            return this.pickerIntl.downSecondLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "hour12ButtonLabel", {
        get: function () {
            return this.isPM ? this.pickerIntl.hour12PMLabel : this.pickerIntl.hour12AMLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "owlDTTimerClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlTimerComponent.prototype, "owlDTTimeTabIndex", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    OwlTimerComponent.prototype.ngOnInit = function () {
    };
    OwlTimerComponent.prototype.focus = function () {
        var _this = this;
        this.ngZone.runOutsideAngular(function () {
            _this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(function () {
                _this.elmRef.nativeElement.focus();
            });
        });
    };
    OwlTimerComponent.prototype.setHourValueViaInput = function (hours) {
        if (this.hour12Timer && this.isPM && hours >= 1 && hours <= 11) {
            hours = hours + 12;
        }
        else if (this.hour12Timer && !this.isPM && hours === 12) {
            hours = 0;
        }
        this.setHourValue(hours);
    };
    OwlTimerComponent.prototype.setHourValue = function (hours) {
        var m = this.dateTimeAdapter.setHours(this.pickerMoment, hours);
        this.selectedChange.emit(m);
    };
    OwlTimerComponent.prototype.setMinuteValue = function (minutes) {
        var m = this.dateTimeAdapter.setMinutes(this.pickerMoment, minutes);
        this.selectedChange.emit(m);
    };
    OwlTimerComponent.prototype.setSecondValue = function (seconds) {
        var m = this.dateTimeAdapter.setSeconds(this.pickerMoment, seconds);
        this.selectedChange.emit(m);
    };
    OwlTimerComponent.prototype.setMeridiem = function (event) {
        this.isPM = !this.isPM;
        var hours = this.hourValue;
        if (this.isPM) {
            hours = hours + 12;
        }
        else {
            hours = hours - 12;
        }
        if (hours >= 0 && hours <= 23) {
            this.setHourValue(hours);
        }
        event.preventDefault();
    };
    OwlTimerComponent.prototype.upHourEnabled = function () {
        return !this.maxDateTime || this.compareHours(this.stepHour, this.maxDateTime) < 1;
    };
    OwlTimerComponent.prototype.downHourEnabled = function () {
        return !this.minDateTime || this.compareHours(-this.stepHour, this.minDateTime) > -1;
    };
    OwlTimerComponent.prototype.upMinuteEnabled = function () {
        return !this.maxDateTime || this.compareMinutes(this.stepMinute, this.maxDateTime) < 1;
    };
    OwlTimerComponent.prototype.downMinuteEnabled = function () {
        return !this.minDateTime || this.compareMinutes(-this.stepMinute, this.minDateTime) > -1;
    };
    OwlTimerComponent.prototype.upSecondEnabled = function () {
        return !this.maxDateTime || this.compareSeconds(this.stepSecond, this.maxDateTime) < 1;
    };
    OwlTimerComponent.prototype.downSecondEnabled = function () {
        return !this.minDateTime || this.compareSeconds(-this.stepSecond, this.minDateTime) > -1;
    };
    OwlTimerComponent.prototype.compareHours = function (amount, comparedDate) {
        var hours = this.dateTimeAdapter.getHours(this.pickerMoment) + amount;
        hours = Math.max(0, Math.min(hours, 23));
        var result = this.dateTimeAdapter.setHours(this.pickerMoment, hours);
        return this.dateTimeAdapter.compare(result, comparedDate);
    };
    OwlTimerComponent.prototype.compareMinutes = function (amount, comparedDate) {
        var minutes = this.dateTimeAdapter.getMinutes(this.pickerMoment) + amount;
        minutes = Math.max(0, Math.min(minutes, 59));
        var result = this.dateTimeAdapter.setMinutes(this.pickerMoment, minutes);
        return this.dateTimeAdapter.compare(result, comparedDate);
    };
    OwlTimerComponent.prototype.compareSeconds = function (amount, comparedDate) {
        var seconds = this.dateTimeAdapter.getSeconds(this.pickerMoment) + amount;
        seconds = Math.max(0, Math.min(seconds, 59));
        var result = this.dateTimeAdapter.setSeconds(this.pickerMoment, seconds);
        return this.dateTimeAdapter.compare(result, comparedDate);
    };
    OwlTimerComponent.prototype.getValidDate = function (obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    };
    OwlTimerComponent.decorators = [
        { type: Component, args: [{
                    exportAs: 'owlDateTimeTimer',
                    selector: 'owl-date-time-timer',
                    template: "<owl-date-time-timer-box [upBtnAriaLabel]=\"upHourButtonLabel\" [downBtnAriaLabel]=\"downHourButtonLabel\" [upBtnDisabled]=\"!upHourEnabled()\" [downBtnDisabled]=\"!downHourEnabled()\" [boxValue]=\"hourBoxValue\" [value]=\"hourValue\" [min]=\"0\" [max]=\"23\" [step]=\"stepHour\" [inputLabel]=\"'Hour'\" (inputChange)=\"setHourValueViaInput($event)\" (valueChange)=\"setHourValue($event)\"></owl-date-time-timer-box><owl-date-time-timer-box [showDivider]=\"true\" [upBtnAriaLabel]=\"upMinuteButtonLabel\" [downBtnAriaLabel]=\"downMinuteButtonLabel\" [upBtnDisabled]=\"!upMinuteEnabled()\" [downBtnDisabled]=\"!downMinuteEnabled()\" [value]=\"minuteValue\" [min]=\"0\" [max]=\"59\" [step]=\"stepMinute\" [inputLabel]=\"'Minute'\" (inputChange)=\"setMinuteValue($event)\" (valueChange)=\"setMinuteValue($event)\"></owl-date-time-timer-box><owl-date-time-timer-box *ngIf=\"showSecondsTimer\" [showDivider]=\"true\" [upBtnAriaLabel]=\"upSecondButtonLabel\" [downBtnAriaLabel]=\"downSecondButtonLabel\" [upBtnDisabled]=\"!upSecondEnabled()\" [downBtnDisabled]=\"!downSecondEnabled()\" [value]=\"secondValue\" [min]=\"0\" [max]=\"59\" [step]=\"stepSecond\" [inputLabel]=\"'Second'\" (inputChange)=\"setSecondValue($event)\" (valueChange)=\"setSecondValue($event)\"></owl-date-time-timer-box><div *ngIf=\"hour12Timer\" class=\"owl-dt-timer-hour12\"><button class=\"owl-dt-control-button owl-dt-timer-hour12-box\" type=\"button\" tabindex=\"0\" (click)=\"setMeridiem($event)\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\">{{hour12ButtonLabel}}</span></button></div>",
                    styles: [""],
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    OwlTimerComponent.ctorParameters = function () { return [
        { type: NgZone, },
        { type: ElementRef, },
        { type: OwlDateTimeIntl, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
    ]; };
    OwlTimerComponent.propDecorators = {
        "pickerMoment": [{ type: Input },],
        "minDateTime": [{ type: Input },],
        "maxDateTime": [{ type: Input },],
        "showSecondsTimer": [{ type: Input },],
        "hour12Timer": [{ type: Input },],
        "stepHour": [{ type: Input },],
        "stepMinute": [{ type: Input },],
        "stepSecond": [{ type: Input },],
        "selectedChange": [{ type: Output },],
        "owlDTTimerClass": [{ type: HostBinding, args: ['class.owl-dt-timer',] },],
        "owlDTTimeTabIndex": [{ type: HostBinding, args: ['attr.tabindex',] },],
    };
    return OwlTimerComponent;
}());
export { OwlTimerComponent };
