import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { CalendarCell, OwlCalendarBodyComponent } from './calendar-body.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './adapter/date-time-format.class';
import { Subscription } from 'rxjs';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
var MONTHS_PER_YEAR = 12;
var MONTHS_PER_ROW = 3;
var OwlYearViewComponent = (function () {
    function OwlYearViewComponent(cdRef, dateTimeAdapter, dateTimeFormats) {
        this.cdRef = cdRef;
        this.dateTimeAdapter = dateTimeAdapter;
        this.dateTimeFormats = dateTimeFormats;
        this._selecteds = [];
        this.localeSub = Subscription.EMPTY;
        this.initiated = false;
        this.selectedMonths = [];
        this.selectedChange = new EventEmitter();
        this.pickerMomentChange = new EventEmitter();
        this.keyboardEnter = new EventEmitter();
        this.monthNames = this.dateTimeAdapter.getMonthNames('short');
    }
    Object.defineProperty(OwlYearViewComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._selected = this.getValidDate(value);
            this.setSelectedMonths();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "selecteds", {
        get: function () {
            return this._selecteds;
        },
        set: function (values) {
            this._selecteds = [];
            for (var i = 0; i < values.length; i++) {
                var value = this.dateTimeAdapter.deserialize(values[i]);
                this._selecteds.push(this.getValidDate(value));
            }
            this.setSelectedMonths();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "pickerMoment", {
        get: function () {
            return this._pickerMoment;
        },
        set: function (value) {
            var oldMoment = this._pickerMoment;
            value = this.dateTimeAdapter.deserialize(value);
            this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
            if (!this.hasSameYear(oldMoment, this._pickerMoment) && this.initiated) {
                this.generateMonthList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "dateFilter", {
        get: function () {
            return this._dateFilter;
        },
        set: function (filter) {
            this._dateFilter = filter;
            if (this.initiated) {
                this.generateMonthList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._minDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateMonthList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._maxDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateMonthList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "months", {
        get: function () {
            return this._months;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "activeCell", {
        get: function () {
            if (this._pickerMoment) {
                return this.dateTimeAdapter.getMonth(this._pickerMoment);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "isInSingleMode", {
        get: function () {
            return this.selectMode === 'single';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "isInRangeMode", {
        get: function () {
            return this.selectMode === 'range' || this.selectMode === 'rangeFrom'
                || this.selectMode === 'rangeTo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlYearViewComponent.prototype, "owlDTCalendarView", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    OwlYearViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeSub = this.dateTimeAdapter.localeChanges.subscribe(function () {
            _this.generateMonthList();
            _this.cdRef.markForCheck();
        });
    };
    OwlYearViewComponent.prototype.ngAfterContentInit = function () {
        this.generateMonthList();
        this.initiated = true;
    };
    OwlYearViewComponent.prototype.ngOnDestroy = function () {
        this.localeSub.unsubscribe();
    };
    OwlYearViewComponent.prototype.monthSelected = function (month) {
        var firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        var daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(firstDateOfMonth);
        var selected = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, Math.min(daysInMonth, this.dateTimeAdapter.getDate(this.pickerMoment)), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
        this.selectedChange.emit(selected);
    };
    OwlYearViewComponent.prototype.handleCalendarKeydown = function (event) {
        var moment;
        switch (event.keyCode) {
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -3);
                this.pickerMomentChange.emit(moment);
                break;
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 3);
                this.pickerMomentChange.emit(moment);
                break;
            case HOME:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, -this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            case END:
                moment = this.dateTimeAdapter.addCalendarMonths(this.pickerMoment, 11 - this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_UP:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? -10 : -1);
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_DOWN:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? 10 : 1);
                this.pickerMomentChange.emit(moment);
                break;
            case ENTER:
                this.monthSelected(this.dateTimeAdapter.getMonth(this.pickerMoment));
                this.keyboardEnter.emit();
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    };
    OwlYearViewComponent.prototype.generateMonthList = function () {
        if (!this.pickerMoment) {
            return;
        }
        this.setSelectedMonths();
        this.todayMonth = this.getMonthInCurrentYear(this.dateTimeAdapter.now());
        this._months = [];
        for (var i = 0; i < MONTHS_PER_YEAR / MONTHS_PER_ROW; i++) {
            var row = [];
            for (var j = 0; j < MONTHS_PER_ROW; j++) {
                var month = j + i * MONTHS_PER_ROW;
                var monthCell = this.createMonthCell(month);
                row.push(monthCell);
            }
            this._months.push(row);
        }
        return;
    };
    OwlYearViewComponent.prototype.createMonthCell = function (month) {
        var startDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        var ariaLabel = this.dateTimeAdapter.format(startDateOfMonth, this.dateTimeFormats.monthYearA11yLabel);
        return new CalendarCell(month, this.monthNames[month], ariaLabel, this.isMonthEnabled(month));
    };
    OwlYearViewComponent.prototype.isMonthEnabled = function (month) {
        var firstDateOfMonth = this.dateTimeAdapter.createDate(this.dateTimeAdapter.getYear(this.pickerMoment), month, 1);
        for (var date = firstDateOfMonth; this.dateTimeAdapter.getMonth(date) === month; date = this.dateTimeAdapter.addCalendarDays(date, 1)) {
            if (!!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate || this.dateTimeAdapter.compare(date, this.minDate) >= 0) &&
                (!this.maxDate || this.dateTimeAdapter.compare(date, this.maxDate) <= 0)) {
                return true;
            }
        }
        return false;
    };
    OwlYearViewComponent.prototype.getMonthInCurrentYear = function (date) {
        if (this.getValidDate(date) && this.getValidDate(this._pickerMoment)) {
            var result = this.dateTimeAdapter.compareYear(date, this._pickerMoment);
            if (result < 0) {
                return -1;
            }
            else if (result > 0) {
                return 12;
            }
            else {
                return this.dateTimeAdapter.getMonth(date);
            }
        }
        else {
            return null;
        }
    };
    OwlYearViewComponent.prototype.setSelectedMonths = function () {
        this.selectedMonths = [];
        if (this.isInSingleMode && this.selected) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selected);
        }
        if (this.isInRangeMode && this.selecteds) {
            this.selectedMonths[0] = this.getMonthInCurrentYear(this.selecteds[0]);
            this.selectedMonths[1] = this.getMonthInCurrentYear(this.selecteds[1]);
        }
    };
    OwlYearViewComponent.prototype.hasSameYear = function (dateLeft, dateRight) {
        return !!(dateLeft && dateRight &&
            this.dateTimeAdapter.getYear(dateLeft) === this.dateTimeAdapter.getYear(dateRight));
    };
    OwlYearViewComponent.prototype.getValidDate = function (obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    };
    OwlYearViewComponent.prototype.focusActiveCell = function () {
        this.calendarBodyElm.focusActiveCell();
    };
    OwlYearViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'owl-date-time-year-view',
                    exportAs: 'owlMonthView',
                    template: "<table class=\"owl-dt-calendar-table\"><thead class=\"owl-dt-calendar-header\"><tr><th class=\"owl-dt-calendar-table-divider\" aria-hidden=\"true\" colspan=\"3\"></th></tr></thead><tbody owl-date-time-calendar-body role=\"grid\" [allowDisabledCellSelection]=\"true\" [rows]=\"months\" [numCols]=\"3\" [cellRatio]=\"3 / 7\" [activeCell]=\"activeCell\" [todayValue]=\"todayMonth\" [selectedValues]=\"selectedMonths\" [selectMode]=\"selectMode\" (keydown)=\"handleCalendarKeydown($event)\" (selectedValueChange)=\"monthSelected($event)\"></tbody></table>",
                    styles: [""],
                    preserveWhitespaces: false,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    OwlYearViewComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef, },
        { type: DateTimeAdapter, decorators: [{ type: Optional },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [OWL_DATE_TIME_FORMATS,] },] },
    ]; };
    OwlYearViewComponent.propDecorators = {
        "selectMode": [{ type: Input },],
        "selected": [{ type: Input },],
        "selecteds": [{ type: Input },],
        "pickerMoment": [{ type: Input },],
        "dateFilter": [{ type: Input },],
        "minDate": [{ type: Input },],
        "maxDate": [{ type: Input },],
        "selectedChange": [{ type: Output },],
        "pickerMomentChange": [{ type: Output },],
        "keyboardEnter": [{ type: Output },],
        "calendarBodyElm": [{ type: ViewChild, args: [OwlCalendarBodyComponent,] },],
        "owlDTCalendarView": [{ type: HostBinding, args: ['class.owl-dt-calendar-view',] },],
    };
    return OwlYearViewComponent;
}());
export { OwlYearViewComponent };
