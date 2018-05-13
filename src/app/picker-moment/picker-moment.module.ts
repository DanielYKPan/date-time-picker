import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthOnlyComponent } from './month-only/month-only.component';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats, OwlDateTimeModule } from 'ng-pick-datetime';
import { MatTabsModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTabsModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,
    ],
    exports: [
        MonthOnlyComponent
    ],
    declarations: [
        MonthOnlyComponent,
    ],
    providers: [
        {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS},
    ]
})
export class PickerMomentModule {
}
