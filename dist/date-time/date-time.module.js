var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { OwlDateTimeTriggerDirective } from './date-time-picker-trigger.directive';
import { OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER, OwlDateTimeComponent } from './date-time-picker.component';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
import { OwlDateTimeInputDirective } from './date-time-picker-input.directive';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OwlMonthViewComponent } from './calendar-month-view.component';
import { OwlCalendarBodyComponent } from './calendar-body.component';
import { OwlYearViewComponent } from './calendar-year-view.component';
import { OwlMultiYearViewComponent } from './calendar-multi-year-view.component';
import { OwlTimerBoxComponent } from './timer-box.component';
import { OwlTimerComponent } from './timer.component';
import { NumberFixedLenPipe } from './numberedFixLen.pipe';
import { OwlCalendarComponent } from './calendar.component';
import { OwlDateTimeInlineComponent } from './date-time-inline.component';
import { OwlDialogModule } from '../dialog';
var OwlDateTimeModule = (function () {
    function OwlDateTimeModule() {
    }
    OwlDateTimeModule = __decorate([
        NgModule({
            imports: [CommonModule, OverlayModule, OwlDialogModule, A11yModule],
            exports: [
                OwlCalendarComponent,
                OwlTimerComponent,
                OwlDateTimeTriggerDirective,
                OwlDateTimeInputDirective,
                OwlDateTimeComponent,
                OwlDateTimeInlineComponent,
                OwlMultiYearViewComponent,
                OwlYearViewComponent,
                OwlMonthViewComponent,
            ],
            declarations: [
                OwlDateTimeTriggerDirective,
                OwlDateTimeInputDirective,
                OwlDateTimeComponent,
                OwlDateTimeContainerComponent,
                OwlMultiYearViewComponent,
                OwlYearViewComponent,
                OwlMonthViewComponent,
                OwlTimerComponent,
                OwlTimerBoxComponent,
                OwlCalendarComponent,
                OwlCalendarBodyComponent,
                NumberFixedLenPipe,
                OwlDateTimeInlineComponent,
            ],
            providers: [
                OwlDateTimeIntl,
                OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER,
            ],
            entryComponents: [
                OwlDateTimeContainerComponent,
            ]
        })
    ], OwlDateTimeModule);
    return OwlDateTimeModule;
}());
export { OwlDateTimeModule };
