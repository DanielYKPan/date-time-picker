"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var dialog_component_1 = require("./dialog.component");
var moment_pipe_1 = require("./moment.pipe");
var date_panel_component_1 = require("./date-panel.component");
var time_panel_component_1 = require("./time-panel.component");
var slider_component_1 = require("./slider.component");
var numberFixedLen_pipe_1 = require("./numberFixedLen.pipe");
var translate_pipe_1 = require("./translate.pipe");
var DynamicModule = (function () {
    function DynamicModule() {
    }
    return DynamicModule;
}());
DynamicModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [
                    platform_browser_1.BrowserModule,
                ],
                declarations: [
                    dialog_component_1.DialogComponent,
                    date_panel_component_1.DatePanelComponent,
                    time_panel_component_1.TimePanelComponent,
                    slider_component_1.SlideControlComponent,
                    moment_pipe_1.MomentPipe,
                    numberFixedLen_pipe_1.NumberFixedLenPipe,
                    translate_pipe_1.TranslatePipe,
                ],
            },] },
];
DynamicModule.ctorParameters = function () { return []; };
exports.DynamicModule = DynamicModule;
//# sourceMappingURL=dynamic.module.js.map