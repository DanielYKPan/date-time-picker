import { OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
export declare class TimePanelComponent implements OnInit, OnDestroy {
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
    timeSliderMoment: Moment;
    hourTime: '12' | '24';
    showSeconds: boolean;
    private subId;
    constructor(service: PickerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setMeridian(meridian: string): void;
    setTime(): void;
    private setTimePickerTimeValue(moment?);
}
