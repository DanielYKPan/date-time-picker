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
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var date_picker_component_1 = require("./date-picker/date-picker.component");
var time_picker_component_1 = require("./time-picker/time-picker.component");
var modal_component_1 = require("./picker-modal/modal.component");
var moment_pipe_1 = require("./pipes/moment.pipe");
var DateTimePickerModule = (function () {
    function DateTimePickerModule() {
    }
    return DateTimePickerModule;
}());
DateTimePickerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule],
        declarations: [
            date_picker_component_1.DatePickerComponent,
            time_picker_component_1.TimePickerComponent,
            modal_component_1.ModalComponent,
            moment_pipe_1.MomentPipe
        ],
        exports: [
            date_picker_component_1.DatePickerComponent,
            time_picker_component_1.TimePickerComponent,
            modal_component_1.ModalComponent,
            moment_pipe_1.MomentPipe
        ],
        providers: []
    }),
    __metadata("design:paramtypes", [])
], DateTimePickerModule);
exports.DateTimePickerModule = DateTimePickerModule;

//# sourceMappingURL=date-time-picker.module.js.map
