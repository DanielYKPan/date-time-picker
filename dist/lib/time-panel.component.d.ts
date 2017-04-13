import { OnInit, EventEmitter } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
export declare class TimePanelComponent implements OnInit {
    private service;
    onSetTime: EventEmitter<{
        hour: number;
        min: number;
        sec: number;
        meridian: string;
    }>;
    hourValue: number;
    minValue: number;
    secValue: number;
    meridianValue: string;
    hourFloor: number;
    hourCeiling: number;
    moment: Moment;
    hourTime: '12' | '24';
    theme: string;
    mode: 'popup' | 'dropdown' | 'inline';
    showSeconds: boolean;
    constructor(service: PickerService);
    ngOnInit(): void;
    setMeridian(meridian: string): void;
    setTime(): void;
}
