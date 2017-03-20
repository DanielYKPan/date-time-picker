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
var dialog_component_1 = require("./dialog.component");
var TimePanelComponent = (function () {
    function TimePanelComponent() {
        this.onSetTime = new core_1.EventEmitter();
    }
    TimePanelComponent.prototype.ngOnInit = function () {
        if (this.moment.hours() <= 11) {
            this.hourValue = this.moment.hours();
        }
        else if (this.moment.hours() > 12) {
            this.hourValue = this.moment.hours() - 12;
        }
        else if (this.moment.hours() === 0 || this.moment.hours() === 12) {
            this.hourValue = 12;
        }
        this.minValue = this.moment.minutes();
        this.meridianValue = this.moment.format('A');
    };
    TimePanelComponent.prototype.setMeridian = function (meridian) {
        this.meridianValue = meridian;
    };
    TimePanelComponent.prototype.setTime = function () {
        var selectedMoment = this.moment.clone();
        if (this.meridianValue === 'AM') {
            if (this.hourValue === 12) {
                selectedMoment.hours(0);
            }
            else {
                selectedMoment.hours(this.hourValue);
            }
        }
        else {
            if (this.hourValue === 12) {
                selectedMoment.hours(12);
            }
            else {
                selectedMoment.hours(this.hourValue + 12);
            }
        }
        selectedMoment.minutes(this.minValue);
        this.onSetTime.emit(selectedMoment);
    };
    return TimePanelComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TimePanelComponent.prototype, "moment", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TimePanelComponent.prototype, "now", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TimePanelComponent.prototype, "dialogType", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TimePanelComponent.prototype, "onSetTime", void 0);
TimePanelComponent = __decorate([
    core_1.Component({
        selector: 'dialog-time-panel',
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        template: "<div class=\"time-view\"><div class=\"time\">{{hourValue | numberFixedLen: 2}} : {{minValue | numberFixedLen: 2}}</div><div class=\"meridiem\"><div class=\"button-group\"><button class=\"button\" [class.active]=\"meridianValue === 'AM'\" (click)=\"setMeridian('AM')\">AM</button> <button class=\"button\" [class.active]=\"meridianValue === 'PM'\" (click)=\"setMeridian('PM')\">PM</button></div></div><div *ngIf=\"dialogType === 0\" class=\"time-control\"><div class=\"title\">Hours</div><app-slide-bar [floor]=\"1\" [ceiling]=\"12\" [(low)]=\"hourValue\"></app-slide-bar></div><div *ngIf=\"dialogType === 0\" class=\"time-control\"><div class=\"title\">Minutes</div><app-slide-bar [floor]=\"0\" [ceiling]=\"59\" [(low)]=\"minValue\"></app-slide-bar></div><div class=\"control\"><button class=\"button\" (click)=\"setTime()\">Set Time</button></div></div>",
        styles: [".time-view{width:100%}.time{font-size:37.92px;font-size:2.37rem;line-height:40px;line-height:2.5rem;text-align:center;padding:20px 0 0;padding:1.25rem 0 0;color:#4285f4}.title{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;width:80%;margin:10px auto;margin:.625rem auto}.meridiem{text-align:center}.meridiem .button-group{display:inline-block}.meridiem .button{border:1px solid #4285f4;background:#fff;-moz-border-radius:3px;border-radius:3px;float:left;margin:0;-webkit-box-align:initial;-webkit-align-items:initial;-moz-box-align:initial;-ms-flex-align:initial;align-items:initial;color:#4285f4;width:auto;padding:0 5px;cursor:pointer}.meridiem .button:first-child{-moz-border-radius-topright:0;border-top-right-radius:0;-moz-border-radius-bottomright:0;border-bottom-right-radius:0;border-right:0}.meridiem .button:last-child{-moz-border-radius-topleft:0;border-top-left-radius:0;-moz-border-radius-bottomleft:0;border-bottom-left-radius:0}.meridiem .button.active{background:#4285f4;color:#fff}.control{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;margin:40px 0;margin:2.5rem 0;text-align:center}.control .button{width:50%;background:#4285f4;color:#fff;margin:0 auto;border:1px solid #4285f4;-moz-border-radius:3px;border-radius:3px;cursor:pointer}.control .button:hover{background-color:#3461bd}"],
    }),
    __metadata("design:paramtypes", [])
], TimePanelComponent);
exports.TimePanelComponent = TimePanelComponent;

//# sourceMappingURL=time-panel.component.js.map
