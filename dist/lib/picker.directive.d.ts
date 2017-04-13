import { ElementRef, Compiler, ViewContainerRef, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
export declare class DateTimePickerDirective implements OnInit, OnChanges {
    private compiler;
    private vcRef;
    private el;
    dateTimePicker: any;
    dateTimePickerChange: EventEmitter<any>;
    locale: string;
    viewFormat: string;
    returnObject: string;
    mode: 'popup' | 'dropdown' | 'inline';
    hourTime: '12' | '24';
    theme: 'default' | 'green' | 'teal' | 'cyan' | 'grape' | 'red' | 'gray';
    positionOffset: string;
    pickerType: 'both' | 'date' | 'time';
    showSeconds: boolean;
    private created;
    private dialog;
    constructor(compiler: Compiler, vcRef: ViewContainerRef, el: ElementRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    onClick(): void;
    momentChanged(value: any): void;
    private openDialog();
}
