import { OnInit, EventEmitter } from "@angular/core";
import { Moment } from 'moment/moment';
export declare class DatePickerComponent implements OnInit {
    dayNames: Array<string>;
    initDate: string;
    firstWeekDayMonday: boolean;
    viewFormat: string;
    onDatePickerCancel: EventEmitter<boolean>;
    onSelectDate: EventEmitter<string>;
    calendarDate: Moment;
    selectedDate: Moment;
    today: Moment;
    calendarDays: Array<Moment>;
    constructor();
    ngOnInit(): void;
    prevMonth(): void;
    nextMonth(): void;
    selectDay(day: Moment): void;
    selectToday(): void;
    clearPickDate(): void;
    cancelDatePicker(): void;
    protected initValue(): void;
    protected generateCalendar(): void;
}
