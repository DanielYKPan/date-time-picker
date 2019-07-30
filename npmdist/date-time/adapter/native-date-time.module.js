var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';
import { DateTimeAdapter } from './date-time-adapter.class';
import { NativeDateTimeAdapter } from './native-date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from './date-time-format.class';
import { OWL_NATIVE_DATE_TIME_FORMATS } from './native-date-time-format.class';
var NativeDateTimeModule = (function () {
    function NativeDateTimeModule() {
    }
    NativeDateTimeModule = __decorate([
        NgModule({
            imports: [PlatformModule],
            providers: [
                { provide: DateTimeAdapter, useClass: NativeDateTimeAdapter },
            ],
        })
    ], NativeDateTimeModule);
    return NativeDateTimeModule;
}());
export { NativeDateTimeModule };
var ɵ0 = OWL_NATIVE_DATE_TIME_FORMATS;
var OwlNativeDateTimeModule = (function () {
    function OwlNativeDateTimeModule() {
    }
    OwlNativeDateTimeModule = __decorate([
        NgModule({
            imports: [NativeDateTimeModule],
            providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: ɵ0 }],
        })
    ], OwlNativeDateTimeModule);
    return OwlNativeDateTimeModule;
}());
export { OwlNativeDateTimeModule };
export { ɵ0 };
