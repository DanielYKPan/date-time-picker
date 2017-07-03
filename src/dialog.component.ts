/**
 * dialog.component
 */

import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { TRANSLATION_PROVIDERS } from './translations';
import { TranslateService } from './translate.service';

@Component({
    selector: 'date-time-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    providers: [PickerService, TRANSLATION_PROVIDERS, TranslateService],
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
                 private translate: TranslateService,
                 private service: PickerService ) {
    }

    public ngOnInit() {
        this.autoClose = this.service.dtAutoClose;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.dialogType = this.service.dtDialogType;
        this.translate.use(this.service.dtLocale);

        // set now value
        this.now = this.service.now;

        this.openDialog(this.initialValue);
    }

    public ngOnDestroy(): void {
    }

    public openDialog( moment: any ): void {
        this.show = true;
        this.setSelectedMoment(moment);
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

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any, dtAutoClose: boolean,
                      dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtPosition: 'top' | 'right' | 'bottom' | 'left',
                      dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                      dtHourTime: '12' | '24', dtTheme: string,
                      dtPickerType: 'both' | 'date' | 'time', dtShowSeconds: boolean,
                      dtOnlyCurrentMonth: boolean, dtMinDate: string, dtMaxDate: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;

        this.service.setPickerOptions(dtAutoClose, dtLocale, dtViewFormat, dtReturnObject, dtPosition,
            dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtShowSeconds,
            dtOnlyCurrentMonth, dtMinDate, dtMaxDate);
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
        let done = this.service.setDate(moment);
        if (done && (this.autoClose || this.mode === 'inline')) {
            this.confirmSelectedMoment();
        } else {
            return;
        }
    }

    /**
     * Set the picker time value
     * @param time { {hour: number, min: number, sec: number, meridian: string} }
     * @return {void}
     * */
    public setTime( time: { hour: number, min: number, sec: number, meridian: string } ): void {
        // set the picker selectedMoment time value
        this.service.setTime(time.hour, time.min, time.sec, time.meridian);

        if (this.service.dtPickerType === 'time' || this.mode === 'inline' || this.autoClose) {
            this.confirmSelectedMoment();
        }

        // reset the dialog's type
        this.dialogType = this.service.dtDialogType;
        return;
    }

    public clearPickerInput(): void {
        this.service.setMoment(null);
        this.directiveInstance.momentChanged(null);
        this.closeDialog();
        return;
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
