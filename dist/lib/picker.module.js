"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var picker_directive_1 = require("./picker.directive");
var DateTimePickerModule = (function () {
    function DateTimePickerModule() {
    }
    return DateTimePickerModule;
}());
DateTimePickerModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [
                    picker_directive_1.DateTimePickerDirective,
                ],
                imports: [
                    common_1.CommonModule,
                    forms_1.FormsModule,
                ],
                exports: [
                    picker_directive_1.DateTimePickerDirective,
                ],
                providers: [],
            },] },
];
DateTimePickerModule.ctorParameters = function () { return []; };
exports.DateTimePickerModule = DateTimePickerModule;
//# sourceMappingURL=picker.module.js.map