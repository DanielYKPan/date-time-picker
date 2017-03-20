import { ElementRef, Compiler, ViewContainerRef, EventEmitter } from '@angular/core';
export declare class DateTimePickerDirective {
    private compiler;
    private vcRef;
    private el;
    dateTimePicker: any;
    dateTimePickerChange: EventEmitter<any>;
    locale: string;
    viewFormat: string;
    returnObject: string;
    dialogType: string;
    private created;
    private dialog;
    constructor(compiler: Compiler, vcRef: ViewContainerRef, el: ElementRef);
    onClick(): void;
    momentChanged(value: any): void;
    private openDialog();
}
