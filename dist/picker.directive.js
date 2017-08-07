"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dialog_component_1 = require("./dialog.component");
var forms_1 = require("@angular/forms");
exports.PICKER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return DateTimePickerDirective; }),
    multi: true
};
var DateTimePickerDirective = (function () {
    function DateTimePickerDirective(vcRef, componentFactoryResolver, el) {
        this.vcRef = vcRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.el = el;
        this.onChange = new core_1.EventEmitter(true);
        this.onError = new core_1.EventEmitter(true);
        this.autoClose = false;
        this.locale = 'en';
        this.viewFormat = 'll';
        this.returnObject = 'js';
        this.mode = 'popup';
        this.hourTime = '24';
        this.minMoment = null;
        this.maxMoment = null;
        this.position = 'bottom';
        this.positionOffset = '0%';
        this.pickerType = 'both';
        this.showSeconds = false;
        this.onlyCurrentMonth = false;
        this.onModelChange = function () {
        };
        this.onModelTouched = function () {
        };
        this.created = false;
    }
    DateTimePickerDirective.prototype.ngOnChanges = function (changes) {
        if (changes['minMoment'] &&
            !changes['minMoment'].isFirstChange() ||
            changes['maxMoment'] &&
                !changes['maxMoment'].isFirstChange()) {
            this.dialog.resetMinMaxMoment(this.minMoment, this.maxMoment);
        }
    };
    DateTimePickerDirective.prototype.ngOnInit = function () {
        this.generateComponent();
        if (this.mode === 'inline') {
            this.openDialog();
        }
    };
    DateTimePickerDirective.prototype.ngOnDestroy = function () {
        this.dispose();
    };
    DateTimePickerDirective.prototype.writeValue = function (obj) {
        if (this.dialog) {
            this.dialog.setSelectedMoment(obj);
        }
    };
    DateTimePickerDirective.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    DateTimePickerDirective.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    DateTimePickerDirective.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
        if (this.dialog) {
            this.dialog.setPickerDisableStatus(isDisabled);
        }
    };
    DateTimePickerDirective.prototype.onClick = function () {
        if (!this.disabled) {
            this.openDialog();
        }
    };
    DateTimePickerDirective.prototype.momentChanged = function (value) {
        this.onModelChange(value);
        this.onModelTouched();
        this.onChange.emit(value);
    };
    DateTimePickerDirective.prototype.sendError = function (error) {
        this.onError.emit(error);
        return;
    };
    DateTimePickerDirective.prototype.dispose = function () {
        if (this.container) {
            this.container.destroy();
            this.container = null;
            return;
        }
        return;
    };
    DateTimePickerDirective.prototype.generateComponent = function () {
        if (!this.container) {
            this.created = true;
            var factory = this.componentFactoryResolver.resolveComponentFactory(dialog_component_1.DialogComponent);
            var injector = core_1.ReflectiveInjector.fromResolvedProviders([], this.vcRef.parentInjector);
            this.container = this.vcRef.createComponent(factory, 0, injector, []);
            this.container.instance.setDialog(this, this.el, this.autoClose, this.locale, this.viewFormat, this.returnObject, this.position, this.positionOffset, this.mode, this.hourTime, this.pickerType, this.showSeconds, this.onlyCurrentMonth, this.minMoment, this.maxMoment);
            this.dialog = this.container.instance;
        }
    };
    DateTimePickerDirective.prototype.openDialog = function () {
        if (this.dialog) {
            this.dialog.openDialog();
        }
    };
    return DateTimePickerDirective;
}());
DateTimePickerDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[dateTimePicker]',
                host: {
                    '(click)': 'onClick()',
                },
                providers: [exports.PICKER_VALUE_ACCESSOR],
            },] },
];
DateTimePickerDirective.ctorParameters = function () { return [
    { type: core_1.ViewContainerRef, },
    { type: core_1.ComponentFactoryResolver, },
    { type: core_1.ElementRef, },
]; };
DateTimePickerDirective.propDecorators = {
    'onChange': [{ type: core_1.Output, args: ['onChange',] },],
    'onError': [{ type: core_1.Output, args: ['onError',] },],
    'autoClose': [{ type: core_1.Input },],
    'disabled': [{ type: core_1.Input },],
    'locale': [{ type: core_1.Input },],
    'viewFormat': [{ type: core_1.Input },],
    'returnObject': [{ type: core_1.Input },],
    'mode': [{ type: core_1.Input },],
    'hourTime': [{ type: core_1.Input },],
    'minMoment': [{ type: core_1.Input },],
    'maxMoment': [{ type: core_1.Input },],
    'position': [{ type: core_1.Input },],
    'positionOffset': [{ type: core_1.Input },],
    'pickerType': [{ type: core_1.Input },],
    'showSeconds': [{ type: core_1.Input },],
    'onlyCurrentMonth': [{ type: core_1.Input },],
};
exports.DateTimePickerDirective = DateTimePickerDirective;
//# sourceMappingURL=picker.directive.js.map
