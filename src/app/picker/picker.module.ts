/**
 * picker.module
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DateTimePickerDirective } from './picker.directive';
import { DialogComponent } from './dialog.component';
import { MomentPipe } from "./moment.pipe";
import { DatePanelComponent } from './date-panel.component';
import { TimePanelComponent } from './time-panel.component';
import { SlideControlComponent } from './slider.component';
import { NumberFixedLenPipe } from './numberFixedLen.pipe';
import { TranslatePipe } from './translate.pipe';
import { HighlightDirective } from './highlight.directive';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DateTimePickerDirective,
        DialogComponent,
        DatePanelComponent,
        TimePanelComponent,
        SlideControlComponent,
        MomentPipe,
        NumberFixedLenPipe,
        TranslatePipe,
        HighlightDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
    ],
    exports: [
        DateTimePickerDirective,
    ],
    providers: [],
    entryComponents: [DialogComponent]
})
export class DateTimePickerModule {
}
