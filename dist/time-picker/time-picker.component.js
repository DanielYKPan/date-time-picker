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
var moment = require('moment/moment');
var TimePickerComponent = (function () {
    function TimePickerComponent() {
        this.showSecond = true;
        this.viewFormat = 'hh:mm A';
        this.use12Hour = false;
        this.onSelectTime = new core_1.EventEmitter();
        this.onTimePickerCancel = new core_1.EventEmitter();
        this.hourFormat = 'HH';
    }
    TimePickerComponent.prototype.ngOnInit = function () {
        if (this.use12Hour)
            this.hourFormat = 'hh';
        this.time = this.initTime ? moment(this.initTime, this.viewFormat) : moment();
    };
    TimePickerComponent.prototype.increaseHour = function () {
        this.time = this.time.clone().add(1, 'h');
    };
    TimePickerComponent.prototype.decreaseHour = function () {
        this.time = this.time.clone().subtract(1, 'h');
    };
    TimePickerComponent.prototype.increaseMinute = function () {
        this.time = this.time.clone().add(1, 'm');
    };
    TimePickerComponent.prototype.decreaseMinute = function () {
        this.time = this.time.clone().subtract(1, 'm');
    };
    TimePickerComponent.prototype.increaseSecond = function () {
        this.time = this.time.clone().add(1, 's');
    };
    TimePickerComponent.prototype.decreaseSecond = function () {
        this.time = this.time.clone().subtract(1, 's');
    };
    TimePickerComponent.prototype.selectTime = function () {
        var selectTime = this.time.format(this.viewFormat);
        this.onSelectTime.emit(selectTime);
        this.cancelTimePicker();
        return;
    };
    TimePickerComponent.prototype.selectNow = function () {
        var selectTime = moment().format(this.viewFormat);
        this.onSelectTime.emit(selectTime);
        this.cancelTimePicker();
        return;
    };
    TimePickerComponent.prototype.clearTime = function () {
        this.onSelectTime.emit(null);
        this.cancelTimePicker();
        return;
    };
    TimePickerComponent.prototype.cancelTimePicker = function () {
        this.onTimePickerCancel.emit(false);
        return;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TimePickerComponent.prototype, "initTime", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TimePickerComponent.prototype, "showSecond", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TimePickerComponent.prototype, "viewFormat", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TimePickerComponent.prototype, "use12Hour", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TimePickerComponent.prototype, "onSelectTime", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], TimePickerComponent.prototype, "onTimePickerCancel", void 0);
    TimePickerComponent = __decorate([
        core_1.Component({
            selector: 'time-picker',
            template: "<picker-modal (onOverlayClick)=\"cancelTimePicker()\"><div class=\"picker-wrap\"><div class=\"picker-box\"><div class=\"picker-header\">Time Picker</div><div class=\"picker-table\"><ul class=\"picker-table-time\"><li class=\"picker-table-number\"><span class=\"arrow up\" (click)=\"increaseHour()\"></span> {{time | moment: hourFormat}} <span class=\"arrow down\" (click)=\"decreaseHour()\"></span></li><li class=\"picker-table-separator\">:</li><li class=\"picker-table-number\"><span class=\"arrow up\" (click)=\"increaseMinute()\"></span> {{time | moment: 'mm'}} <span class=\"arrow down\" (click)=\"decreaseMinute()\"></span></li><li *ngIf=\"showSecond\" class=\"picker-table-separator\">:</li><li *ngIf=\"showSecond\" class=\"picker-table-number\"><span class=\"arrow up\" (click)=\"increaseSecond()\"></span> {{time | moment: 'ss'}} <span class=\"arrow down\" (click)=\"decreaseSecond()\"></span></li><li *ngIf=\"use12Hour\" class=\"picker-table-meridiem\">{{time | moment: 'A'}}</li></ul></div><div class=\"picker-footer\"><div class=\"picker-action action-today\" (click)=\"selectNow()\"><span class=\"text\">Now</span></div><div class=\"picker-action action-confirm\" (click)=\"selectTime()\"><span class=\"text\">Confirm</span></div><div class=\"picker-action action-clear\" (click)=\"clearTime()\"><span class=\"text\">Clear</span></div><div class=\"picker-action action-close\" (click)=\"cancelTimePicker()\"><span class=\"text\">Close</span></div></div></div></div></picker-modal>",
            styles: [".picker-header,.picker-table-meridiem,.picker-table-number,.picker-table-separator{text-align:center}.picker-wrap{width:95vw;max-width:640px;max-width:40rem;font-family:'Open Sans'}.picker-box{width:100%;padding:10px 16px;padding:.625rem 1rem}.picker-footer,.picker-header{font-size:21.33px;font-size:1.333rem;line-height:40px;line-height:2.5rem;height:40px;height:2.5rem;width:100%}.picker-table{width:100%;margin:40px 0;margin:2.5rem 0}.picker-table-time{font-size:37.92px;font-size:2.37rem;line-height:40px;line-height:2.5rem;list-style:none;margin:0;padding:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker-table-meridiem,.picker-table-number{position:relative;width:20%}.arrow{position:absolute;left:50%;border:solid #777;border-width:0 3.2px 3.2px 0;border-width:0 .2rem .2rem 0;display:inline-block;padding:4px;padding:.25rem;cursor:pointer}.arrow.up{top:-16px;top:-1rem;-webkit-transform:translateX(-50%) rotate(-135deg);-moz-transform:translateX(-50%) rotate(-135deg);-ms-transform:translateX(-50%) rotate(-135deg);transform:translateX(-50%) rotate(-135deg)}.arrow.down{bottom:-16px;bottom:-1rem;-webkit-transform:translateX(-50%) rotate(45deg);-moz-transform:translateX(-50%) rotate(45deg);-ms-transform:translateX(-50%) rotate(45deg);transform:translateX(-50%) rotate(45deg)}.arrow:hover{border-color:#1975d2}.picker-table-separator{width:-webkit-calc(20% / 3);width:-moz-calc(20% / 3);width:calc(20% / 3)}.picker-footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;cursor:pointer}.picker-footer .picker-action{width:25%;text-align:center}.picker-footer .picker-action:hover{background-color:#b1dcfb}.picker-footer .picker-action .text{padding-left:12.8px;padding-left:.8rem}.picker-footer .action-clear::before,.picker-footer .action-close::before,.picker-footer .action-confirm::before,.picker-footer .action-today::before{content:\" \";position:relative;display:inline-block;height:0;width:0}.picker-footer .action-today::before{border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker-footer .action-confirm::before{width:16px;width:1rem;height:16px;height:1rem;-moz-border-radius:100%;border-radius:100%;background-color:#00B5AD}.picker-footer .action-clear::before{top:-8px;top:-.5rem;width:16px;width:1rem;border-top:3px solid #e20}.picker-footer .action-close::before{width:16px;width:1rem;height:16px;height:1rem;background:-webkit-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-webkit-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:-moz-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-moz-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:linear-gradient(to bottom,transparent 35%,#777 35%,#777 65%,transparent 65%),linear-gradient(to right,transparent 35%,#777 35%,#777 65%,transparent 65%);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}"],
        }), 
        __metadata('design:paramtypes', [])
    ], TimePickerComponent);
    return TimePickerComponent;
}());
exports.TimePickerComponent = TimePickerComponent;

//# sourceMappingURL=time-picker.component.js.map
