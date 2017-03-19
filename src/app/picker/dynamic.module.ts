/**
 * dynamic.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';
import { ModalComponent } from '../picker-modal/modal.component';
import { MomentPipe } from "../pipes/moment.pipe";
import { DatePanelComponent } from './date-panel.component';
import { TimePanelComponent } from './time-panel.component';
import { SlideControlComponent } from './slider.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        DialogComponent,
        ModalComponent,
        DatePanelComponent,
        TimePanelComponent,
        SlideControlComponent,
        MomentPipe
    ],
})
export class DynamicModule {
}
