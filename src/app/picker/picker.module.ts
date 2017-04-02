/**
 * picker.module
 */

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DateTimePickerDirective } from './picker.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        DateTimePickerDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserAnimationsModule,
    ],
    exports: [
        DateTimePickerDirective,
    ],
    providers: [],
})
export class DateTimePickerModule {
}
