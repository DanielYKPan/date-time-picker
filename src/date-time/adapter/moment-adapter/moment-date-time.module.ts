/**
 * moment-date-time.module
 */

import { NgModule } from '@angular/core';
import { MomentDateTimeAdapter } from './moment-date-time-adapter.class';
import { OWL_MOMENT_DATE_TIME_FORMATS } from './moment-date-time-format.class';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE_PROVIDER } from '../../../../../../../../../../Library/Application Support/Unclutter/FileStorage';
// import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE_PROVIDER } from 'ng-pick-datetime';

@NgModule({
    providers: [
        {provide: DateTimeAdapter, useClass: MomentDateTimeAdapter},
        OWL_DATE_TIME_LOCALE_PROVIDER,
    ],
})
export class MomentDateTimeModule {
}

@NgModule({
    imports: [MomentDateTimeModule],
    providers: [{provide: OWL_DATE_TIME_FORMATS, useValue: OWL_MOMENT_DATE_TIME_FORMATS}],
})
export class OwlMomentDateTimeModule {
}
