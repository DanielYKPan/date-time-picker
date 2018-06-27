/**
 * date-time.module
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { OwlDateTimeTriggerDirective } from './date-time-picker-trigger.directive';
import { OwlDateTimeMaterialTriggerDirective } from './date-time-picker-material-trigger.directive';
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

@NgModule({
    imports: [CommonModule, OverlayModule, OwlDialogModule, A11yModule],
    exports: [
        OwlDateTimeTriggerDirective,
        OwlDateTimeMaterialTriggerDirective,
        OwlDateTimeInputDirective,
        OwlDateTimeComponent,
        OwlDateTimeInlineComponent,
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
        OwlDateTimeMaterialTriggerDirective
    ],
    providers: [
        OwlDateTimeIntl,
        OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER,
    ],
    entryComponents: [
        OwlDateTimeContainerComponent,
    ]
})
export class OwlDateTimeModule {
}
