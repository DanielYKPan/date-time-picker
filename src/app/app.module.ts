import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '../../npmdist/date-time';
import { MatTabsModule } from '@angular/material';
import { CodeHighlightDirective } from './code-highlight.directive';

@NgModule({
    declarations: [
        AppComponent,
        CodeHighlightDirective,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatTabsModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
