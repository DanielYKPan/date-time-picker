/**
 * picker.module
 */

import { NgModule } from '@angular/core';

import { DateTimePickerComponent } from './picker.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberFixedLenPipe } from './numberedFixLen.pipe';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [DateTimePickerComponent],
    declarations: [DateTimePickerComponent, NumberFixedLenPipe],
    providers: [],
})
export class DateTimePickerModule {
}


