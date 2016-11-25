/**
 * app.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { ModalComponent } from "./picker-modal/modal.component";
import { MomentPipe } from "./pipes/moment.pipe";
import { FormsModule } from "@angular/forms";
import { TimePickerComponent } from "./time-picker/time-picker.component";
@NgModule({
    imports: [
        BrowserModule,
        FormsModule
    ],
    declarations: [
        AppComponent,
        DatePickerComponent,
        TimePickerComponent,
        ModalComponent,
        MomentPipe
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

