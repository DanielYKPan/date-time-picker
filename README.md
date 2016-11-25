
# Angular 2 Date Time Picker

**Angular 2 date time picker - Angular2 reusable UI component**

## Description
Simple Angular2 date time picker. Online demo is [here](https://danielykpan.github.io/ng2-date-time-picker/). This picker is responsive design, so feel free to try it in your desktops, tablets and mobile devices. This picker uses [MomentJS](http://momentjs.com/)

## Installation

To install this component to an external project, follow the procedure:

1. __npm install ng2-date-time-picker --save__
2. Add __DateTimePickerModule__ import to your __@NgModule__ like example below
    ```js
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';

    // If you are using webpack package loader import the MyDatePickerModule from here:
    import { DateTimePickerModule } from 'ng2-date-time-picker';

    // If you are using systemjs package loader import the MyDatePickerModule from here:
    import { DatetimePickerModule } from 'ng2-date-time-picker/dist/date-time-picker.module';

    @NgModule({
        imports:      [ BrowserModule, DateTimePickerModule ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```
3. This picker use MomentJS. Remember to load MomentJS when you load your project from webpack or systemjs
4. If you are using __systemjs__ package loader add the following mydatepicker properties to the __System.config__:
    ```js
    (function (global) {
        System.config({
            paths: {
                'npm:': 'node_modules/'
            },
            map: {
                // Other components are here...

                'ng2-date-time-picker': 'npm:ng2-date-time-picker',
                'moment': 'npm:moment',
            },
            packages: {
                // Other components are here...

				// the picker
                'ng2-date-time-picker': {
                    defaultExtension: 'js'
                },
                // momentJS
                'moment': {
	                main: 'moment.js',
	                defaultExtension: 'js'
	            },
            }
        });
    })(this);
    ```

## Usage

### Date Picker

Use the following snippet inside your template for example:

```html

<input [ngModel]="date" (focus)="toggleDatePicker(true)" readonly />
<date-picker *ngIf="showDatePicker" [initDate]="date"
           (onDatePickerCancel)="toggleDatePicker($event)"
           (onSelectDate)="setDate($event)"></date-picker>
```
In side your component
```typescript
            private date: string;
            private showDatePicker: boolean;
    
            toggleDatePicker(status: boolean): void  {
                this.showDatePicker = status;
            }
    
            setDate(date: string): void {
                this.date = date;
            }
```
* Create a normal HTML Input and put it anywhere you want (like inside a form you already created). 
* Set the HTML Input to **readonly**, so you can only change the date value from the pop-up date picker.
* Use **[ngModel]="date"** from Angular2 built-in FormsModule to bind the date value to the input value. 
* Use **(focus)="toggleDatePicker(true)"** to toggle the date picker. In the Code above, we set the showDatePicker variable to true in the component, so we date picker would show up.
* The date-picker selector could be place anywhere inside your template. (Normally, put it outside your form tag).
* Use ***ngIf="showDatePicker"** in <date-picker></date-picker> to toggle the date picker. (**showDatePicker** is just variable from the component, you can change it to whatever you want)
* Mandatory attributes:
      * **[initDate]="date"** --- The initial date you will have see in the calendar. You can set it null if you don't have any initial date, and the calendar would set Today as the initial date.
      * **(onDatePickerCancel)="toggleDatePicker($event)"** --- This would close the pop-up date picker when you click the cancel button or select a date in the date picker.
      * **(onSelectDate)="setDate($event)"** --- This would set the date value when you pick a date in the date picker.
* Optional attributes:
      * **[viewFormat]='MMM DD, YYYY'** --- You can change the date string format you will get when you pick a date. (Default value is 'MMM DD, YYYY'. You can get more inform about the format from [MomentJS](http://momentjs.com/docs/#/parsing/string-format/)).
      * **[firstWeekDayMonday]="false"** --- You can change the calendar first day in a week to be Monday. (The default value is false, so the first day of a week is set to be Sunday).

### Time Picker
Use the following snippet inside your template for example:

```html

<input [ngModel]="time" (focus)="toggleTimePicker(true)" readonly />
<time-picker *ngIf="showTimePicker" [initTime]="time"
           (onTimePickerCancel)="toggleTimePicker($event)"
           (onSelectTime)="setTime($event)"></time-picker>
```
In side your component
```typescript
            private date: string;
            private showDatePicker: boolean;
    
            toggleDatePicker(status: boolean): void  {
                this.showDatePicker = status;
            }
    
            setDate(date: string): void {
                this.date = date;
            }
```
* The usage of time picker is similar to date time picker except we use <time-picker></time-picker> selector.

* Mandatory attributes:
      * **[initTime]="time"** --- The initial date you will have see in the calendar. You can set it null if you don't have any initial date, and the calendar would set Today as the initial date.
      * **(onTimePickerCancel)="toggleTimePicker($event)"** --- This would close the pop-up time picker when you click the cancel button or select a time in the time picker.
      * **(onSelectTime)="setTime($event)"** --- This would set the time value when you select a time in the time picker.
* Optional attributes:
      * **[viewFormat]="hh:mm A"** --- You can change the time string format you will get when you select a time. (Default value is 'hh:mm A'. You can get more inform about the format from [MomentJS](http://momentjs.com/docs/#/parsing/string-format/)).
      * **[use12Hour]="true"** --- You can change the time format using 12 hour rule.(The default value is false, so we use 24 hour rule as default).
      * **[showSecond]="true"** --- You can show and change the second value in the time picker. (The default value is false, so the time picker does not show the second value as default).

## Demo
Online demo is [here](https://danielykpan.github.io/ng2-date-time-picker/)

## License
* License: MIT

## Author
* Author: Daniel Pan
