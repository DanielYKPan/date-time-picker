import { OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
export declare class DialogComponent implements OnInit, OnDestroy {
    private el;
    private service;
    private directiveInstance;
    autoClose: boolean;
    selectedMoment: Moment;
    directiveElementRef: ElementRef;
    show: boolean;
    initialValue: string;
    now: Moment;
    mode: 'popup' | 'dropdown' | 'inline';
    returnObject: string;
    dialogType: DialogType;
    pickerType: 'both' | 'date' | 'time';
    constructor(el: ElementRef, service: PickerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    openDialog(): void;
    setSelectedMoment(moment: any): void;
    closeDialog(): void;
    setInitialMoment(value: any): void;
    setDialog(instance: any, elementRef: ElementRef, dtAutoClose: boolean, dtLocale: string, dtViewFormat: string, dtReturnObject: string, dtPosition: 'top' | 'right' | 'bottom' | 'left', dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline', dtHourTime: '12' | '24', dtPickerType: 'both' | 'date' | 'time', dtShowSeconds: boolean, dtOnlyCurrentMonth: boolean, dtMinMoment: string, dtMaxMoment: string): void;
    confirmSelectedMoment(): void;
    toggleDialogType(type: DialogType): void;
    setDate(moment: Moment): void;
    setTime(time: {
        hour: number;
        min: number;
        sec: number;
        meridian: string;
    }): void;
    setPickerDisableStatus(isDisabled: boolean): void;
    resetMinMaxMoment(minString: string, maxString: string): void;
    private returnSelectedMoment();
}
export declare enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}
