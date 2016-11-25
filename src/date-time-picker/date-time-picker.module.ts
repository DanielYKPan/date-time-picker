/**
 * date-time-picker.module
 */

import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { TimePickerComponent } from "./time-picker/time-picker.component";
import { ModalComponent } from "./picker-modal/modal.component";
import { MomentPipe } from "./pipes/moment.pipe";

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        DatePickerComponent,
        TimePickerComponent,
        ModalComponent,
        MomentPipe
    ],
    exports: [
        DatePickerComponent,
        TimePickerComponent,
        ModalComponent,
        MomentPipe
    ],
    providers: []
})
export class DateTimePickerModule {
}
