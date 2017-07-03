/**
 * picker-header.component
 */

import { Component,EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PickerService } from './picker.service';
import { DialogType } from './dialog.component';
import { Moment } from 'moment';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'dialog-picker-header',
    templateUrl: './picker-header.component.html',
    styleUrls: ['./picker-header.component.scss'],
})

export class PickerHeaderComponent implements OnInit, OnDestroy {

    @Input() public dialogType: DialogType;
    @Output() public onDialogTypeChange = new EventEmitter<DialogType>();

    public hourTime: '12' | '24';
    public showSeconds: boolean;
    public pickerType: 'both' | 'date' | 'time';
    public mode: 'popup' | 'dropdown' | 'inline';
    public themeColor: string;
    public now: Moment;
    public selectedMoment: Moment;
    private subId: Subscription;

    constructor( private service: PickerService ) {
    }

    public ngOnInit(): void {
        this.hourTime = this.service.dtHourTime;
        this.showSeconds = this.service.dtShowSeconds;
        this.pickerType = this.service.dtPickerType;
        this.mode = this.service.dtMode;
        this.themeColor = this.service.dtTheme;
        this.now = this.service.now;

        this.subId = this.service.selectedMomentChange.subscribe(
            (data) => this.selectedMoment = data
        );
    }

    public ngOnDestroy(): void {
        this.subId.unsubscribe();
    }

    public setDialogType( type: DialogType ) {
        this.onDialogTypeChange.emit(type);
    }
}
