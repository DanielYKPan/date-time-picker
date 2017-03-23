"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var moment = require("moment/moment");
var dialog_component_1 = require("./dialog.component");
var DatePanelComponent = (function () {
    function DatePanelComponent() {
        this.onSelectDate = new core_1.EventEmitter();
        this.onCancelDialog = new core_1.EventEmitter();
        this.onConfirm = new core_1.EventEmitter();
        this.yearList = [];
    }
    DatePanelComponent.prototype.ngOnInit = function () {
        moment.locale(this.locale);
        this.dayNames = moment.weekdaysShort(true);
        this.monthList = moment.monthsShort();
        this.generateCalendar();
    };
    DatePanelComponent.prototype.ngOnChanges = function (changes) {
        if (changes['selectedMoment'] && !changes['selectedMoment'].isFirstChange() &&
            (this.selectedMoment.year() !== this.moment.year() ||
                this.selectedMoment.month() !== this.moment.month())) {
            this.moment = this.selectedMoment.clone();
            this.generateCalendar();
        }
    };
    DatePanelComponent.prototype.prevMonth = function () {
        this.moment = this.moment.clone().subtract(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.nextMonth = function () {
        this.moment = this.moment.clone().add(1, 'M');
        this.generateCalendar();
    };
    DatePanelComponent.prototype.selectMonth = function (month) {
        this.moment = this.moment.clone().month(month);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Month);
        return;
    };
    DatePanelComponent.prototype.selectYear = function (year) {
        this.moment = this.moment.clone().year(year);
        this.generateCalendar();
        this.toggleDialogType(dialog_component_1.DialogType.Year);
        return;
    };
    DatePanelComponent.prototype.toggleDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = dialog_component_1.DialogType.Date;
            return;
        }
        this.dialogType = type;
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
            start = +this.moment.clone().subtract(4, 'y').format('YYYY');
        }
        for (var i = 0; i < 9; i++) {
            this.yearList[i] = start + i;
        }
        return;
    };
    DatePanelComponent.prototype.select = function (moment) {
        if (this.selectedMoment &&
            this.selectedMoment.clone().startOf('date') === moment) {
            return;
        }
        this.onSelectDate.emit(moment);
    };
    DatePanelComponent.prototype.selectToday = function () {
        var moment = this.moment.clone()
            .year(this.now.year())
            .month(this.now.month())
            .dayOfYear(this.now.dayOfYear());
        this.onSelectDate.emit(moment);
    };
    DatePanelComponent.prototype.cancelDialog = function () {
        this.onCancelDialog.emit(true);
        return;
    };
    DatePanelComponent.prototype.confirm = function () {
        this.onConfirm.emit(true);
        return;
    };
    DatePanelComponent.prototype.generateCalendar = function () {
        this.calendarDays = [];
        var start = 0 - (this.moment.clone().startOf('month').day() + (7 - moment.localeData().firstDayOfWeek())) % 7;
        var end = 41 + start;
        for (var i = start; i <= end; i += 1) {
            var day = this.moment.clone().startOf('month').add(i, 'days');
            this.calendarDays.push(day);
        }
    };
    return DatePanelComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "moment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "now", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DatePanelComponent.prototype, "dialogType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DatePanelComponent.prototype, "locale", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "selectedMoment", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "onSelectDate", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "onCancelDialog", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DatePanelComponent.prototype, "onConfirm", void 0);
