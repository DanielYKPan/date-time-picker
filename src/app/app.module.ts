/**
 * app.module
 */

import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from "@angular/forms";
import { ColorPickerModule } from 'angular2-color-picker';
import { DateTimePickerModule } from 'ng-pick-datetime';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        DateTimePickerModule,
        ColorPickerModule,
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

