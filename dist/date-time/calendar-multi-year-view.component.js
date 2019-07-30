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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Optional, Output, ViewChild } from '@angular/core';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { CalendarCell, OwlCalendarBodyComponent } from './calendar-body.component';
import { DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
export var YEARS_PER_ROW = 3;
export var YEAR_ROWS = 7;
var OwlMultiYearViewComponent = (function () {
    function OwlMultiYearViewComponent(cdRef, pickerIntl, dateTimeAdapter) {
        this.cdRef = cdRef;
        this.pickerIntl = pickerIntl;
        this.dateTimeAdapter = dateTimeAdapter;
        this._selectMode = 'single';
        this._selecteds = [];
        this.initiated = false;
        this.change = new EventEmitter();
        this.yearSelected = new EventEmitter();
        this.pickerMomentChange = new EventEmitter();
        this.keyboardEnter = new EventEmitter();
    }
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "selectMode", {
        get: function () {
            return this._selectMode;
        },
        set: function (val) {
            this._selectMode = val;
            if (this.initiated) {
                this.setSelectedYears();
                this.cdRef.markForCheck();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (value) {
            var oldSelected = this._selected;
            value = this.dateTimeAdapter.deserialize(value);
            this._selected = this.getValidDate(value);
            if (!this.dateTimeAdapter.isSameDay(oldSelected, this._selected)) {
                this.setSelectedYears();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "selecteds", {
        get: function () {
            return this._selecteds;
        },
        set: function (values) {
            var _this = this;
            this._selecteds = values.map(function (v) {
                v = _this.dateTimeAdapter.deserialize(v);
                return _this.getValidDate(v);
            });
            this.setSelectedYears();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "pickerMoment", {
        get: function () {
            return this._pickerMoment;
        },
        set: function (value) {
            var oldMoment = this._pickerMoment;
            value = this.dateTimeAdapter.deserialize(value);
            this._pickerMoment = this.getValidDate(value) || this.dateTimeAdapter.now();
            if (oldMoment && this._pickerMoment &&
                !this.isSameYearList(oldMoment, this._pickerMoment)) {
                this.generateYearList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "dateFilter", {
        get: function () {
            return this._dateFilter;
        },
        set: function (filter) {
            this._dateFilter = filter;
            if (this.initiated) {
                this.generateYearList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "minDate", {
        get: function () {
            return this._minDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._minDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateYearList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "maxDate", {
        get: function () {
            return this._maxDate;
        },
        set: function (value) {
            value = this.dateTimeAdapter.deserialize(value);
            this._maxDate = this.getValidDate(value);
            if (this.initiated) {
                this.generateYearList();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "todayYear", {
        get: function () {
            return this._todayYear;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "years", {
        get: function () {
            return this._years;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "selectedYears", {
        get: function () {
            return this._selectedYears;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "isInSingleMode", {
        get: function () {
            return this.selectMode === 'single';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "isInRangeMode", {
        get: function () {
            return this.selectMode === 'range' || this.selectMode === 'rangeFrom'
                || this.selectMode === 'rangeTo';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "activeCell", {
        get: function () {
            if (this._pickerMoment) {
                return this.dateTimeAdapter.getYear(this._pickerMoment) % (YEARS_PER_ROW * YEAR_ROWS);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "tableHeader", {
        get: function () {
            if (this._years && this._years.length > 0) {
                return this._years[0][0].displayValue + " ~ " + this._years[YEAR_ROWS - 1][YEARS_PER_ROW - 1].displayValue;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "prevButtonLabel", {
        get: function () {
            return this.pickerIntl.prevMultiYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "nextButtonLabel", {
        get: function () {
            return this.pickerIntl.nextMultiYearLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "owlDTCalendarView", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OwlMultiYearViewComponent.prototype, "owlDTCalendarMultiYearView", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    OwlMultiYearViewComponent.prototype.ngOnInit = function () {
    };
    OwlMultiYearViewComponent.prototype.ngAfterContentInit = function () {
        this._todayYear = this.dateTimeAdapter.getYear(this.dateTimeAdapter.now());
        this.generateYearList();
        this.initiated = true;
    };
    OwlMultiYearViewComponent.prototype.selectCalendarCell = function (cell) {
        this.selectYear(cell.value);
    };
    OwlMultiYearViewComponent.prototype.selectYear = function (year) {
        this.yearSelected.emit(this.dateTimeAdapter.createDate(year, 0, 1));
        var firstDateOfMonth = this.dateTimeAdapter.createDate(year, this.dateTimeAdapter.getMonth(this.pickerMoment), 1);
        var daysInMonth = this.dateTimeAdapter.getNumDaysInMonth(firstDateOfMonth);
        var selected = this.dateTimeAdapter.createDate(year, this.dateTimeAdapter.getMonth(this.pickerMoment), Math.min(daysInMonth, this.dateTimeAdapter.getDate(this.pickerMoment)), this.dateTimeAdapter.getHours(this.pickerMoment), this.dateTimeAdapter.getMinutes(this.pickerMoment), this.dateTimeAdapter.getSeconds(this.pickerMoment));
        this.change.emit(selected);
    };
    OwlMultiYearViewComponent.prototype.prevYearList = function (event) {
        this._pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, -1 * YEAR_ROWS * YEARS_PER_ROW);
        this.generateYearList();
        event.preventDefault();
    };
    OwlMultiYearViewComponent.prototype.nextYearList = function (event) {
        this._pickerMoment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, YEAR_ROWS * YEARS_PER_ROW);
        this.generateYearList();
        event.preventDefault();
    };
    OwlMultiYearViewComponent.prototype.generateYearList = function () {
        this._years = [];
        var pickerMomentYear = this.dateTimeAdapter.getYear(this._pickerMoment);
        var offset = pickerMomentYear % (YEARS_PER_ROW * YEAR_ROWS);
        for (var i = 0; i < YEAR_ROWS; i++) {
            var row = [];
            for (var j = 0; j < YEARS_PER_ROW; j++) {
                var year = pickerMomentYear - offset + (j + i * YEARS_PER_ROW);
                var yearCell = this.createYearCell(year);
                row.push(yearCell);
            }
            this._years.push(row);
        }
        return;
    };
    OwlMultiYearViewComponent.prototype.previousEnabled = function () {
        if (!this.minDate) {
            return true;
        }
        return !this.minDate || !this.isSameYearList(this._pickerMoment, this.minDate);
    };
    OwlMultiYearViewComponent.prototype.nextEnabled = function () {
        return !this.maxDate || !this.isSameYearList(this._pickerMoment, this.maxDate);
    };
    OwlMultiYearViewComponent.prototype.handleCalendarKeydown = function (event) {
        var moment;
        switch (event.keyCode) {
            case LEFT_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -1);
                this.pickerMomentChange.emit(moment);
                break;
            case RIGHT_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, 1);
                this.pickerMomentChange.emit(moment);
                break;
            case UP_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -1 * YEARS_PER_ROW);
                this.pickerMomentChange.emit(moment);
                break;
            case DOWN_ARROW:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, YEARS_PER_ROW);
                this.pickerMomentChange.emit(moment);
                break;
            case HOME:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, -this.dateTimeAdapter.getYear(this._pickerMoment) % (YEARS_PER_ROW * YEAR_ROWS));
                this.pickerMomentChange.emit(moment);
                break;
            case END:
                moment = this.dateTimeAdapter.addCalendarYears(this._pickerMoment, (YEARS_PER_ROW * YEAR_ROWS) - this.dateTimeAdapter.getYear(this._pickerMoment) % (YEARS_PER_ROW * YEAR_ROWS) - 1);
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_UP:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? -10 * (YEARS_PER_ROW * YEAR_ROWS) : -1 * (YEARS_PER_ROW * YEAR_ROWS));
                this.pickerMomentChange.emit(moment);
                break;
            case PAGE_DOWN:
                moment = this.dateTimeAdapter.addCalendarYears(this.pickerMoment, event.altKey ? 10 * (YEARS_PER_ROW * YEAR_ROWS) : (YEARS_PER_ROW * YEAR_ROWS));
                this.pickerMomentChange.emit(moment);
                break;
            case ENTER:
                this.selectYear(this.dateTimeAdapter.getYear(this._pickerMoment));
                this.keyboardEnter.emit();
                break;
            default:
                return;
        }
        this.focusActiveCell();
        event.preventDefault();
    };
    OwlMultiYearViewComponent.prototype.createYearCell = function (year) {
        var startDateOfYear = this.dateTimeAdapter.createDate(year, 0, 1);
        var ariaLabel = this.dateTimeAdapter.getYearName(startDateOfYear);
        var cellClass = 'owl-dt-year-' + year;
        return new CalendarCell(year, year.toString(), ariaLabel, this.isYearEnabled(year), false, cellClass);
    };
    OwlMultiYearViewComponent.prototype.setSelectedYears = function () {
        var _this = this;
        this._selectedYears = [];
        if (this.isInSingleMode && this.selected) {
            this._selectedYears[0] = this.dateTimeAdapter.getYear(this.selected);
        }
        if (this.isInRangeMode && this.selecteds) {
            this._selectedYears = this.selecteds.map(function (selected) {
                if (_this.dateTimeAdapter.isValid(selected)) {
                    return _this.dateTimeAdapter.getYear(selected);
                }
                else {
                    return null;
                }
            });
        }
    };
    OwlMultiYearViewComponent.prototype.isYearEnabled = function (year) {
        if (year === undefined || year === null ||
            (this.maxDate && year > this.dateTimeAdapter.getYear(this.maxDate)) ||
            (this.minDate && year < this.dateTimeAdapter.getYear(this.minDate))) {
            return false;
        }
        if (!this.dateFilter) {
            return true;
        }
        var firstOfYear = this.dateTimeAdapter.createDate(year, 0, 1);
        for (var date = firstOfYear; this.dateTimeAdapter.getYear(date) == year; date = this.dateTimeAdapter.addCalendarDays(date, 1)) {
            if (this.dateFilter(date)) {
                return true;
            }
        }
        return false;
    };
    OwlMultiYearViewComponent.prototype.isSameYearList = function (date1, date2) {
        return Math.floor(this.dateTimeAdapter.getYear(date1) / (YEARS_PER_ROW * YEAR_ROWS)) ===
            Math.floor(this.dateTimeAdapter.getYear(date2) / (YEARS_PER_ROW * YEAR_ROWS));
    };
    OwlMultiYearViewComponent.prototype.getValidDate = function (obj) {
        return (this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)) ? obj : null;
    };
    OwlMultiYearViewComponent.prototype.focusActiveCell = function () {
        this.calendarBodyElm.focusActiveCell();
    };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], OwlMultiYearViewComponent.prototype, "selectMode", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], OwlMultiYearViewComponent.prototype, "selected", null);
    __decorate([
        Input(),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], OwlMultiYearViewComponent.prototype, "selecteds", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], OwlMultiYearViewComponent.prototype, "pickerMoment", null);
    __decorate([
        Input(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function])
    ], OwlMultiYearViewComponent.prototype, "dateFilter", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], OwlMultiYearViewComponent.prototype, "minDate", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], OwlMultiYearViewComponent.prototype, "maxDate", null);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], OwlMultiYearViewComponent.prototype, "change", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], OwlMultiYearViewComponent.prototype, "yearSelected", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], OwlMultiYearViewComponent.prototype, "pickerMomentChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], OwlMultiYearViewComponent.prototype, "keyboardEnter", void 0);
    __decorate([
        ViewChild(OwlCalendarBodyComponent),
        __metadata("design:type", OwlCalendarBodyComponent)
    ], OwlMultiYearViewComponent.prototype, "calendarBodyElm", void 0);
    __decorate([
        HostBinding('class.owl-dt-calendar-view'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], OwlMultiYearViewComponent.prototype, "owlDTCalendarView", null);
    __decorate([
        HostBinding('class.owl-dt-calendar-multi-year-view'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [])
    ], OwlMultiYearViewComponent.prototype, "owlDTCalendarMultiYearView", null);
    OwlMultiYearViewComponent = __decorate([
        Component({
            selector: 'owl-date-time-multi-year-view',
            template: "<button class=\"owl-dt-control-button owl-dt-control-arrow-button\" [disabled]=\"!previousEnabled()\" [attr.aria-label]=\"prevButtonLabel\" type=\"button\" tabindex=\"0\" (click)=\"prevYearList($event)\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\"><!-- <editor-fold desc=\"SVG Arrow Left\"> --> <svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\" width=\"100%\" height=\"100%\"><path style=\"fill-rule: evenodd; clip-rule: evenodd;\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546   c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681   l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/></svg><!-- </editor-fold> --></span></button><table class=\"owl-dt-calendar-table owl-dt-calendar-multi-year-table\"><thead class=\"owl-dt-calendar-header\"><tr><th colspan=\"3\">{{tableHeader}}</th></tr></thead><tbody owl-date-time-calendar-body role=\"grid\" [rows]=\"years\" [numCols]=\"3\" [cellRatio]=\"3 / 7\" [activeCell]=\"activeCell\" [todayValue]=\"todayYear\" [selectedValues]=\"selectedYears\" [selectMode]=\"selectMode\" (keydown)=\"handleCalendarKeydown($event)\" (select)=\"selectCalendarCell($event)\"></tbody></table><button class=\"owl-dt-control-button owl-dt-control-arrow-button\" [disabled]=\"!nextEnabled()\" [attr.aria-label]=\"nextButtonLabel\" type=\"button\" tabindex=\"0\" (click)=\"nextYearList($event)\"><span class=\"owl-dt-control-button-content\" tabindex=\"-1\"><!-- <editor-fold desc=\"SVG Arrow Right\"> --> <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738;\" xml:space=\"preserve\"><path style=\"fill-rule:evenodd;clip-rule:evenodd;\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n                c-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n                c7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n                C197.237,120.447,195.534,115.448,191.75,111.689z\"/></svg><!-- </editor-fold> --></span></button>",
            styles: [""],
            preserveWhitespaces: false,
            changeDetection: ChangeDetectionStrategy.OnPush,
        }),
        __param(2, Optional()),
        __metadata("design:paramtypes", [ChangeDetectorRef,
            OwlDateTimeIntl,
            DateTimeAdapter])
    ], OwlMultiYearViewComponent);
    return OwlMultiYearViewComponent;
}());
export { OwlMultiYearViewComponent };
