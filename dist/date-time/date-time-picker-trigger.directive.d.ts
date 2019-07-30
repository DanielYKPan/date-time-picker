import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { OwlDateTimeComponent } from './date-time-picker.component';
export declare class OwlDateTimeTriggerDirective<T> implements OnInit, OnChanges, AfterContentInit, OnDestroy {
    protected changeDetector: ChangeDetectorRef;
    dtPicker: OwlDateTimeComponent<T>;
    private _disabled;
    disabled: boolean;
    readonly owlDTTriggerDisabledClass: boolean;
    private stateChanges;
    constructor(changeDetector: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    handleClickOnHost(event: Event): void;
    private watchStateChanges;
}
