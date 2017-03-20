import { OnInit, ElementRef } from '@angular/core';
import { Moment } from 'moment/moment';
export declare class DialogComponent implements OnInit {
    private el;
    private show;
    private moment;
    private initialValue;
    private selectedMoment;
    private directiveInstance;
    private directiveElementRef;
    private now;
    private dialogType;
    private dtLocale;
    private dtViewFormat;
    private dtReturnObject;
    private dtDialogType;
    private dtPositionOffset;
    private dtMode;
    private top;
    private left;
    private width;
    private position;
    constructor(el: ElementRef);
    ngOnInit(): void;
    openDialog(moment: any, emit?: boolean): void;
    cancelDialog(): void;
    setInitialMoment(value: any): void;
    setDialog(instance: any, elementRef: ElementRef, initialValue: any, dtLocale: string, dtViewFormat: string, dtReturnObject: string, dtDialogType: string, dtMode: string, dtPositionOffset: string): void;
    select(moment: Moment): void;
    confirm(): void;
    setTime(moment: Moment): void;
    toggleDialogType(type: DialogType): void;
    private setMomentFromString(value, emit?);
    private parseToReturnObjectType(day);
    private setDialogPosition();
    private createBox(element, offset);
    private onMouseDown(event);
    private isDescendant(parent, child);
}
export declare enum DialogType {
    Time = 0,
    Date = 1,
    Month = 2,
    Year = 3,
}
