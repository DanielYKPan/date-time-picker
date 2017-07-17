"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_service_1 = require("./picker.service");
var DialogComponent = (function () {
    function DialogComponent(el, service) {
        this.el = el;
        this.service = service;
        this.show = false;
    }
    DialogComponent.prototype.ngOnInit = function () {
        this.autoClose = this.service.dtAutoClose;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.dialogType = this.service.dtDialogType;
        this.now = this.service.now;
    };
    DialogComponent.prototype.ngOnDestroy = function () {
    };
    DialogComponent.prototype.openDialog = function () {
        this.show = true;
        return;
    };
    DialogComponent.prototype.setSelectedMoment = function (moment) {
        this.service.setMoment(moment);
    };
    DialogComponent.prototype.closeDialog = function () {
        this.show = false;
        return;
    };
    DialogComponent.prototype.setInitialMoment = function (value) {
        this.initialValue = value;
    };
    DialogComponent.prototype.setDialog = function (instance, elementRef, dtAutoClose, dtLocale, dtViewFormat, dtReturnObject, dtPosition, dtPositionOffset, dtMode, dtHourTime, dtPickerType, dtShowSeconds, dtOnlyCurrentMonth, dtMinMoment, dtMaxMoment) {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.service.setPickerOptions(dtAutoClose, dtLocale, dtViewFormat, dtReturnObject, dtPosition, dtPositionOffset, dtMode, dtHourTime, dtPickerType, dtShowSeconds, dtOnlyCurrentMonth, dtMinMoment, dtMaxMoment);
    };
    DialogComponent.prototype.confirmSelectedMoment = function () {
        this.returnSelectedMoment();
        this.closeDialog();
        return;
    };
    DialogComponent.prototype.toggleDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = this.service.dtDialogType;
        }
        else {
            this.dialogType = type;
        }
    };
    DialogComponent.prototype.setDate = function (moment) {
        if (this.service.dtDisabled) {
            return;
        }
        var done = this.service.setDate(moment);
        if (done) {
            if (this.autoClose || this.mode === 'inline') {
                this.confirmSelectedMoment();
                return;
            }
        }
        else {
            this.directiveInstance.sendError("The selected moment is invalid.");
        }
    };
    DialogComponent.prototype.setTime = function (time) {
        if (this.service.dtDisabled) {
            return;
        }
        var done = this.service.setTime(time.hour, time.min, time.sec, time.meridian);
        if (done) {
            if (this.service.dtPickerType === 'time' || this.mode === 'inline' || this.autoClose) {
                this.confirmSelectedMoment();
            }
            this.dialogType = this.service.dtDialogType;
            return;
        }
        else {
            this.directiveInstance.sendError("The selected moment is invalid.");
        }
    };
    DialogComponent.prototype.setPickerDisableStatus = function (isDisabled) {
        this.service.dtDisabled = isDisabled;
    };
    DialogComponent.prototype.resetMinMaxMoment = function (minString, maxString) {
        this.service.resetMinMaxMoment(minString, maxString);
    };
    DialogComponent.prototype.returnSelectedMoment = function () {
        var selectedM = this.service.parseToReturnObjectType();
        if (selectedM) {
            this.directiveInstance.momentChanged(selectedM);
        }
        return;
    };
    return DialogComponent;
}());
DialogComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'date-time-dialog',
                template: "<div class=\"owl-moment-overlay\" [ngClass]=\"{'owl-moment-overlay-dropdown': mode === 'dropdown'}\" *ngIf=\"(mode === 'popup' || mode === 'dropdown') && show\" (click)=\"closeDialog()\"></div><div class=\"owl-widget owl-moment-picker\" [ngClass]=\"{\n        'owl-picker-popup': mode === 'popup',\n        'owl-picker-dropdown': mode === 'dropdown',\n        'owl-picker-inline': mode === 'inline',\n        'small-mode': mode === 'dropdown' || mode === 'inline'}\" dialogPosition [directiveElementRef]=\"directiveElementRef\" [hidden]=\"!show && (mode === 'dropdown' || mode === 'popup')\"><div class=\"owl-moment-picker-box\"><dialog-picker-header [dialogType]=\"dialogType\" (onDialogTypeChange)=\"toggleDialogType($event)\"></dialog-picker-header><div class=\"owl-moment-picker-content\"><dialog-date-panel *ngIf=\"pickerType === 'both' || pickerType === 'date'\" [ngClass]=\"{'owl-picker-hidden': dialogType === 0}\" [dialogType]=\"dialogType\" (onDialogTypeChange)=\"toggleDialogType($event)\" (onSelected)=\"setDate($event)\" (onClosePicker)=\"closeDialog()\" (onConfirm)=\"confirmSelectedMoment($event)\"></dialog-date-panel><dialog-time-panel *ngIf=\"pickerType === 'both' || pickerType === 'time'\" [ngClass]=\"{'owl-picker-hidden': dialogType !== 0}\" (onSetTime)=\"setTime($event)\"></dialog-time-panel></div></div></div>",
                styles: [".owl-moment-overlay{position:fixed;top:0;left:0;right:0;bottom:0;display:block}.owl-picker-popup{position:fixed;top:0;left:50%;height:100%;overflow:hidden}@media only screen and (min-width:768px){.owl-picker-popup{top:30px;height:auto}}.owl-picker-dropdown{position:absolute}.owl-picker-inline{position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-block}.owl-moment-picker-box{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.owl-moment-picker-content{position:relative;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;width:100%;height:380px}.small-mode .owl-moment-picker-content{height:280px}.owl-moment-picker-content .owl-picker-hidden{display:none}"],
                providers: [picker_service_1.PickerService],
            },] },
];
DialogComponent.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: picker_service_1.PickerService, },
]; };
exports.DialogComponent = DialogComponent;
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Time"] = 0] = "Time";
    DialogType[DialogType["Date"] = 1] = "Date";
    DialogType[DialogType["Month"] = 2] = "Month";
    DialogType[DialogType["Year"] = 3] = "Year";
})(DialogType = exports.DialogType || (exports.DialogType = {}));
//# sourceMappingURL=dialog.component.js.map