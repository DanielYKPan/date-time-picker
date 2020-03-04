import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from '../../npmdist';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@ansyn/ng-pick-datetime';
// import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { MatTabsModule } from '@angular/material';
import { CodeHighlightDirective } from './code-highlight.directive';
import { PickerMomentModule } from './picker-moment/picker-moment.module';

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
        PickerMomentModule,
        // OwlMomentDateTimeModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
