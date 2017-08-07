"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment/moment");
var dialog_component_1 = require("./dialog.component");
var picker_service_1 = require("./picker.service");
var DatePanelComponent = (function () {
    function DatePanelComponent(service) {
        this.service = service;
        this.onDialogTypeChange = new core_1.EventEmitter();
        this.onClosePicker = new core_1.EventEmitter();
        this.onConfirm = new core_1.EventEmitter();
        this.onSelected = new core_1.EventEmitter();
        this.yearList = [];
        this.momentFunc = moment.default ? moment.default : moment;
    }
    DatePanelComponent.prototype.ngOnChanges = function (changes) {
        if (changes['dialogType']) {
            this.type = changes['dialogType'].currentValue;
        }
    };
    DatePanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.autoClose = this.service.dtAutoClose;
        this.locale = this.service.dtLocale;
        this.mode = this.service.dtMode;
        this.onlyCurrentMonth = this.service.dtOnlyCurrentMonth;
        this.momentFunc.locale(this.locale);
        this.dayNames = this.momentFunc.weekdaysShort(true);
        this.momentFunc.locale('en');
        this.monthList = this.momentFunc.localeData(this.service.dtLocale).monthsShort();
        this.now = this.service.now;
        this.setCalendarMoment();
        this.generateCalendar();
        this.subId = this.service.refreshCalendar.subscribe(function (data) {
            var done = _this.setCalendarMoment(data);
            if (done) {
                _this.generateCalendar();
            }
        });
    };
    DatePanelComponent.prototype.ngOnDestroy = function () {
        this.subId.unsubscribe();
    };
    DatePanelComponent.prototype.prevMonth = function () {
        if (this.service.dtDisabled) {
            return;
        }
        this.calendarMoment = this.calendarMoment.clone().subtract(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.nextMonth = function () {
        if (this.service.dtDisabled) {
            return;
        }
        this.calendarMoment = this.calendarMoment.clone().add(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.selectMonth = function (month) {
        if (this.service.dtDisabled) {
            return;
        }
        this.calendarMoment = this.calendarMoment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Month);
        return;
    };
    DatePanelComponent.prototype.selectYear = function (year) {
        if (this.service.dtDisabled) {
            return;
        }
        this.calendarMoment = this.calendarMoment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Year);
        return;
    };
    DatePanelComponent.prototype.toggleDialogType = function (type) {
        if (this.service.dtDisabled) {
            return;
        }
        this.onDialogTypeChange.emit(type);
        if (type === dialog_component_1.DialogType.Year) {
            this.generateYearList();
        }
        return;
    };
    DatePanelComponent.prototype.generateYearList = function (param) {
        var start;
        if (param === 'prev') {
            start = this.yearList[0] - 9;
        }
        else if (param === 'next') {
            start = this.yearList[8] + 1;
        }
        else {
            start = +this.calendarMoment.clone().subtract(4, 'y').format('YYYY');
        }
        for (var i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    };
    DatePanelComponent.prototype.select = function (moment) {
        if (!moment || this.service.dtDisabled) {
            return;
        }
        this.onSelected.emit(moment);
    };
    DatePanelComponent.prototype.confirm = function () {
        if (this.service.dtDisabled) {
            return;
        }
        this.onConfirm.emit(true);
        return;
    };
    DatePanelComponent.prototype.closePicker = function () {
        this.onClosePicker.emit(true);
        return;
    };
    DatePanelComponent.prototype.setCalendarMoment = function (moment) {
        if (moment) {
            if (this.calendarMoment &&
                moment.year() === this.calendarMoment.year()
                && moment.month() === this.calendarMoment.month()) {
                return false;
            }
            else {
                this.calendarMoment = moment.clone();
                return true;
            }
        }
        else {
            this.calendarMoment = this.momentFunc();
            return true;
        }
    };
    DatePanelComponent.prototype.generateCalendar = function () {
        this.calendarDays = [];
        var start = 0 - (this.calendarMoment.clone().startOf('month').day() +
            (7 - this.momentFunc.localeData(this.service.dtLocale).firstDayOfWeek())) % 7;
        var end = 41 + start;
        for (var i = start; i <= end; i += 1) {
            var day = this.calendarMoment.clone().startOf('month').add(i, 'days');
            if (this.onlyCurrentMonth && !day.isSame(this.calendarMoment, 'month')) {
                day = null;
            }
            this.calendarDays.push(day);
        }
    };
    return DatePanelComponent;
}());
DatePanelComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'dialog-date-panel',
                template: "<div class=\"owl-date-panel\" [ngClass]=\"{\n    'small-mode': mode === 'dropdown' || mode === 'inline'}\"><div class=\"owl-date-panel-control\"><div class=\"owl-control-nav\"><span class=\"nav-prev\" (click)=\"prevMonth()\"></span></div><div class=\"owl-control-content\"><span class=\"month-control\" (click)=\"toggleDialogType(2)\">{{calendarMoment | moment: \"MMMM\"}}</span> <span class=\"year-control\" (click)=\"toggleDialogType(3)\">{{calendarMoment | moment: \"YYYY\"}}</span></div><div class=\"owl-control-nav\"><span class=\"nav-next\" (click)=\"nextMonth()\"></span></div></div><div class=\"owl-date-panel-calendar\"><div [hidden]=\"type !== 1\" class=\"date\"><div class=\"owl-date-panel-calendar-row\"><span class=\"owl-date-panel-weekday\" *ngFor=\"let day of dayNames\">{{ day }}</span></div><div class=\"owl-date-panel-calendar-row\"><div class=\"owl-date-panel-day\" (click)=\"select(day)\" *ngFor=\"let day of calendarDays\" pickerCalendarHighlight [day]=\"day\" [calendarMoment]=\"calendarMoment\"><span *ngIf=\"day\">{{ day | moment: 'D'}}</span></div></div></div><div [hidden]=\"type !== 2\" class=\"month\"><div class=\"owl-date-panel-calendar-row\"><span class=\"owl-date-panel-month\" *ngFor=\"let month of monthList\" (click)=\"selectMonth(month)\" pickerCalendarHighlight [month]=\"month\" [calendarMoment]=\"calendarMoment\">{{month}}</span></div></div><div [hidden]=\"type !== 3\" class=\"year\"><div class=\"owl-date-panel-calendar-row\"><span class=\"arrow-left\" (click)=\"generateYearList('prev')\"><!-- <editor-fold desc='arrow left svg'> --> <svg version=\"1.1\" id=\"arrow-left-svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738\" xml:space=\"preserve\"><g id=\"Rounded_Rectangle_33_copy_4_1_\"><path style=\"fill-rule:evenodd;clip-rule:evenodd\" d=\"M96.633,125.369l95.053-94.533c7.101-7.055,7.101-18.492,0-25.546\n            c-7.1-7.054-18.613-7.054-25.714,0L58.989,111.689c-3.784,3.759-5.487,8.759-5.238,13.68c-0.249,4.922,1.454,9.921,5.238,13.681\n            l106.983,106.398c7.101,7.055,18.613,7.055,25.714,0c7.101-7.054,7.101-18.491,0-25.544L96.633,125.369z\"/></g></svg><!-- </editor-fold> --> </span><span class=\"owl-date-panel-year\" *ngFor=\"let year of yearList\" (click)=\"selectYear(year)\" pickerCalendarHighlight [year]=\"year.toString()\" [calendarMoment]=\"calendarMoment\">{{year}} </span><span class=\"arrow-right\" (click)=\"generateYearList('next')\"><!-- <editor-fold desc='arrow right svg'> --> <svg version=\"1.1\" id=\"arrow-right-svg\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 250.738 250.738\" style=\"enable-background:new 0 0 250.738 250.738\" xml:space=\"preserve\"><g id=\"Rounded_Rectangle_33_copy_4\"><path style=\"fill-rule:evenodd;clip-rule:evenodd\" d=\"M191.75,111.689L84.766,5.291c-7.1-7.055-18.613-7.055-25.713,0\n\t\tc-7.101,7.054-7.101,18.49,0,25.544l95.053,94.534l-95.053,94.533c-7.101,7.054-7.101,18.491,0,25.545\n\t\tc7.1,7.054,18.613,7.054,25.713,0L191.75,139.05c3.784-3.759,5.487-8.759,5.238-13.681\n\t\tC197.237,120.447,195.534,115.448,191.75,111.689z\"/></g></svg><!-- </editor-fold> --></span></div></div></div><div class=\"owl-foot-control\" *ngIf=\"!autoClose && mode !== 'inline'\"><div class=\"control-btn\" (click)=\"confirm()\"><!-- <editor-fold desc='confirm svg'> --> <svg version=\"1.1\" id=\"confirm-icon\" class=\"owl-svg-icon\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 490.4 490.4\" style=\"enable-background:new 0 0 490.4 490.4\" xml:space=\"preserve\"><g><g><path d=\"M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5\n\t\t\tc121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z\"/><path d=\"M206.5,349.6c2.3,2.3,5.4,3.6,8.7,3.6l0,0c3.2,0,6.3-1.3,8.6-3.6l147.5-146.7c2.3-2.3,3.6-5.4,3.6-8.7\n\t\t\tc0-3.2-1.3-6.4-3.6-8.7l-44.6-44.8c-4.8-4.8-12.5-4.8-17.3-0.1l-94,93.5l-34.2-34.4c-2.3-2.3-5.4-3.6-8.7-3.6l0,0\n\t\t\tc-3.2,0-6.3,1.3-8.6,3.6l-44.8,44.6c-2.3,2.3-3.6,5.4-3.6,8.7c0,3.2,1.3,6.4,3.6,8.7L206.5,349.6z M172.5,225.7l34.3,34.5\n\t\t\tc4.8,4.8,12.5,4.8,17.3,0.1l94-93.5l27.3,27.4L215.3,323.6L145.1,253L172.5,225.7z\"/></g></g></svg><!-- </editor-fold> --></div><div class=\"control-btn\" (click)=\"closePicker()\"><!-- <editor-fold desc='close svg'> --> <svg version=\"1.1\" id=\"close-icon\" class=\"owl-svg-icon\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 490.4 490.4\" style=\"enable-background:new 0 0 490.4 490.4\" xml:space=\"preserve\"><g><g><path d=\"M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5\n\t\t\tc121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z\"/><path d=\"M180.3,310.1c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l47.6-47.6l47.6,47.6c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6\n\t\t\tc4.8-4.8,4.8-12.5,0-17.3l-47.8-47.6l47.6-47.6c4.8-4.8,4.8-12.5,0-17.3s-12.5-4.8-17.3,0l-47.6,47.6l-47.6-47.6\n\t\t\tc-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l47.6,47.6l-47.6,47.6C175.5,297.6,175.5,305.3,180.3,310.1z\"/></g></g></svg><!-- </editor-fold> --></div></div></div>",
                styles: [".owl-date-panel{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%}.owl-date-panel-control{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;height:40px;width:100%}.owl-foot-control{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;height:40px;width:100%}.owl-foot-control .control-btn{width:30px;height:30px;cursor:pointer;-moz-border-radius:100%;border-radius:100%}.owl-foot-control .control-btn svg{-moz-border-radius:100%;border-radius:100%}.owl-control-nav{position:relative;cursor:pointer;width:12.5%}.owl-control-content{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:75%;text-align:center}.owl-date-panel-calendar{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%}.owl-date-panel-calendar .owl-date-panel-month,.owl-date-panel-calendar .owl-date-panel-year{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:relative;cursor:pointer;width:33%}.owl-date-panel-calendar .owl-date-panel-day{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;position:relative}.owl-date-panel-calendar-row{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;width:95%;margin:0 auto;position:relative}.year .owl-date-panel-calendar-row{width:85%}.month .owl-date-panel-calendar-row{width:90%}.owl-date-panel-calendar-row .arrow-left,.owl-date-panel-calendar-row .arrow-right{position:absolute;top:50%;width:25px;height:25px;-webkit-transform:translateY(-50%) scale(1);-moz-transform:translateY(-50%) scale(1);-ms-transform:translateY(-50%) scale(1);transform:translateY(-50%) scale(1);-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease;z-index:9999;cursor:pointer;-moz-background-size:contain;background-size:contain}.small-mode .owl-date-panel-calendar-row .arrow-left,.small-mode .owl-date-panel-calendar-row .arrow-right{width:16px;height:16px}@media only screen and (max-width:480px){.owl-date-panel-calendar-row .arrow-left,.owl-date-panel-calendar-row .arrow-right{width:16px;height:16px}}.owl-date-panel-calendar-row .arrow-left:hover,.owl-date-panel-calendar-row .arrow-right:hover{-webkit-transform:translateY(-50%) scale(1.5);-moz-transform:translateY(-50%) scale(1.5);-ms-transform:translateY(-50%) scale(1.5);transform:translateY(-50%) scale(1.5)}.owl-date-panel-calendar-row .arrow-left{left:-8%}.owl-date-panel-calendar-row .arrow-right{right:-8%}"],
            },] },
];
DatePanelComponent.ctorParameters = function () { return [
    { type: picker_service_1.PickerService, },
]; };
DatePanelComponent.propDecorators = {
    'dialogType': [{ type: core_1.Input },],
    'onDialogTypeChange': [{ type: core_1.Output },],
    'onClosePicker': [{ type: core_1.Output },],
    'onConfirm': [{ type: core_1.Output },],
    'onSelected': [{ type: core_1.Output },],
};
exports.DatePanelComponent = DatePanelComponent;
//# sourceMappingURL=date-panel.component.js.map