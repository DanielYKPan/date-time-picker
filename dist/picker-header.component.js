"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var PickerHeaderComponent = (function () {
    function PickerHeaderComponent(service) {
        this.service = service;
        this.onDialogTypeChange = new core_1.EventEmitter();
    }
    PickerHeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hourTime = this.service.dtHourTime;
        this.showSeconds = this.service.dtShowSeconds;
        this.pickerType = this.service.dtPickerType;
        this.mode = this.service.dtMode;
        this.now = this.service.now;
        this.subId = this.service.refreshCalendar.subscribe(function (data) { return _this.selectedMoment = data; });
    };
    PickerHeaderComponent.prototype.ngOnDestroy = function () {
        this.subId.unsubscribe();
    };
    PickerHeaderComponent.prototype.setDialogType = function (type) {
        this.onDialogTypeChange.emit(type);
    };
    return PickerHeaderComponent;
}());
PickerHeaderComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'dialog-picker-header',
                template: "<div class=\"owl-moment-picker-header\" [ngClass]=\"{'small-mode': mode === 'dropdown' || mode === 'inline'}\"><div class=\"owl-moment-picker-banner\"><div *ngIf=\"dialogType !== 0\">{{ (selectedMoment? selectedMoment : now) | moment: 'dddd'}}</div><div *ngIf=\"dialogType === 0\" class=\"svg-wrapper\"><!-- <editor-fold desc='clock svg'> --> <svg version=\"1.1\" class=\"owl-svg-icon-light\" id=\"clock-icon\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"100%\" height=\"100%\" viewBox=\"0 0 612 612\" style=\"enable-background:new 0 0 612 612\" xml:space=\"preserve\"><g><g id=\"Clock\"><g><path d=\"M444.193,276.387h-108.58V148.064c0-16.366-13.247-29.613-29.613-29.613s-29.613,13.247-29.613,29.613v187.549h167.806\n\t\t\t\tc16.347,0,29.613-13.247,29.613-29.613S460.54,276.387,444.193,276.387z M306,0C137.009,0,0,137.009,0,306s137.009,306,306,306\n\t\t\t\ts306-137.009,306-306S474.991,0,306,0z M306,552.774C169.919,552.774,59.226,442.081,59.226,306S169.919,59.226,306,59.226\n\t\t\t\tS552.774,169.919,552.774,306S442.081,552.774,306,552.774z\"/></g></g></g></svg><!-- </editor-fold> --></div></div><div class=\"owl-moment-picker-moment\"><div class=\"owl-moment-date\" *ngIf=\"pickerType === 'both' || pickerType === 'date'\" (click)=\"setDialogType(1)\"><div class=\"big\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'Do'}}</span></div><div class=\"small\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'MMM'}}</span> <span>{{(selectedMoment? selectedMoment : now) | moment: 'YYYY'}}</span></div></div><div class=\"owl-moment-time\" *ngIf=\"pickerType === 'both' || pickerType === 'time'\" (click)=\"setDialogType(0)\"><div class=\"big\"><span *ngIf=\"hourTime === '12' && showSeconds\">{{(selectedMoment? selectedMoment : now) | moment: 'hh:mm:ss'}}</span> <span *ngIf=\"hourTime === '12' && !showSeconds\">{{(selectedMoment? selectedMoment : now) | moment: 'hh:mm'}}</span> <span *ngIf=\"hourTime === '24' && showSeconds\">{{(selectedMoment? selectedMoment : now) | moment: 'HH:mm:ss'}}</span> <span *ngIf=\"hourTime === '24' && !showSeconds\">{{(selectedMoment? selectedMoment : now) | moment: 'HH:mm'}}</span></div><div class=\"small\" *ngIf=\"hourTime === '12'\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'A'}}</span></div></div></div></div>",
                styles: [".owl-moment-picker-header{width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.owl-moment-picker-banner{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;height:20px}.owl-moment-picker-banner .svg-wrapper{width:16px;height:16px}.owl-moment-picker-moment{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;min-height:40px;width:100%}.owl-moment-picker-moment .owl-moment-date,.owl-moment-picker-moment .owl-moment-time{padding:0 8px;padding:0 .5rem;cursor:pointer}.owl-moment-picker-moment .owl-moment-date:hover,.owl-moment-picker-moment .owl-moment-time:hover{color:rgba(255,255,255,.65)}.owl-moment-picker-moment .owl-moment-date{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:50%}@media only screen and (min-width:768px){.owl-moment-picker-moment .owl-moment-date{-webkit-box-pack:end;-webkit-justify-content:flex-end;-moz-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}}.owl-moment-picker-moment .owl-moment-date .big,.owl-moment-picker-moment .owl-moment-date .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.owl-moment-picker-moment .owl-moment-date .small{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;padding:4.8px 8px;padding:.3rem .5rem;font-weight:300}.owl-moment-picker-moment .owl-moment-time{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%}.small-mode .owl-moment-picker-moment .owl-moment-time{width:50%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}@media only screen and (max-width:480px){.owl-moment-picker-moment .owl-moment-time{width:50%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}}@media only screen and (min-width:768px){.owl-moment-picker-moment .owl-moment-time{width:50%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-moz-box-pack:start;-ms-flex-pack:start;justify-content:flex-start}}.owl-moment-picker-moment .owl-moment-time .big,.owl-moment-picker-moment .owl-moment-time .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}"],
            },] },
];
PickerHeaderComponent.ctorParameters = function () { return [
    { type: picker_service_1.PickerService, },
]; };
PickerHeaderComponent.propDecorators = {
    'dialogType': [{ type: core_1.Input },],
    'onDialogTypeChange': [{ type: core_1.Output },],
};
exports.PickerHeaderComponent = PickerHeaderComponent;
//# sourceMappingURL=picker-header.component.js.map