import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
export declare class OwlTimerBoxComponent implements OnInit, OnDestroy {
    showDivider: boolean;
    upBtnAriaLabel: string;
    upBtnDisabled: boolean;
    downBtnAriaLabel: string;
    downBtnDisabled: boolean;
    boxValue: number;
    value: number;
    min: number;
    max: number;
    step: number;
    inputLabel: string;
    valueChange: EventEmitter<number>;
    inputChange: EventEmitter<number>;
    private inputStream;
    private inputStreamSub;
    readonly displayValue: number;
    readonly owlDTTimerBoxClass: boolean;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    upBtnClicked(): void;
    downBtnClicked(): void;
    handleInputChange(val: string): void;
    private updateValue;
    private updateValueViaInput;
}
