Angular Date Time Picker
========================

**Angular date time picker - Angular reusable UI component**
**This package supports Angular 5+**


Breaking Changes
-------
 - This picker is complete changed in version 5.1.*. If you use this package before, please read the documentation or the demo examples carefully, and change the implementation of the picker in your projects.

Description
-------
Simple Angular date time picker. Online demo is [here](https://danielykpan.github.io/date-time-picker/). 
This picker is responsive design, so feel free to try it in your desktops, tablets and mobile devices. 

How to Use
-------

 1. Install with [npm](https://www.npmjs.com):`npm install ng-pick-datetime --save`
 2. Add styles.
    If you are using Angular CLI, you can add this to your styles.css: 
    ```css
    @import "~@ng-pick-datetime/assets/style/picker.min.css";
    ``` 
    If you are not using the Angular CLI, you can include the picker.min.css via a ```<link>``` element in your index.html.
 3. Add __OwlDateTimeModule__ and __OwlNativeDateTimeModule__ to your __@NgModule__ like example below
    ```typescript
     import { NgModule } from '@angular/core';
     import { BrowserModule } from '@angular/platform-browser';
     import { MyTestApp } from './my-test-app';
    
     import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
    
     @NgModule({
         imports: [ 
             BrowserModule, 
             OwlDateTimeModule, 
             OwlNativeDateTimeModule,
         ],
         declarations: [ MyTestApp ],
         bootstrap:    [ MyTestApp ]
     })
     export class MyTestAppModule {}
    ```
 4. Connecting a picker to an input and a trigger.
    ```html
    <input [owlDateTime]="dt1" [owlDateTimeTrigger]="dt1" placeholder="Date Time">
    <owl-date-time #dt1></owl-date-time>
    ```
    ```html
    <input [owlDateTime]="dt2" placeholder="Date Time">
    <span [owlDateTimeTrigger]="dt2"><i class="fa fa-calendar"></i></span>
    <owl-date-time #dt2></owl-date-time>
    ```
    The examples above are quite basic. The picker has much more features, 
    and you could learn more about those from [demo page](https://danielykpan.github.io/date-time-picker/).
    

Animation
-------
This picker uses angular animations to improve the user experience, 
therefore you need to install `@angular/animations` and import `BrowserAnimationsModule` to your application. 
```
    npm install @angular/animations --save
```
```typescript
    import {BrowserModule} from '@angular/platform-browser';
    import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
    
    @NgModule({
        imports: [
            BrowserModule,
            BrowserAnimationsModule,
            //...
        ],
        //...
    })
    export class YourAppModule { }
```
If you prefer to disable animation effect, use `NoopAnimationsModule` instead.

Choose a date implementation
-------
The date-time picker was built to be date implementation agnostic. 
Developers need to make sure to provide the appropriate pieces for the picker to work with their chosen implementation.
There are two pre-made modules, users need to import one of them or build your own one (learn more about this from [here](https://danielykpan.github.io/date-time-picker/)).

- `OwlNativeDateTimeModule` - support for native JavaScript Date object
- `OwlMomentDateTimeModule` - support for MomentJs

Properties for `owl-date-time`
-------
|Name|Type|Required|Default|Description|
|:--- |:--- |:--- |:--- |:--- |
|`pickerType`|`both`, `calendar`, `timer`|Optional|`botn`| Set the type of the dateTime picker. `both`: show both calendar and timer, `calendar`: only show calendar, `timer`: only show timer. |
|`pickerMode`|`popup`, `dialog`|Optional|`popup`| The style the picker would open as. |
|`startView`|`month`, `year`|Optional|`month`| The view that the calendar should start in. |
|`startAt`| T/null |Optional|`null`| The moment to open the picker to initially. |
|`firstDayOfWeek`|number|Optional|`0`| Set the first day of week. Valid value is from 0 to 6. 0: Sunday ~ 6: Saturday|
|`showSecondsTimer`|boolean|Optional|`false`| When specify it to true, it would show a timer to configure the second's value |
|`stepHour`|number|Optional|`1`| Hours to change per step.|
|`stepMinute`|number|Optional|`1`| Minutes to change per step.|
|`stepSecond`|number|Optional|`1`| Seconds to change per step.|
|`disabled`|boolean|Optional|`false`|When specify to true, it would disable the picker.|

Events for `owl-date-time`
-------
|Events|Parameter|Description|
|:--- |:--- |:--- |
|`afterPickerOpen`|null|Callback to invoke when the picker is opened|
|`afterPickerClosed`|null|Callback to invoke when the picker is closed.|

Properties for `input[owlDateTime]`
-------
|Name|Type|Required|Default|Description|
|:--- |:--- |:--- |:--- |:--- |
|`owlDateTime`|`OwlDateTimeComponent<T>`|Require|`null`| The date time picker that this input is associated with.|
|`owlDateTimeFilter`|`( date: T)=>boolean `|Optional|`null`|A function to filter date time.|
|`disabled`|boolean|Optional|`false`|When specify to true, it would disable the picker's input.|
|`min`|`<T>`|Optional|`null`| The minimum valid date time.|
|`max`|`<T>`|Optional|`null`| The maximum valid date time.|
|`selectMode`|`single`, `range`|Optional|`single`| Specify the picker's select mode. `single`: a single value allowed, `range`: allow users to select a range of date-time.|
|`rangeSeparator`|string|Optional|`~`| The character to separate the 'from' and 'to' in input value in range selectMode.|

Events for `input[owlDateTime]`
-------
|Events|Parameter|Description|
|:--- |:--- |:--- |
|`dateTimeChange`|source: OwlDateTimeInput, value: input value, input: the input element|Callback to invoke when `change` event is fired on this `<input [owlDateTime]>`|
|`dateTimeInput`|source: OwlDateTimeInput, value: input value, input: the input element|Callback to invoke when an `input` event is fired on this `<input [owlDateTime]>`.|

Properties for `[owlDateTimeTrigger]`
-------
|Name|Type|Required|Default|Description|
|:--- |:--- |:--- |:--- |:--- |
|`owlDateTimeTrigger`|`OwlDateTimeComponent<T>`|Require|`null`| The date time picker that this trigger is associated with.|
|`disabled`|boolean|Optional|`false`|When specify to true, it would disable the trigger.|

Localization and DateTime Format
-------
Localization for different languages and formats is defined by `OWL_DATE_TIME_LOCALE` and `OWL_DATE_TIME_FORMATS`. You could learn more about this from [here](https://danielykpan.github.io/date-time-picker#locale-formats).


Dependencies
-------
none

Demo
-------
Online demo is [here](https://danielykpan.github.io/date-time-picker/)

License
-------
* License: MIT

Author
-------
**Daniel YK Pan**