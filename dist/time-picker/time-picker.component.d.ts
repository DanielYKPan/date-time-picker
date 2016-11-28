import { OnInit, EventEmitter } from "@angular/core";
import { Moment } from 'moment/moment';
export declare class TimePickerComponent implements OnInit {
    initTime: any;
    showSecond: boolean;
    viewFormat: string;
    use12Hour: boolean;
    returnObject: string;
    onSelectTime: EventEmitter<any>;
    onTimePickerCancel: EventEmitter<boolean>;
    hourFormat: string;
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
    protected parseToReturnObjectType(time: Moment): any;
}
