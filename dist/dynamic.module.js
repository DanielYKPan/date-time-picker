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
var platform_browser_1 = require("@angular/platform-browser");
var dialog_component_1 = require("./dialog.component");
var modal_component_1 = require("./modal.component");
var moment_pipe_1 = require("./moment.pipe");
var date_panel_component_1 = require("./date-panel.component");
var time_panel_component_1 = require("./time-panel.component");
var slider_component_1 = require("./slider.component");
var numberFixedLen_pipe_1 = require("./numberFixedLen.pipe");
var DynamicModule = (function () {
    function DynamicModule() {
    }
    return DynamicModule;
}());
DynamicModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
        ],
        declarations: [
            dialog_component_1.DialogComponent,
            modal_component_1.ModalComponent,
            date_panel_component_1.DatePanelComponent,
            time_panel_component_1.TimePanelComponent,
            slider_component_1.SlideControlComponent,
            moment_pipe_1.MomentPipe,
            numberFixedLen_pipe_1.NumberFixedLenPipe,
        ],
    }),
    __metadata("design:paramtypes", [])
], DynamicModule);
exports.DynamicModule = DynamicModule;

//# sourceMappingURL=dynamic.module.js.map
