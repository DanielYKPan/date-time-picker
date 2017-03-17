/**
 * dynamic.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogComponent } from './dialog.component';
import { ModalComponent } from '../picker-modal/modal.component';
import { MomentPipe } from "../pipes/moment.pipe";

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [DialogComponent, ModalComponent, MomentPipe],
})
export class DynamicModule {
}
