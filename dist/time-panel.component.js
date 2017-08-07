"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var TimePanelComponent = (function () {
    function TimePanelComponent(service) {
        this.service = service;
        this.onSetTime = new core_1.EventEmitter();
        this.hourFloor = 1;
        this.hourCeiling = 12;
    }
    TimePanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hourTime = this.service.dtHourTime;
        this.showSeconds = this.service.dtShowSeconds;
        this.setTimePickerTimeValue(this.service.selectedMoment);
        this.subId = this.service.refreshCalendar.subscribe(function (data) {
            _this.setTimePickerTimeValue(data);
        });
    };
    TimePanelComponent.prototype.ngOnDestroy = function () {
        this.subId.unsubscribe();
    };
    TimePanelComponent.prototype.setMeridian = function (meridian) {
        if (this.service.dtDisabled) {
            return;
        }
        this.meridianValue = meridian;
    };
    TimePanelComponent.prototype.setTime = function () {
        if (this.service.dtDisabled) {
            return;
        }
        this.onSetTime.emit({
            hour: this.hourValue,
            min: this.minValue,
            sec: this.secValue,
            meridian: this.meridianValue
        });
    };
    TimePanelComponent.prototype.setTimePickerTimeValue = function (moment) {
        if (moment) {
            this.timeSliderMoment = moment.clone();
        }
        else {
            this.timeSliderMoment = this.service.now;
        }
        if (this.hourTime === '12') {
            if (this.timeSliderMoment.hours() <= 11) {
                this.hourValue = this.timeSliderMoment.hours();
            }
            else if (this.timeSliderMoment.hours() > 12) {
                this.hourValue = this.timeSliderMoment.hours() - 12;
            }
            else if (this.timeSliderMoment.hours() === 0 || this.timeSliderMoment.hours() === 12) {
                this.hourValue = 12;
            }
        }
        if (this.hourTime === '24') {
            this.hourValue = this.timeSliderMoment.hours();
            this.hourFloor = 0;
            this.hourCeiling = 23;
        }
        this.minValue = this.timeSliderMoment.minutes();
        this.secValue = this.timeSliderMoment.seconds();
        this.meridianValue = this.timeSliderMoment.clone().locale('en').format('A');
    };
    return TimePanelComponent;
}());
TimePanelComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'dialog-time-panel',
                template: "<div class=\"owl-time-panel\"><div class=\"owl-time-panel-inform\"><div class=\"time-inform\" *ngIf=\"showSeconds\">{{hourValue | numberFixedLen: 2}} : {{minValue | numberFixedLen: 2}} : {{(secValue | numberFixedLen: 2)}}</div><div class=\"time-inform\" *ngIf=\"!showSeconds\">{{hourValue | numberFixedLen: 2}} : {{minValue | numberFixedLen: 2}}</div><div class=\"time-inform meridiem-inform\" *ngIf=\"hourTime === '12'\"><div class=\"meridiem-button-group\"><button class=\"meridiem-button\" type=\"button\" [ngClass]=\"{'meridiem-button-on': meridianValue === 'AM'}\" (click)=\"setMeridian('AM')\">AM</button> <button class=\"meridiem-button\" type=\"button\" [ngClass]=\"{'meridiem-button-on': meridianValue === 'PM'}\" (click)=\"setMeridian('PM')\">PM</button></div></div></div><div class=\"owl-time-panel-sliders\"><div class=\"owl-time-panel-slider\"><app-slide-bar [(ngModel)]=\"hourValue\" [min]=\"hourFloor\" [max]=\"hourCeiling\" [style]=\"{height: '90%'}\"></app-slide-bar></div><div class=\"owl-time-panel-slider\"><app-slide-bar [(ngModel)]=\"minValue\" [min]=\"0\" [max]=\"59\" [style]=\"{height: '90%'}\"></app-slide-bar></div><div class=\"owl-time-panel-slider\" *ngIf=\"showSeconds\"><app-slide-bar [(ngModel)]=\"secValue\" [min]=\"0\" [max]=\"59\" [style]=\"{height: '90%'}\"></app-slide-bar></div></div><div class=\"control-btn\" (click)=\"setTime()\"><!-- <editor-fold desc='confirm svg'> --> <svg version=\"1.1\" id=\"confirm-icon\" class=\"owl-svg-icon\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 490.4 490.4\" style=\"enable-background:new 0 0 490.4 490.4\" xml:space=\"preserve\"><g><g><path d=\"M245.2,490.4c135.2,0,245.2-110,245.2-245.2S380.4,0,245.2,0S0,110,0,245.2S110,490.4,245.2,490.4z M245.2,24.5\n\t\t\tc121.7,0,220.7,99,220.7,220.7s-99,220.7-220.7,220.7s-220.7-99-220.7-220.7S123.5,24.5,245.2,24.5z\"/><path d=\"M206.5,349.6c2.3,2.3,5.4,3.6,8.7,3.6l0,0c3.2,0,6.3-1.3,8.6-3.6l147.5-146.7c2.3-2.3,3.6-5.4,3.6-8.7\n\t\t\tc0-3.2-1.3-6.4-3.6-8.7l-44.6-44.8c-4.8-4.8-12.5-4.8-17.3-0.1l-94,93.5l-34.2-34.4c-2.3-2.3-5.4-3.6-8.7-3.6l0,0\n\t\t\tc-3.2,0-6.3,1.3-8.6,3.6l-44.8,44.6c-2.3,2.3-3.6,5.4-3.6,8.7c0,3.2,1.3,6.4,3.6,8.7L206.5,349.6z M172.5,225.7l34.3,34.5\n\t\t\tc4.8,4.8,12.5,4.8,17.3,0.1l94-93.5l27.3,27.4L215.3,323.6L145.1,253L172.5,225.7z\"/></g></g></svg><!-- </editor-fold> --></div></div>",
                styles: [".owl-time-panel{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around;width:100%;height:100%}.owl-time-panel-inform{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center}.time-inform{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;width:60%}.meridiem-inform{width:40%}.meridiem-inform .meridiem-button-group{display:inline-block}.meridiem-inform .meridiem-button{float:left;margin:0;-webkit-box-align:initial;-webkit-align-items:initial;-moz-box-align:initial;-ms-flex-align:initial;align-items:initial;width:auto;padding:0 5px;cursor:pointer}.meridiem-inform .meridiem-button:first-child{-moz-border-radius-topright:0;border-top-right-radius:0;-moz-border-radius-bottomright:0;border-bottom-right-radius:0;border-right:0}.meridiem-inform .meridiem-button:last-child{-moz-border-radius-topleft:0;border-top-left-radius:0;-moz-border-radius-bottomleft:0;border-bottom-left-radius:0}.owl-time-panel-sliders{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;height:180px}.owl-time-panel-sliders .owl-time-panel-slider{margin:0 35px}.time-panel-confirm{margin:0 auto;cursor:pointer;text-align:center}.control-btn{width:30px;height:30px;cursor:pointer;-moz-border-radius:100%;border-radius:100%;margin:0 auto}.control-btn svg{-moz-border-radius:100%;border-radius:100%}"],
            },] },
];
TimePanelComponent.ctorParameters = function () { return [
    { type: picker_service_1.PickerService, },
]; };
TimePanelComponent.propDecorators = {
    'onSetTime': [{ type: core_1.Output },],
};
exports.TimePanelComponent = TimePanelComponent;
//# sourceMappingURL=time-panel.component.js.map