import { OnInit, EventEmitter } from "@angular/core";
export declare class TimePickerComponent implements OnInit {
    initTime: string;
    showSecond: boolean;
    viewFormat: string;
    use12Hour: boolean;
    onSelectTime: EventEmitter<string>;
    onTimePickerCancel: EventEmitter<boolean>;
    private hourFormat;
    private time;
    constructor();
    ngOnInit(): void;
    increaseHour(): void;
    decreaseHour(): void;
    increaseMinute(): void;
    decreaseMinute(): void;
    increaseSecond(): void;
    decreaseSecond(): void;
    selectTime(): void;
    selectNow(): void;
    clearTime(): void;
    cancelTimePicker(): void;
}
