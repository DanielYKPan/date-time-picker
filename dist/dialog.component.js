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
var DialogComponent = (function () {
    function DialogComponent(el) {
        this.el = el;
    }
    DialogComponent.prototype.ngOnInit = function () {
        this.openDialog(this.initialValue, false);
    };
    DialogComponent.prototype.openDialog = function (moment, emit) {
        var _this = this;
        if (emit === void 0) { emit = true; }
        this.show = true;
        if (this.dtMode === 'dropdown') {
            this.setDialogPosition();
            document.addEventListener('mousedown', function (event) {
                _this.onMouseDown(event);
            });
        }
        this.dialogType = this.dtDialogType;
        this.setInitialMoment(moment);
        this.setMomentFromString(moment, emit);
        return;
    };
    DialogComponent.prototype.cancelDialog = function () {
        var _this = this;
        this.show = false;
        if (this.dtMode === 'dropdown') {
            document.removeEventListener('mousedown', function (event) {
                _this.onMouseDown(event);
            });
        }
        return;
    };
    DialogComponent.prototype.setInitialMoment = function (value) {
        this.initialValue = value;
    };
    DialogComponent.prototype.setDialog = function (instance, elementRef, initialValue, dtLocale, dtViewFormat, dtReturnObject, dtDialogType, dtMode, dtPositionOffset) {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;
        this.dtLocale = dtLocale;
        this.dtViewFormat = dtViewFormat;
        this.dtReturnObject = dtReturnObject;
        this.dtMode = dtMode;
        this.dtPositionOffset = dtPositionOffset;
        if (dtDialogType === 'time') {
            this.dtDialogType = DialogType.Time;
        }
        else {
            this.dtDialogType = DialogType.Date;
        }
        moment.locale(this.dtLocale);
        this.now = moment();
    };
    DialogComponent.prototype.select = function (moment) {
        var m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        var daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
        var selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        return;
    };
    DialogComponent.prototype.confirm = function () {
        var m = this.selectedMoment ? this.selectedMoment.clone() : moment();
        var selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.cancelDialog();
    };
    DialogComponent.prototype.setTime = function (moment) {
        var m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        this.selectedMoment = m.hours(moment.hours()).minutes(moment.minutes());
        var selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.dialogType = this.dtDialogType;
    };
    DialogComponent.prototype.toggleDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
        }
        else {
            this.dialogType = type;
        }
    };
    DialogComponent.prototype.setMomentFromString = function (value, emit) {
        if (emit === void 0) { emit = true; }
        if (value) {
            this.moment = this.dtReturnObject === 'string' ? moment(value, this.dtViewFormat) :
                moment(value);
            this.selectedMoment = this.moment.clone();
        }
        else {
            this.moment = moment();
        }
    };
    DialogComponent.prototype.parseToReturnObjectType = function (day) {
        switch (this.dtReturnObject) {
            case 'js':
                return day.toDate();
            case 'string':
                return day.format(this.dtViewFormat);
            case 'moment':
                return day;
            case 'json':
                return day.toJSON();
            case 'array':
                return day.toArray();
            case 'iso':
                return day.toISOString();
            case 'object':
                return day.toObject();
            default:
                return day;
        }
    };
    DialogComponent.prototype.setDialogPosition = function () {
        var node = this.directiveElementRef.nativeElement;
        var position = 'static';
        var parentNode = null;
        var boxDirective;
        while (node !== null && node.tagName !== 'HTML') {
            position = window.getComputedStyle(node).getPropertyValue("position");
            if (position !== 'static' && parentNode === null) {
                parentNode = node;
            }
            if (position === 'fixed') {
                break;
            }
            node = node.parentNode;
        }
        if (position !== 'fixed') {
            boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
            if (parentNode === null) {
                parentNode = node;
            }
            var boxParent = this.createBox(parentNode, true);
            this.top = boxDirective.top - boxParent.top;
            this.left = boxDirective.left - boxParent.left;
        }
        else {
            boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
            this.top = boxDirective.top;
            this.left = boxDirective.left;
            this.position = 'fixed';
        }
        this.top += boxDirective.height + 3;
        this.left += parseInt(this.dtPositionOffset) / 100 * boxDirective.width;
        this.width = this.directiveElementRef.nativeElement.offsetWidth;
    };
    DialogComponent.prototype.createBox = function (element, offset) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    };
    DialogComponent.prototype.onMouseDown = function (event) {
        if ((!this.isDescendant(this.el.nativeElement, event.target)
            && event.target != this.directiveElementRef.nativeElement)) {
            this.show = false;
        }
    };
    DialogComponent.prototype.isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    return DialogComponent;
}());
DialogComponent = __decorate([
    core_1.Component({
        selector: 'date-time-dialog',
        template: "<picker-modal *ngIf=\"dtMode === 'popup' && show\" (onOverlayClick)=\"cancelDialog()\"><div class=\"picker-wrap\"><div class=\"picker-box\"><div class=\"picker-banner\"><div class=\"picker-banner-day\">{{ (selectedMoment? selectedMoment : now) | moment: 'dddd'}}</div><div class=\"picker-banner-moment\"><div class=\"moment-date\" (click)=\"toggleDialogType(1)\"><div class=\"big\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'Do'}}</span></div><div class=\"small\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'MMM'}}</span> <span>{{(selectedMoment? selectedMoment : now) | moment: 'YYYY'}}</span></div></div><div class=\"moment-time\" (click)=\"toggleDialogType(0)\"><div class=\"big\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'hh:mm'}}</span></div><div class=\"small\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'A'}}</span></div></div></div></div><div class=\"picker-content\"><dialog-date-panel [hidden]=\"dialogType === 0\" [moment]=\"moment\" [dialogType]=\"dialogType\" [now]=\"now\" [locale]=\"dtLocale\" [selectedMoment]=\"selectedMoment\" (onSelectDate)=\"select($event)\" (onCancelDialog)=\"cancelDialog()\" (onConfirm)=\"confirm()\"></dialog-date-panel><dialog-time-panel [hidden]=\"dialogType !== 0\" [moment]=\"moment\" [dialogType]=\"dialogType\" [now]=\"now\" (onSetTime)=\"setTime($event)\"></dialog-time-panel></div></div></div></picker-modal><div class=\"picker-dropdown\" *ngIf=\"dtMode === 'dropdown' && show\" [ngStyle]=\"{\n        'width.px': width,\n        'top.px': top,\n        'left.px': left,\n        'position': position\n     }\"><div class=\"picker-box\"><div class=\"picker-banner\"><div class=\"picker-banner-day\">{{ (selectedMoment? selectedMoment : now) | moment: 'dddd'}}</div><div class=\"picker-banner-moment\"><div class=\"moment-date\" (click)=\"toggleDialogType(1)\"><div class=\"big\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'Do'}}</span></div><div class=\"small\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'MMM'}}</span> <span>{{(selectedMoment? selectedMoment : now) | moment: 'YYYY'}}</span></div></div><div class=\"moment-time\" (click)=\"toggleDialogType(0)\"><div class=\"big\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'hh:mm'}}</span></div><div class=\"small\"><span>{{(selectedMoment? selectedMoment : now) | moment: 'A'}}</span></div></div></div></div><div class=\"picker-content\"><dialog-date-panel [hidden]=\"dialogType === 0\" [moment]=\"moment\" [dialogType]=\"dialogType\" [now]=\"now\" [locale]=\"dtLocale\" [selectedMoment]=\"selectedMoment\" (onSelectDate)=\"select($event)\" (onCancelDialog)=\"cancelDialog()\" (onConfirm)=\"confirm()\"></dialog-date-panel><dialog-time-panel [hidden]=\"dialogType !== 0\" [moment]=\"moment\" [dialogType]=\"dialogType\" [now]=\"now\" (onSetTime)=\"setTime($event)\"></dialog-time-panel></div></div></div>",
        styles: ["*,::after,::before{-moz-box-sizing:border-box;box-sizing:border-box}.picker-wrap{width:95vw;max-width:666px}.picker-dropdown{max-width:666px;min-width:333px;border:#777 solid 1px;position:absolute;z-index:1000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:#fff;margin-bottom:10px;margin-bottom:.625rem;-moz-border-radius:5px;border-radius:5px}.picker-box{font-family:'Open Sans';width:100%;padding:10px 16px;padding:.625rem 1rem;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker-banner{width:100%;background-color:#4285f4;color:#fff;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker-banner-day{padding:5px 0;text-align:center;background:rgba(0,0,0,.09)}.picker-banner-moment{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;width:100%}.picker-banner-moment .moment-date,.picker-banner-moment .moment-time{width:50%;padding:10px 8px;padding:.625rem .5rem;cursor:pointer}.picker-banner-moment .moment-date:hover,.picker-banner-moment .moment-time:hover{color:rgba(255,255,255,.65)}.picker-banner-moment .moment-date{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-webkit-justify-content:flex-end;-moz-box-pack:end;-ms-flex-pack:end;justify-content:flex-end}.picker-banner-moment .moment-date .big,.picker-banner-moment .moment-date .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.picker-banner-moment .moment-date .big{font-size:37.92px;font-size:2.37rem;line-height:40px;line-height:2.5rem}@media only screen and (min-width:768px){.picker-banner-moment .moment-date .big{font-size:3.16rem;line-height:3.75rem}}.picker-banner-moment .moment-date .small{-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-moz-box-orient:vertical;-moz-box-direction:normal;-ms-flex-direction:column;flex-direction:column;padding:0 8px;padding:0 .5rem}.picker-banner-moment .moment-time{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.picker-banner-moment .moment-time .big,.picker-banner-moment .moment-time .small{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.picker-banner-moment .moment-time .big{font-size:28.448px;font-size:1.778rem;line-height:40px;line-height:2.5rem}@media only screen and (min-width:768px){.picker-banner-moment .moment-time .big{font-size:2.37rem;line-height:2.5rem}}.picker-banner-moment .moment-time .small{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;padding:0 5px}.picker-content{width:100%;height:380px;height:23.75rem}.picker-footer{font-size:21.328px;font-size:1.333rem;line-height:40px;line-height:2.5rem;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;width:100%;height:80px;height:5rem;cursor:pointer}.picker-footer .picker-action{text-align:center;width:-webkit-calc(100% / 3);width:-moz-calc(100% / 3);width:calc(100% / 3)}.picker-footer .picker-action .text{padding-left:12.8px;padding-left:.8rem}.picker-footer .action-confirm{width:100%;color:#fff;background-color:#4285f4}.picker-footer .action-confirm:hover{background-color:#3461bd}.picker-footer .action-clear::before,.picker-footer .action-close::before,.picker-footer .action-confirm::before,.picker-footer .action-today::before{content:\" \";position:relative;display:inline-block;height:0;width:0}.picker-footer .action-today::before{border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker-footer .action-clear::before{top:-8px;top:-.5rem;width:16px;width:1rem;border-top:3px solid #e20}.picker-footer .action-close::before{width:16px;width:1rem;height:16px;height:1rem;background:-webkit-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-webkit-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:-moz-linear-gradient(top,transparent 35%,#777 35%,#777 65%,transparent 65%),-moz-linear-gradient(left,transparent 35%,#777 35%,#777 65%,transparent 65%);background:linear-gradient(to bottom,transparent 35%,#777 35%,#777 65%,transparent 65%),linear-gradient(to right,transparent 35%,#777 35%,#777 65%,transparent 65%);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}.picker-footer .action-confirm::before{width:16px;width:1rem;height:16px;height:1rem;-moz-border-radius:100%;border-radius:100%;background-color:#00b5ad}"],
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], DialogComponent);
exports.DialogComponent = DialogComponent;
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Time"] = 0] = "Time";
    DialogType[DialogType["Date"] = 1] = "Date";
    DialogType[DialogType["Month"] = 2] = "Month";
    DialogType[DialogType["Year"] = 3] = "Year";
})(DialogType = exports.DialogType || (exports.DialogType = {}));

//# sourceMappingURL=dialog.component.js.map
