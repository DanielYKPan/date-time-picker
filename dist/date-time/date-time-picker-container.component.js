import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Optional, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OwlCalendarComponent } from './calendar.component';
import { OwlTimerComponent } from './timer.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { Subject } from 'rxjs';
var OwlDateTimeContainerComponent = (function () {
    function OwlDateTimeContainerComponent(cdRef, elmRef, pickerIntl, dateTimeAdapter) {
        this.cdRef = cdRef;
        this.elmRef = elmRef;
        this.pickerIntl = pickerIntl;
        this.dateTimeAdapter = dateTimeAdapter;
        this.animationStateChanged = new EventEmitter();
        this.activeSelectedIndex = 0;
        this.isAnimating = false;
        this._containerState = 'init';
        this.hidePicker$ = new Subject();
        this.confirmSelected$ = new Subject();
    }
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "hidePickerStream", {
        get: function () {
            return this.hidePicker$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "confirmSelectedStream", {
        get: function () {
            return this.confirmSelected$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "pickerMoment", {
        get: function () {
            return this._clamPickerMoment;
        },
        set: function (value) {
            if (value) {
                this._clamPickerMoment = this.dateTimeAdapter.clampDate(value, this.picker.minDateTime, this.picker.maxDateTime);
            }
            this.cdRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "pickerType", {
        get: function () {
            return this.picker.pickerType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "cancelLabel", {
        get: function () {
            return this.pickerIntl.cancelBtnLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "setLabel", {
        get: function () {
            return this.pickerIntl.setBtnLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "fromLabel", {
        get: function () {
            return this.pickerIntl.rangeFromLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "toLabel", {
        get: function () {
            return this.pickerIntl.rangeToLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "fromFormattedValue", {
        get: function () {
            var value = this.picker.selecteds[0];
            return value ? this.dateTimeAdapter.format(value, this.picker.formatString) : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "toFormattedValue", {
        get: function () {
            var value = this.picker.selecteds[1];
            return value ? this.dateTimeAdapter.format(value, this.picker.formatString) : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "showControlButtons", {
        get: function () {
            return this.picker.pickerMode === 'dialog' ||
                (this.picker.pickerType !== 'calendar' && this.picker.pickerMode !== 'inline');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "containerElm", {
        get: function () {
            return this.elmRef.nativeElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTContainerClass", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTPopupContainerClass", {
        get: function () {
            return this.picker.pickerMode === 'popup';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTDialogContainerClass", {
        get: function () {
            return this.picker.pickerMode === 'dialog';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTInlineContainerClass", {
        get: function () {
            return this.picker.pickerMode === 'inline';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTContainerDisabledClass", {
        get: function () {
            return this.picker.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTContainerId", {
        get: function () {
            return this.picker.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlDateTimeContainerComponent.prototype, "owlDTContainerAnimation", {
        get: function () {
            return this._containerState;
        },
        enumerable: true,
        configurable: true
    });
    OwlDateTimeContainerComponent.prototype.ngOnInit = function () {
    };
    OwlDateTimeContainerComponent.prototype.ngAfterContentInit = function () {
        this.initPicker();
    };
    OwlDateTimeContainerComponent.prototype.ngAfterViewInit = function () {
        this.focusPicker();
    };
    OwlDateTimeContainerComponent.prototype.showPickerViaAnimation = function () {
        this._containerState = 'visible';
        this.cdRef.markForCheck();
    };
    OwlDateTimeContainerComponent.prototype.hidePickerViaAnimation = function () {
        this._containerState = 'hidden';
        this.cdRef.markForCheck();
    };
    OwlDateTimeContainerComponent.prototype.dateSelected = function (date) {
        var result;
        if (this.picker.isInSingleMode) {
            result = this.dateSelectedInSingleMode(date);
            if (result) {
                this.pickerMoment = result;
                this.picker.select(result);
            }
            return;
        }
        if (this.picker.isInRangeMode) {
            result = this.dateSelectedInRangeMode(date);
            if (result) {
                this.pickerMoment = result[this.activeSelectedIndex];
                this.picker.select(result);
            }
        }
    };
    OwlDateTimeContainerComponent.prototype.timeSelected = function (time) {
        this.pickerMoment = this.dateTimeAdapter.clone(time);
        if (!this.picker.dateTimeChecker(time)) {
            return;
        }
        if (this.picker.isInSingleMode) {
            this.picker.select(time);
            return;
        }
        if (this.picker.isInRangeMode) {
            var selecteds = this.picker.selecteds.slice();
            if ((this.activeSelectedIndex === 0 && selecteds[1] && this.dateTimeAdapter.compare(time, selecteds[1]) === 1) ||
                (this.activeSelectedIndex === 1 && selecteds[0] && this.dateTimeAdapter.compare(time, selecteds[0]) === -1)) {
                selecteds[0] = time;
                selecteds[1] = time;
            }
            else {
                selecteds[this.activeSelectedIndex] = time;
            }
            this.picker.select(selecteds);
        }
    };
    OwlDateTimeContainerComponent.prototype.onAnimationStart = function (event) {
        this.isAnimating = true;
        this.animationStateChanged.emit(event);
    };
    OwlDateTimeContainerComponent.prototype.onAnimationDone = function (event) {
        var _this = this;
        var toState = event.toState;
        if (toState === 'visible' || toState === 'hidden') {
            Promise.resolve().then(function () {
                _this.animationStateChanged.emit(event);
                _this.isAnimating = false;
            });
        }
    };
    OwlDateTimeContainerComponent.prototype.onCancelClicked = function (event) {
        this.hidePicker$.next(null);
        event.preventDefault();
        return;
    };
    OwlDateTimeContainerComponent.prototype.onSetClicked = function (event) {
        if (!this.picker.dateTimeChecker(this.pickerMoment)) {
            this.hidePicker$.next(null);
            event.preventDefault();
            return;
        }
        this.confirmSelected$.next(event);
        event.preventDefault();
        return;
    };
    OwlDateTimeContainerComponent.prototype.toggleRangeActiveIndex = function () {
        if (this.picker.selectMode === 'range') {
            this.activeSelectedIndex =
                this.activeSelectedIndex === 0 ? 1 : 0;
            var selected = this.picker.selecteds[this.activeSelectedIndex];
            if (this.picker.selecteds && selected) {
                this.pickerMoment = this.dateTimeAdapter.clone(selected);
            }
        }
        return;
    };
    OwlDateTimeContainerComponent.prototype.initPicker = function () {
        this.pickerMoment = this.picker.startAt || this.dateTimeAdapter.now();
        this.activeSelectedIndex = this.picker.selectMode === 'rangeTo' ? 1 : 0;
    };
    OwlDateTimeContainerComponent.prototype.dateSelectedInSingleMode = function (date) {
        if (this.dateTimeAdapter.isSameDay(date, this.picker.selected)) {
            return null;
        }
        return this.updateAndCheckCalendarDate(date);
    };
    OwlDateTimeContainerComponent.prototype.dateSelectedInRangeMode = function (date) {
        var from = this.picker.selecteds[0];
        var to = this.picker.selecteds[1];
        var result = this.updateAndCheckCalendarDate(date);
        if (!result) {
            return null;
        }
        if (this.picker.selectMode === 'range') {
            if (this.picker.selecteds && this.picker.selecteds.length && !to && from &&
                this.dateTimeAdapter.differenceInCalendarDays(result, from) >= 0) {
                to = result;
                this.activeSelectedIndex = 1;
            }
            else {
                from = result;
                to = null;
                this.activeSelectedIndex = 0;
            }
        }
        else if (this.picker.selectMode === 'rangeFrom') {
            from = result;
            if (to && this.dateTimeAdapter.compare(from, to) > 0) {
                to = null;
            }
        }
        else if (this.picker.selectMode === 'rangeTo') {
            to = result;
            if (from && this.dateTimeAdapter.compare(from, to) > 0) {
                from = null;
            }
        }
        return [from, to];
    };
    OwlDateTimeContainerComponent.prototype.updateAndCheckCalendarDate = function (date) {
        var result;
        if (this.picker.pickerType === 'both') {
            result = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(date), this.dateTimeAdapter.getMonth(date), this.dateTimeAdapter.getDate(date), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
            result = this.dateTimeAdapter.clampDate(result, this.picker.minDateTime, this.picker.maxDateTime);
        }
        else {
            result = this.dateTimeAdapter.clone(date);
        }
        return this.picker.dateTimeChecker(result) ? result : null;
    };
    OwlDateTimeContainerComponent.prototype.focusPicker = function () {
        if (this.picker.pickerMode === 'inline') {
            return;
        }
        if (this.calendar) {
            this.calendar.focusActiveCell();
        }
        else if (this.timer) {
            this.timer.focus();
        }
    };
    OwlDateTimeContainerComponent.decorators = [
        { type: Component, args: [{
                    exportAs: 'owlDateTimeContainer',
                    selector: 'owl-date-time-container',
                    template: "<div [cdkTrapFocus]=\"picker.pickerMode !== 'inline'\" class=\"owl-dt-container-inner\"><owl-date-time-calendar *ngIf=\"pickerType === 'both' || pickerType === 'calendar'\" class=\"owl-dt-container-row\" [firstDayOfWeek]=\"picker.firstDayOfWeek\" [(pickerMoment)]=\"pickerMoment\" [selected]=\"picker.selected\" [selecteds]=\"picker.selecteds\" [selectMode]=\"picker.selectMode\" [minDate]=\"picker.minDateTime\" [maxDate]=\"picker.maxDateTime\" [dateFilter]=\"picker.dateTimeFilter\" [startView]=\"picker.startView\" (selectedChange)=\"dateSelected($event)\"></owl-date-time-calendar><owl-date-time-timer *ngIf=\"pickerType === 'both' || pickerType === 'timer'\" class=\"owl-dt-container-row\" [pickerMoment]=\"pickerMoment\" [minDateTime]=\"picker.minDateTime\" [maxDateTime]=\"picker.maxDateTime\" [showSecondsTimer]=\"picker.showSecondsTimer\" [hour12Timer]=\"picker.hour12Timer\" [stepHour]=\"picker.stepHour\" [stepMinute]=\"picker.stepMinute\" [stepSecond]=\"picker.stepSecond\" (selectedChange)=\"timeSelected($event)\"></owl-date-time-timer><div *ngIf=\"picker.isInRangeMode\" role=\"radiogroup\" class=\"owl-dt-container-info owl-dt-container-row\" (click)=\"toggleRangeActiveIndex()\"><div role=\"radio\" [attr.aria-checked]=\"activeSelectedIndex === 0\" class=\"owl-dt-container-range owl-dt-container-from\" [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 0}\"><span class=\"owl-dt-container-info-label\">{{fromLabel}}:</span> <span class=\"owl-dt-container-info-value\">{{fromFormattedValue}}</span></div><div role=\"radio\" [attr.aria-checked]=\"activeSelectedIndex === 1\" class=\"owl-dt-container-range owl-dt-container-to\" [ngClass]=\"{'owl-dt-container-info-active': activeSelectedIndex === 1}\"><span class=\"owl-dt-container-info-label\">{{toLabel}}:</span> <span class=\"owl-dt-container-info-value\">{{toFormattedValue}}</span></div></div><div *ngIf=\"showControlButtons\" class=\"owl-dt-container-buttons owl-dt-container-row\"><button class=\"owl-dt-control-button owl-dt-container-control-button\" type=\"button\" tabindex=\"0\" (click)=\"onCancelClicked($event)\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\">{{cancelLabel}}</span></button> <button class=\"owl-dt-control-button owl-dt-container-control-button\" type=\"button\" tabindex=\"0\" (click)=\"onSetClicked($event)\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\">{{setLabel}}</span></button></div></div>",
                    styles: [""],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    animations: [
                        trigger('containerAnimation', [
                            state('visible', style({ opacity: 1 })),
                            state('hidden', style({ opacity: 0 })),
                            transition('void => visible', [style({ opacity: 0 }), animate('150ms ease-in')]),
                            transition('visible => hidden', animate('150ms ease-out'))
                        ])
                    ]
                },] },
    ];
    OwlDateTimeContainerComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: ElementRef, },
        { type: OwlDateTimeIntl, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
    ]; };
    OwlDateTimeContainerComponent.propDecorators = {
        "calendar": [{ type: ViewChild, args: [OwlCalendarComponent,] },],
        "timer": [{ type: ViewChild, args: [OwlTimerComponent,] },],
        "owlDTContainerClass": [{ type: HostBinding, args: ['class.owl-dt-container',] },],
        "owlDTPopupContainerClass": [{ type: HostBinding, args: ['class.owl-dt-popup-container',] },],
        "owlDTDialogContainerClass": [{ type: HostBinding, args: ['class.owl-dt-dialog-container',] },],
        "owlDTInlineContainerClass": [{ type: HostBinding, args: ['class.owl-dt-inline-container',] },],
        "owlDTContainerDisabledClass": [{ type: HostBinding, args: ['class.owl-dt-container-disabled',] },],
        "owlDTContainerId": [{ type: HostBinding, args: ['attr.id',] },],
        "owlDTContainerAnimation": [{ type: HostBinding, args: ['@containerAnimation',] },],
        "onAnimationStart": [{ type: HostListener, args: ['@containerAnimation.start', ['$event'],] },],
        "onAnimationDone": [{ type: HostListener, args: ['@containerAnimation.done', ['$event'],] },],
    };
    return OwlDateTimeContainerComponent;
}());
export { OwlDateTimeContainerComponent };
