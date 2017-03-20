
# Angular 2 Date Time Picker

**Angular 2 date time picker - Angular2 reusable UI component**

## Description
Simple Angular2 date time picker. Online demo is [here](https://danielykpan.github.io/ng2-date-time-picker/). 
This picker is responsive design, so feel free to try it in your desktops, tablets and mobile devices. 
This picker uses [MomentJS](http://momentjs.com/)

## Installation

To install this component to an external project, follow the procedure:

1. __npm install ng2-date-time-picker --save__
2. Add __DateTimePickerModule__ import to your __@NgModule__ like example below
    ```js
    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { MyTestApp } from './my-test-app';

    import { DateTimePickerModule } from 'ng2-date-time-picker';

    @NgModule({
        imports:      [ BrowserModule, DateTimePickerModule ],
        declarations: [ MyTestApp ],
        bootstrap:    [ MyTestApp ]
    })
    export class MyTestAppModule {}
    ```
3. **This picker use MomentJS. Remember to load MomentJS when you load your project from webpack or systemjs*.*
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
<input [ngModel]="momentValue | date: 'short'" [(dateTimePicker)]="momentValue" readonly />
```
<p>Or:</p>

```html
<input [ngModel]="momentValue | date: 'short'" [dateTimePicker]="momentValue" (dateTimePickerChange)="setMoment($event)" readonly />
```
```typescript
public setMoment(moment: any): any {
    this.momentValue = moment;
    // Do whatever you want to the return object 'moment'
}
```

 * Create a normal HTML Input and put it anywhere you want (like inside a form you already created). 
 * You may set the HTML Input to **readonly**, so you can only change the date value from the pop-up date-time picker.
 * Use **[(dateTimePicker)]="momentValue"** from our DateTimePickerModule. This is the two way binding feature from Angular2.
    Firstly, the local variable 'momentValue' would be bind to Our 'dateTimePicker' directive and shows in the popup picker dialog.
    Once you select your new moment value and confirm it, the local variable 'momentValue' would be updated. Or if you want to deal
    with the return new moment value from our directive before update the local variable, your can separate it like this **[dateTimePicker]="momentValue" (dateTimePickerChange)="setMoment($event)"**
 * Use **[ngModel]="momentValue"** from Angular2 built-in FormsModule to bind the moment value to the input value. 
 * Inside **[ngModel]="momentValue | date: 'short' "**, we use the date pipe from Angular2 built-in Pipes to transform the Javascript Date Object to more friendly formats.
    We only use this built-in date pipe when we set the 'dateTimePicker' return object as Javascript Date Object.
 * Optional attributes:
      * **[returnObject]="'js'"** --- You can set the return object type when you pick a moment from date-time-picker. (Default value is 'js', this means the default return object type is javascript Date object. The other options are: string, moment, json, array, iso and object).
      * **[viewFormat]="'ll'"** --- If you set your returnObject as 'string', you need to set the viewFormat. (Default value is 'll'. You can get more inform about the format from [MomentJS](http://momentjs.com/docs/#/parsing/string-format/)).
      * **[locale]="'en'"** --- This date-time-picker has robust support for internationalization. (Default value is 'en'. If you want to change to French for example, just set [locale]="'fr'". You can get more inform about the i18n from [MomentJS-i18n](http://momentjs.com/docs/#/i18n/)).
      * **[dialogType]="'date'"** --- You can set the default dialogType to 'date' or 'time'. When you leave it as default ([dialogType]="'date'"), the pop-up date-time-picker dialog would display the date calendar.
        If you set it as 'time', the pop-up date-time-picker dialog would display time slide bar control dialog. But you can still toggle these two dialogs inside the pop-up date-time-picker.
      * **Important: Do Not forget the single quote inside the double quote when you set the optional attributes value.**

## Demo
Online demo is [here](https://danielykpan.github.io/ng2-date-time-picker/)

## License
* License: MIT

## Author
* Author: Daniel Pan
