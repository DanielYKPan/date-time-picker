/**
 * dialog.component
 */

import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { Subscription } from 'rxjs/Rx';
import { TRANSLATION_PROVIDERS } from './translations';
import { TranslateService } from './translate.service';

@Component({
    selector: 'date-time-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    providers: [PickerService, TRANSLATION_PROVIDERS, TranslateService],
})
export class DialogComponent implements OnInit, OnDestroy {

    private selectedMoment: Moment;
    private directiveInstance: any;

    public directiveElementRef: ElementRef;
    public show: boolean;
    public initialValue: string;
    public now: Moment;
    public mode: 'popup' | 'dropdown' | 'inline';
    public returnObject: string;
    public dialogType: DialogType;
    public pickerType: 'both' | 'date' | 'time';
    public minDate: any;
    public maxDate: any;

    private subId: Subscription;
    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    constructor( private el: ElementRef,
                 private translate: TranslateService,
                 private service: PickerService ) {
    }

    public ngOnInit() {
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        this.pickerType = this.service.dtPickerType;
        this.translate.use(this.service.dtLocale);
        this.momentFunc.locale(this.service.dtLocale);
        this.minDate = this.service.dtMinDate;
        this.maxDate = this.service.dtMaxDate;

        // set now value
        this.now = this.momentFunc();
        this.subId = this.service.selectedMomentChange.subscribe(
            ( selectedMoment: Moment ) => {
                this.selectedMoment = selectedMoment;
            }
        );
        this.show = false;
        this.openDialog(this.initialValue);
    }

    public ngOnDestroy(): void {
        if (this.subId) {
            this.subId.unsubscribe();
        }
    }

    public openDialog( moment: any, minDate: any = null, maxDate: any = null): void {
        this.show = true;
        this.dialogType = this.service.dtDialogType;
        this.setSelectedMoment(moment, minDate, maxDate);
        return;
    }

    public setSelectedMoment( moment: any , minDate: any, maxDate: any ): void {
        this.service.setMoment(moment, minDate, maxDate);
    }

    public cancelDialog(): void {
        this.show = false;
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any, dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtPosition: 'top' | 'right' | 'bottom' | 'left',
                      dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                      dtHourTime: '12' | '24', dtTheme: string,
                      dtPickerType: 'both' | 'date' | 'time', dtShowSeconds: boolean, dtOnlyCurrent: boolean, dtMinDate: any, dtMaxDate: any ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;

        this.service.setPickerOptions(dtLocale, dtViewFormat, dtReturnObject, dtPosition,
            dtPositionOffset, dtMode, dtHourTime, dtTheme, dtPickerType, dtShowSeconds, dtOnlyCurrent, dtMinDate, dtMaxDate);
    }

    public confirm( close: boolean ): void {
        this.returnSelectedMoment();
        if (close === true) {
            this.cancelDialog();
        } else {
            this.dialogType = this.service.dtDialogType;
        }
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = this.service.dtDialogType;
        } else {
            this.dialogType = type;
        }
    }

    public setDate( moment: Moment ): void {
        this.service.setDate(moment);
        this.confirm(false);
    }

    public setTime( time: { hour: number, min: number, sec: number, meridian: string } ): void {
        this.service.setTime(time.hour, time.min, time.sec, time.meridian);
        if (this.service.dtPickerType === 'time') {
            this.confirm(true);
        } else {
            this.confirm(false);
        }
    }

    private returnSelectedMoment(): void {
        let m = this.selectedMoment || this.now;
        let selectedM = this.service.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
    }
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
