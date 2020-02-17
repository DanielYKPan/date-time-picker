import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from '../../projects/picker/src/public_api';

import { AppComponent } from './app.component';
import { OWL_DATE_TIME_LOCALE } from '../../projects/picker/src/public_api';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule,
    OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  providers: [
   { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
