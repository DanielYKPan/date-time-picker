"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dynamic_module_1 = require("./dynamic.module");
var dialog_component_1 = require("./dialog.component");
var DateTimePickerDirective = (function () {
    function DateTimePickerDirective(compiler, vcRef, el) {
        this.compiler = compiler;
        this.vcRef = vcRef;
        this.el = el;
        this.dateTimePickerChange = new core_1.EventEmitter(true);
        this.locale = 'en';
        this.viewFormat = 'll';
        this.returnObject = 'js';
        this.mode = 'popup';
        this.hourTime = '24';
        this.theme = 'default';
        this.positionOffset = '0%';
        this.pickerType = 'both';
        this.showSeconds = false;
    }
    DateTimePickerDirective.prototype.ngOnChanges = function (changes) {
        if (this.mode === 'inline' &&
            changes['dateTimePicker'] &&
            !changes['dateTimePicker'].isFirstChange()) {
            this.dialog.setSelectedMoment(this.dateTimePicker);
        }
    };
    DateTimePickerDirective.prototype.ngOnInit = function () {
        if (this.mode === 'inline') {
            this.openDialog();
        }
    };
    DateTimePickerDirective.prototype.onClick = function () {
        this.openDialog();
    };
    DateTimePickerDirective.prototype.momentChanged = function (value) {
        this.dateTimePickerChange.emit(value);
    };
    DateTimePickerDirective.prototype.openDialog = function () {
        var _this = this;
        if (!this.created) {
            this.created = true;
            this.compiler.compileModuleAndAllComponentsAsync(dynamic_module_1.DynamicModule)
                .then(function (factory) {
                var compFactory = factory.componentFactories.find(function (x) { return x.componentType === dialog_component_1.DialogComponent; });
                var injector = core_1.ReflectiveInjector.fromResolvedProviders([], _this.vcRef.parentInjector);
                var cmpRef = _this.vcRef.createComponent(compFactory, 0, injector, []);
                cmpRef.instance.setDialog(_this, _this.el, _this.dateTimePicker, _this.locale, _this.viewFormat, _this.returnObject, _this.positionOffset, _this.mode, _this.hourTime, _this.theme, _this.pickerType, _this.showSeconds);
                _this.dialog = cmpRef.instance;
            });
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.dateTimePicker);
        }
    };
    return DateTimePickerDirective;
}());
DateTimePickerDirective.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[dateTimePicker]',
                host: {
                    '(click)': 'onClick()',
                }
            },] },
];
DateTimePickerDirective.ctorParameters = function () { return [
    { type: core_1.Compiler, },
    { type: core_1.ViewContainerRef, },
    { type: core_1.ElementRef, },
]; };
DateTimePickerDirective.propDecorators = {
    'dateTimePicker': [{ type: core_1.Input, args: ['dateTimePicker',] },],
    'dateTimePickerChange': [{ type: core_1.Output, args: ['dateTimePickerChange',] },],
    'locale': [{ type: core_1.Input },],
    'viewFormat': [{ type: core_1.Input },],
    'returnObject': [{ type: core_1.Input },],
    'mode': [{ type: core_1.Input },],
    'hourTime': [{ type: core_1.Input },],
    'theme': [{ type: core_1.Input },],
    'positionOffset': [{ type: core_1.Input },],
    'pickerType': [{ type: core_1.Input },],
    'showSeconds': [{ type: core_1.Input },],
};
exports.DateTimePickerDirective = DateTimePickerDirective;
//# sourceMappingURL=picker.directive.js.map