"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var picker_directive_1 = require("./picker.directive");
var dialog_component_1 = require("./dialog.component");
var moment_pipe_1 = require("./moment.pipe");
var date_panel_component_1 = require("./date-panel.component");
var time_panel_component_1 = require("./time-panel.component");
var slider_component_1 = require("./slider.component");
var numberFixedLen_pipe_1 = require("./numberFixedLen.pipe");
var highlight_calendar_directive_1 = require("./highlight-calendar.directive");
var picker_header_component_1 = require("./picker-header.component");
var dialog_position_directive_1 = require("./dialog-position.directive");
var DateTimePickerModule = (function () {
    function DateTimePickerModule() {
    }
    return DateTimePickerModule;
}());
DateTimePickerModule.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [
                    picker_directive_1.DateTimePickerDirective,
                    dialog_component_1.DialogComponent,
                    date_panel_component_1.DatePanelComponent,
                    time_panel_component_1.TimePanelComponent,
                    slider_component_1.SlideControlComponent,
                    picker_header_component_1.PickerHeaderComponent,
                    moment_pipe_1.MomentPipe,
                    numberFixedLen_pipe_1.NumberFixedLenPipe,
                    highlight_calendar_directive_1.HighlightCalendarDirective,
                    dialog_position_directive_1.DialogPositionDirective,
                ],
                imports: [
                    common_1.CommonModule,
                    forms_1.FormsModule,
                ],
                exports: [
                    picker_directive_1.DateTimePickerDirective,
                ],
                providers: [],
                entryComponents: [dialog_component_1.DialogComponent]
            },] },
];
DateTimePickerModule.ctorParameters = function () { return []; };
exports.DateTimePickerModule = DateTimePickerModule;
//# sourceMappingURL=picker.module.js.map