DatePanelComponent = __decorate([
    core_1.Component({
        selector: 'dialog-date-panel',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: "<div class=\"picker-control\"><div class=\"picker-control-nav\"><span class=\"nav-prev\" (click)=\"prevMonth()\"></span></div><div class=\"picker-control-content\"><div class=\"content\"><span class=\"month\" (click)=\"toggleDialogType(2)\">{{moment | moment: \"MMMM\"}}</span> <span class=\"year\" (click)=\"toggleDialogType(3)\">{{moment | moment: \"YYYY\"}}</span></div></div><div class=\"picker-control-nav\"><span class=\"nav-next\" (click)=\"nextMonth()\"></span></div></div><div class=\"picker-calendar\"><div [hidden]=\"dialogType !== 1\" class=\"date\"><div class=\"picker-calendar-row\"><span class=\"picker-weekday\" *ngFor=\"let day of dayNames\">{{ day }}</span></div><div class=\"picker-calendar-row\"><span class=\"picker-day\" (click)=\"select(day)\" [ngClass]=\"{\n                               'out-focus': day.month() != moment.month(),\n                               'today': day.isSame(now, 'day'),\n                               'selected': selectedMoment && day.isSame(selectedMoment, 'day')\n                              }\" *ngFor=\"let day of calendarDays\">{{ day | moment: 'D'}}</span></div></div><div [hidden]=\"dialogType !== 2\" class=\"month\"><div class=\"picker-calendar-row\"><span class=\"picker-month\" *ngFor=\"let month of monthList\" [class.selected]=\"month === (moment | moment: 'MMM')\" (click)=\"selectMonth(month)\">{{month}}</span></div></div><div [hidden]=\"dialogType !== 3\" class=\"year\"><div class=\"picker-calendar-row\"><span class=\"arrow-left\" (click)=\"generateYearList('prev')\"></span> <span class=\"picker-year\" *ngFor=\"let year of yearList\" [class.selected]=\"year.toString() === (moment | moment: 'YYYY')\" (click)=\"selectYear(year)\">{{year}} </span><span class=\"arrow-right\" (click)=\"generateYearList('next')\"></span></div></div></div><div class=\"picker-control footer\" [class.hidden]=\"dialogType !== 1\"><div class=\"picker-action action-today\" (click)=\"selectToday()\"><span class=\"text\">Today</span></div><div class=\"picker-action action-close\" (click)=\"cancelDialog()\"><span class=\"text\">Close</span></div><div class=\"picker-action action-confirm\" (click)=\"confirm()\"><span class=\"text\">Confirm</span></div></div>",
        styles: [":host{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;height:100%}:host.hidden{display:none}.picker-control{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;height:40px;height:2.5rem;width:100%}.picker-control.footer{-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;height:80px;height:5rem;background-color:#fff;cursor:pointer}.picker-control.footer.hidden{display:none}.picker-control.footer .picker-action{text-align:center;width:-webkit-calc(100% / 3);width:-moz-calc(100% / 3);width:calc(100% / 3)}.picker-control.footer .picker-action .text{padding-left:12.8px;padding-left:.8rem}.picker-control.footer .action-confirm{width:100%;color:#fff;background-color:#4285f4}.picker-control.footer .action-confirm:hover{background-color:#3461bd}.picker-control.footer .action-clear::before,.picker-control.footer .action-close::before,.picker-control.footer .action-confirm::before,.picker-control.footer .action-today::before{content:\" \";position:relative;display:inline-block;height:0;width:0}.picker-control.footer .action-today::before{border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker-control.footer .action-clear::before{top:-8px;top:-.5rem;width:16px;width:1rem;border-top:3px solid #e20}.picker-control.footer .action-close::before{width:16px;width:1rem;height:16px;height:1rem;background:-webkit-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-webkit-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:-moz-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-moz-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:linear-gradient(to bottom,transparent 35%,#777 35%,#777 65%,transparent 65%),linear-gradient(to right,transparent 35%,#777 35%,#777 65%,transparent 65%);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.picker-control.footer .action-confirm::before{width:16px;width:1rem;height:16px;height:1rem;-moz-border-radius:100%;border-radius:100%;background-color:#00b5ad}.picker-control-nav{position:relative;cursor:pointer;width:-webkit-calc(100% / 8);width:-moz-calc(100% / 8);width:calc(100% / 8)}.picker-control-nav>*{position:absolute;top:50%;right:auto;bottom:auto;left:50%;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.picker-control-nav .nav-next::before,.picker-control-nav .nav-prev::before{content:\" \";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #000;width:0;height:0;display:block;margin:0 auto}.picker-control-nav .nav-next::before{border-right:0;border-left:.75em solid #000}.picker-control-content{width:-webkit-calc(100% * 6 / 8);width:-moz-calc(100% * 6 / 8);width:calc(100% * 6 / 8);text-align:center}.picker-control-content .month,.picker-control-content .year{display:inline-block;cursor:pointer;-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease}.picker-control-content .month:hover,.picker-control-content .year:hover{-webkit-transform:scale(1.2);-moz-transform:scale(1.2);-ms-transform:scale(1.2);transform:scale(1.2)}.picker-control-content .month{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;margin-right:8px;margin-right:.5rem;font-weight:700}.picker-control-content .year{font-style:italic;color:#999}.picker-calendar{-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%}.picker-calendar .picker-calendar-row{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;width:100%;position:relative}.picker-calendar .picker-year{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;position:relative;height:40px;height:2.5rem;text-align:center;cursor:pointer;width:-webkit-calc(100% / 3);width:-moz-calc(100% / 3);width:calc(100% / 3)}.picker-calendar .picker-year:hover{background:#b1dcfb}.picker-calendar .picker-month{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;position:relative;height:40px;height:2.5rem;text-align:center;cursor:pointer;width:-webkit-calc(100% / 4);width:-moz-calc(100% / 4);width:calc(100% / 4)}.picker-calendar .picker-month:hover{background:#b1dcfb}.picker-calendar .picker-weekday{font-weight:700;text-align:left;color:#999;width:-webkit-calc(100% / 7);width:-moz-calc(100% / 7);width:calc(100% / 7);padding-left:10px}.picker-calendar .picker-day{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;position:relative;height:40px;height:2.5rem;text-align:center;cursor:pointer;width:-webkit-calc(100% / 7);width:-moz-calc(100% / 7);width:calc(100% / 7)}.picker-calendar .picker-day:hover{background:#b1dcfb}.picker-calendar .out-focus{color:#ddd}.picker-calendar .out-focus:hover{color:#000}.picker-calendar .selected{background:#0089ec;color:#fff}.picker-calendar .selected:hover{background:#0089ec}.picker-calendar .today::before{content:\" \";position:absolute;top:2px;right:2px;width:0;height:0;border-top:.5em solid #0059bc;border-left:.5em solid transparent}.picker-calendar .arrow-left,.picker-calendar .arrow-right{position:absolute;top:50%;width:16px;height:16px;-webkit-transform:translateY(-50%) scale(1);-moz-transform:translateY(-50%) scale(1);-ms-transform:translateY(-50%) scale(1);transform:translateY(-50%) scale(1);-webkit-transition:-webkit-transform .2s ease;transition:-webkit-transform .2s ease;-moz-transition:transform .2s ease,-moz-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease,-moz-transform .2s ease;z-index:9999;cursor:pointer;-moz-background-size:contain;background-size:contain}.picker-calendar .arrow-left:hover,.picker-calendar .arrow-right:hover{-webkit-transform:translateY(-50%) scale(1.5);-moz-transform:translateY(-50%) scale(1.5);-ms-transform:translateY(-50%) scale(1.5);transform:translateY(-50%) scale(1.5)}.picker-calendar .arrow-left{left:0;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC43MzggMjUwLjczOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnIGlkPSJSb3VuZGVkX1JlY3RhbmdsZV8zM19jb3B5XzRfMV8iPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTk2LjYzMywxMjUuMzY5bDk1LjA1My05NC41MzNjNy4xMDEtNy4wNTUsNy4xMDEtMTguNDkyLDAtMjUuNTQ2ICAgYy03LjEtNy4wNTQtMTguNjEzLTcuMDU0LTI1LjcxNCwwTDU4Ljk4OSwxMTEuNjg5Yy0zLjc4NCwzLjc1OS01LjQ4Nyw4Ljc1OS01LjIzOCwxMy42OGMtMC4yNDksNC45MjIsMS40NTQsOS45MjEsNS4yMzgsMTMuNjgxICAgbDEwNi45ODMsMTA2LjM5OGM3LjEwMSw3LjA1NSwxOC42MTMsNy4wNTUsMjUuNzE0LDBjNy4xMDEtNy4wNTQsNy4xMDEtMTguNDkxLDAtMjUuNTQ0TDk2LjYzMywxMjUuMzY5eiIgZmlsbD0iIzAwMDAwMCIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.picker-calendar .arrow-right{right:0;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI1MC43MzggMjUwLjczOCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjUwLjczOCAyNTAuNzM4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxnIGlkPSJSb3VuZGVkX1JlY3RhbmdsZV8zM19jb3B5XzQiPgoJPHBhdGggc3R5bGU9ImZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkOyIgZD0iTTE5MS43NSwxMTEuNjg5TDg0Ljc2Niw1LjI5MWMtNy4xLTcuMDU1LTE4LjYxMy03LjA1NS0yNS43MTMsMCAgIGMtNy4xMDEsNy4wNTQtNy4xMDEsMTguNDksMCwyNS41NDRsOTUuMDUzLDk0LjUzNGwtOTUuMDUzLDk0LjUzM2MtNy4xMDEsNy4wNTQtNy4xMDEsMTguNDkxLDAsMjUuNTQ1ICAgYzcuMSw3LjA1NCwxOC42MTMsNy4wNTQsMjUuNzEzLDBMMTkxLjc1LDEzOS4wNWMzLjc4NC0zLjc1OSw1LjQ4Ny04Ljc1OSw1LjIzOC0xMy42ODEgICBDMTk3LjIzNywxMjAuNDQ3LDE5NS41MzQsMTE1LjQ0OCwxOTEuNzUsMTExLjY4OXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K)}"],
    }),
    __metadata("design:paramtypes", [])
], DatePanelComponent);
exports.DatePanelComponent = DatePanelComponent;

//# sourceMappingURL=date-panel.component.js.map
