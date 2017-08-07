import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { PickerService } from './picker.service';
import { DialogType } from './dialog.component';
import { Moment } from 'moment';
export declare class PickerHeaderComponent implements OnInit, OnDestroy {
    private service;
    dialogType: DialogType;
    onDialogTypeChange: EventEmitter<DialogType>;
    hourTime: '12' | '24';
    showSeconds: boolean;
    pickerType: 'both' | 'date' | 'time';
    mode: 'popup' | 'dropdown' | 'inline';
    now: Moment;
    selectedMoment: Moment;
    private subId;
    constructor(service: PickerService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    setDialogType(type: DialogType): void;
}
