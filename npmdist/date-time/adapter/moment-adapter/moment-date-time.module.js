var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from './moment-date-time-adapter.class';
import { OWL_MOMENT_DATE_TIME_FORMATS } from './moment-date-time-format.class';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '../date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS } from '../date-time-format.class';
var MomentDateTimeModule = (function () {
    function MomentDateTimeModule() {
    }
    MomentDateTimeModule = __decorate([
        NgModule({
            providers: [
                {
                    provide: DateTimeAdapter,
                    useClass: MomentDateTimeAdapter,
                    deps: [OWL_DATE_TIME_LOCALE, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS]
                },
            ],
        })
    ], MomentDateTimeModule);
    return MomentDateTimeModule;
}());
export { MomentDateTimeModule };
var ɵ0 = OWL_MOMENT_DATE_TIME_FORMATS;
var OwlMomentDateTimeModule = (function () {
    function OwlMomentDateTimeModule() {
    }
    OwlMomentDateTimeModule = __decorate([
        NgModule({
            imports: [MomentDateTimeModule],
            providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: ɵ0 }],
        })
    ], OwlMomentDateTimeModule);
    return OwlMomentDateTimeModule;
}());
export { OwlMomentDateTimeModule };
export { ɵ0 };
