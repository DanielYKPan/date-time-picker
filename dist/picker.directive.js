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
        this.dialogType = 'date';
        this.mode = 'popup';
        this.positionOffset = '0%';
    }
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
                cmpRef.instance.setDialog(_this, _this.el, _this.dateTimePicker, _this.locale, _this.viewFormat, _this.returnObject, _this.dialogType, _this.mode, _this.positionOffset);
                _this.dialog = cmpRef.instance;
            });
        }
        else if (this.dialog) {
            this.dialog.openDialog(this.dateTimePicker);
        }
    };
    return DateTimePickerDirective;
}());
__decorate([
    core_1.Input('dateTimePicker'),
    __metadata("design:type", Object)
], DateTimePickerDirective.prototype, "dateTimePicker", void 0);
__decorate([
    core_1.Output('dateTimePickerChange'),
    __metadata("design:type", Object)
], DateTimePickerDirective.prototype, "dateTimePickerChange", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "locale", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "viewFormat", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "returnObject", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "dialogType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "mode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerDirective.prototype, "positionOffset", void 0);
DateTimePickerDirective = __decorate([
    core_1.Directive({
        selector: '[dateTimePicker]',
        host: {
            '(click)': 'onClick()',
        }
    }),
    __metadata("design:paramtypes", [core_1.Compiler,
        core_1.ViewContainerRef,
        core_1.ElementRef])
], DateTimePickerDirective);
exports.DateTimePickerDirective = DateTimePickerDirective;

//# sourceMappingURL=picker.directive.js.map
