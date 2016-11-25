/**
 * app.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { DateTimePickerModule } from "ng2-date-time-picker";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        DateTimePickerModule,
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }

