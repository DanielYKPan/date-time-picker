/**
 * picker-header.component
 */

import {
    ChangeDetectionStrategy, Component, ElementRef, EventEmitter,
    Input, OnInit, Output, ViewChild
} from '@angular/core';
import { PickerService } from './picker.service';
import { DialogType } from './dialog.component';
import { Moment } from 'moment';

@Component({
    selector: 'dialog-picker-header',
    templateUrl: './picker-header.component.html',
    styleUrls: ['./picker-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PickerHeaderComponent implements OnInit {

    @Input() public dialogType: DialogType;
    @Input() public selectedMoment: Moment;
    @Input() public now: Moment;
    @Output() public onDialogTypeChange = new EventEmitter<DialogType>();

    public hourTime: '12' | '24';
    public showSeconds: boolean;
    public pickerType: 'both' | 'date' | 'time';
    public mode: 'popup' | 'dropdown' | 'inline';
    public themeColor: string;

    constructor( private service: PickerService ) {
    }

    public ngOnInit(): void {
        this.hourTime = this.service.dtHourTime;
        this.showSeconds = this.service.dtShowSeconds;
        this.pickerType = this.service.dtPickerType;
        this.mode = this.service.dtMode;
        this.themeColor = this.service.dtTheme;
    }

    public setDialogType( type: DialogType ) {
        this.onDialogTypeChange.emit(type);
    }
}
