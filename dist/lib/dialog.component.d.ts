import { OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { TranslateService } from './translate.service';
export declare class DialogComponent implements OnInit, OnDestroy {
    private el;
    private translate;
    private service;
    private selectedMoment;
    private directiveInstance;
    private directiveElementRef;
    private top;
    private left;
    private width;
    private height;
    private position;
    show: boolean;
    initialValue: string;
    now: Moment;
    theme: string;
    hourTime: '12' | '24';
    positionOffset: string;
    mode: 'popup' | 'dropdown' | 'inline';
    returnObject: string;
    dialogType: DialogType;
    pickerType: 'both' | 'date' | 'time';
    showSeconds: boolean;
    private subId;
    constructor(el: ElementRef, translate: TranslateService, service: PickerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    openDialog(moment: any): void;
    setSelectedMoment(moment: any): void;
    cancelDialog(): void;
    setInitialMoment(value: any): void;
    setDialog(instance: any, elementRef: ElementRef, initialValue: any, dtLocale: string, dtViewFormat: string, dtReturnObject: string, dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline', dtHourTime: '12' | '24', dtTheme: string, dtPickerType: 'both' | 'date' | 'time', dtShowSeconds: boolean): void;
    confirm(close: boolean): void;
    toggleDialogType(type: DialogType): void;
    setDate(moment: Moment): void;
    setTime(time: {
        hour: number;
        min: number;
        sec: number;
        meridian: string;
    }): void;
    getDialogStyle(): any;
    private setDialogPosition();
    private setInlineDialogPosition();
    private createBox(element, offset);
    private returnSelectedMoment();
}
export declare enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}
