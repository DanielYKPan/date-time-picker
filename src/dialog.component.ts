/**
 * dialog.component
 */

import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';

@Component({
    selector: 'date-time-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    providers: [PickerService],
})
export class DialogComponent implements OnInit, OnDestroy {

    private directiveInstance: any;

    public autoClose: boolean;
    public selectedMoment: Moment;
    public directiveElementRef: ElementRef;
    public show: boolean = false;
    public initialValue: string;
    public now: Moment;
    public mode: 'popup' | 'dropdown' | 'inline';
    public returnObject: string;
    public dialogType: DialogType;
    public pickerType: 'both' | 'date' | 'time';

    constructor( private el: ElementRef,
                 private service: PickerService ) {
    }

    public ngOnInit() {
        this.autoClose = this.service.dtAutoClose;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.dialogType = this.service.dtDialogType;

        // set now value
        this.now = this.service.now;

    }

    public ngOnDestroy(): void {
    }

    public openDialog(): void {
        this.show = true;
        return;
    }

    public setSelectedMoment( moment: any ): void {
        this.service.setMoment(moment);
    }

    /**
     * Close the picker dialog
     * */
    public closeDialog(): void {
        this.show = false;
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, dtAutoClose: boolean,
                      dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtPosition: 'top' | 'right' | 'bottom' | 'left',
                      dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                      dtHourTime: '12' | '24',
                      dtPickerType: 'both' | 'date' | 'time', dtShowSeconds: boolean,
                      dtOnlyCurrentMonth: boolean, dtMinMoment: string, dtMaxMoment: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;

        this.service.setPickerOptions(dtAutoClose, dtLocale, dtViewFormat, dtReturnObject, dtPosition,
            dtPositionOffset, dtMode, dtHourTime, dtPickerType, dtShowSeconds,
            dtOnlyCurrentMonth, dtMinMoment, dtMaxMoment);
    }

    /**
     * Confirm the selectedMoment
     * */
    public confirmSelectedMoment(): void {
        this.returnSelectedMoment();
        this.closeDialog();
        return;
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = this.service.dtDialogType;
        } else {
            this.dialogType = type;
        }
    }

    public setDate( moment: Moment ): void {

        if (this.service.dtDisabled) {
            return;
        }

        let done = this.service.setDate(moment);

        if (done) {
            if (this.autoClose || this.mode === 'inline') {
                this.confirmSelectedMoment();
                return;
            }
        } else {
            // emit an error message
            this.directiveInstance.sendError("The selected moment is invalid.");
        }
    }

    /**
     * Set the picker time value
     * @param time { {hour: number, min: number, sec: number, meridian: string} }
     * @return {void}
     * */
    public setTime( time: { hour: number, min: number, sec: number, meridian: string } ): void {

        if (this.service.dtDisabled) {
            return;
        }

        // set the picker selectedMoment time value
        let done = this.service.setTime(time.hour, time.min, time.sec, time.meridian);

        if (done) {
            if (this.service.dtPickerType === 'time' || this.mode === 'inline' || this.autoClose) {
                this.confirmSelectedMoment();
            }
            // reset the dialog's type
            this.dialogType = this.service.dtDialogType;
            return;
        } else {
            // emit an error message
            this.directiveInstance.sendError("The selected moment is invalid.");
        }
    }

    public setPickerDisableStatus( isDisabled: boolean ): void {
        this.service.dtDisabled = isDisabled;
    }

    public resetMinMaxMoment( minString: string, maxString: string ) {
        this.service.resetMinMaxMoment(minString, maxString);
    }

    /**
     * the picker directive returns the selected moment
     *
     * */
    private returnSelectedMoment(): void {
        let selectedM = this.service.parseToReturnObjectType();
        if (selectedM) {
            this.directiveInstance.momentChanged(selectedM);
        }
        return;
    }
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
