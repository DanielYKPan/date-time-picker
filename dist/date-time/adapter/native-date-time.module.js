import { NgModule } from '@angular/core';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE_PROVIDER } from './date-time-adapter.class';
import { NativeDateTimeAdapter } from './native-date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './date-time-format.class';
import { OWL_NATIVE_DATE_TIME_FORMATS } from './native-date-time-format.class';
var NativeDateTimeModule = (function () {
    function NativeDateTimeModule() {
    }
    NativeDateTimeModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter },
                        OWL_DATE_TIME_LOCALE_PROVIDER,
                    ],
                },] },
    ];
    return NativeDateTimeModule;
}());
export { NativeDateTimeModule };
var ɵ0 = OWL_NATIVE_DATE_TIME_FORMATS;
var OwlNativeDateTimeModule = (function () {
    function OwlNativeDateTimeModule() {
    }
    OwlNativeDateTimeModule.decorators = [
        { type: NgModule, args: [{
                    imports: [NativeDateTimeModule],
                    providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: ɵ0 }],
                },] },
    ];
    return OwlNativeDateTimeModule;
}());
export { OwlNativeDateTimeModule };
export { ɵ0 };
