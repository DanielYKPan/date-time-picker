/**
 * date-time.module
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeTriggerDirective } from './date-time-picker-trigger.directive';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
import { OwlDateTimeInputDirective } from './date-time-picker-input.directive';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OwlMonthViewComponent } from './calendar-month-view.component';
import { OwlCalendarBodyComponent } from './calendar-body.component';
import { OwlYearViewComponent } from './calendar-year-view.component';
import { OwlTimerBoxComponent } from './timer-box.component';
import { OwlTimerComponent } from './timer.component';
import { NumberFixedLenPipe } from './numberedFixLen.pipe';
import { OwlCalendarComponent } from './calendar.component';
import { OwlDateTimeInlineComponent } from './date-time-inline.component';
import { OwlOverlayModule } from '../overlay';
import { OwlDialogModule } from '../dialog';
import { DomHandlerService, InjectionService } from '../utils';
import { OwlFocusModule } from '../focus-trap';

@NgModule({
    imports: [CommonModule, FormsModule, OwlOverlayModule, OwlDialogModule, OwlFocusModule],
    exports: [
        OwlDateTimeTriggerDirective,
        OwlDateTimeInputDirective,
        OwlDateTimeComponent,
        OwlDateTimeInlineComponent,
    ],
    declarations: [
        OwlDateTimeTriggerDirective,
        OwlDateTimeInputDirective,
        OwlDateTimeComponent,
        OwlDateTimeContainerComponent,
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
        InjectionService,
        DomHandlerService,
        OwlDateTimeIntl,
    ],
    entryComponents: [
        OwlDateTimeContainerComponent,
    ]
})
export class OwlDateTimeModule {
}


