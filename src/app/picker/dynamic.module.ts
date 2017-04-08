/**
 * dynamic.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';
import { MomentPipe } from "./moment.pipe";
import { DatePanelComponent } from './date-panel.component';
import { TimePanelComponent } from './time-panel.component';
import { SlideControlComponent } from './slider.component';
import { NumberFixedLenPipe } from './numberFixedLen.pipe';
import { TranslatePipe } from './translate.pipe';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        DialogComponent,
        DatePanelComponent,
        TimePanelComponent,
        SlideControlComponent,
        MomentPipe,
        NumberFixedLenPipe,
        TranslatePipe,
    ],
})
export class DynamicModule {
}
