import { OnInit, EventEmitter } from '@angular/core';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';
export declare class TimePanelComponent implements OnInit {
    moment: Moment;
    now: Moment;
    dialogType: DialogType;
    onSetTime: EventEmitter<Moment>;
    hourValue: number;
    minValue: number;
    meridianValue: string;
    constructor();
    ngOnInit(): void;
    setMeridian(meridian: string): void;
    setTime(): void;
}
