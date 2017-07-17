"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var HighlightCalendarDirective = (function () {
    function HighlightCalendarDirective(el, renderer, service) {
        this.el = el;
        this.renderer = renderer;
        this.service = service;
    }
    HighlightCalendarDirective.prototype.ngOnChanges = function (changes) {
        if (changes['day'] && changes['day'].currentValue) {
            this.renderer.addClass(this.el.nativeElement, 'day-show');
            this.highlightInvalidDays();
            if (this.isToday(this.day)) {
                this.renderer.addClass(this.el.nativeElement, 'day-today');
            }
            if (this.isOutFocus()) {
                this.renderer.addClass(this.el.nativeElement, 'out-focus');
            }
        }
        if (this.month && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarMonth()) {
                this.renderer.addClass(this.el.nativeElement, 'selected');
            }
            else {
                this.renderer.removeClass(this.el.nativeElement, 'selected');
            }
        }
        if (this.year && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarYear()) {
                this.renderer.addClass(this.el.nativeElement, 'selected');
            }
            else {
                this.renderer.removeClass(this.el.nativeElement, 'selected');
            }
        }
    };
    HighlightCalendarDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.subId = this.service.refreshCalendar.subscribe(function (data) {
            _this.selectedMoment = data;
            _this.highlightSelectedDay();
            _this.highlightInvalidDays();
        });
    };
    HighlightCalendarDirective.prototype.ngOnDestroy = function () {
        this.subId.unsubscribe();
    };
    HighlightCalendarDirective.prototype.isCalendarMonth = function () {
        return this.month && this.calendarMoment &&
            this.month === this.calendarMoment.locale(this.service.dtLocale).format('MMM');
    };
    HighlightCalendarDirective.prototype.isCalendarYear = function () {
        return this.year && this.calendarMoment && this.year === this.calendarMoment.format('YYYY');
    };
    HighlightCalendarDirective.prototype.isOutFocus = function () {
        return this.day && this.calendarMoment && !this.day.isSame(this.calendarMoment, 'month');
    };
    HighlightCalendarDirective.prototype.isToday = function (day) {
        return this.service.isTheSameDay(day, this.service.now);
    };
    HighlightCalendarDirective.prototype.highlightSelectedDay = function () {
        if (this.selectedElm) {
            this.renderer.removeClass(this.selectedElm.nativeElement, 'selected');
            this.selectedElm = null;
        }
        if (this.service.isTheSameDay(this.day, this.selectedMoment)) {
            this.renderer.addClass(this.el.nativeElement, 'selected');
            this.selectedElm = this.el;
        }
    };
    HighlightCalendarDirective.prototype.highlightInvalidDays = function () {
        this.renderer.removeClass(this.el.nativeElement, 'day-invalid');
        if (!this.service.isValidDate(this.day)) {
            this.renderer.addClass(this.el.nativeElement, 'day-invalid');
        }
    };
    return HighlightCalendarDirective;
}());
HighlightCalendarDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[pickerCalendarHighlight]'
            },] },
];
HighlightCalendarDirective.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.Renderer2, },
    { type: picker_service_1.PickerService, },
]; };
HighlightCalendarDirective.propDecorators = {
    'day': [{ type: core_1.Input },],
    'month': [{ type: core_1.Input },],
    'year': [{ type: core_1.Input },],
    'calendarMoment': [{ type: core_1.Input },],
};
exports.HighlightCalendarDirective = HighlightCalendarDirective;
//# sourceMappingURL=highlight-calendar.directive.js.map