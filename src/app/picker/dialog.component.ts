/**
 * dialog.component
 */

import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'date-time-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    providers: [PickerService],
})
export class DialogComponent implements OnInit {

    private show: boolean;
    private initialValue: string;
    private selectedMoment: Moment;
    private directiveInstance: any;
    private directiveElementRef: ElementRef;
    private now: Moment;

    private top: number;
    private left: number;
    private width: string;
    private height: string = 'auto';
    private position: string;

    public theme: string;
    public hourTime: '12' | '24';
    public positionOffset: string;
    public mode: 'popup' | 'dropdown' | 'inline';
    public returnObject: string;
    public dialogType: DialogType;

    private subId: Subscription;

    constructor( private el: ElementRef,
                 private service: PickerService ) {
    }

    public ngOnInit() {
        this.theme = this.service.dtTheme;
        this.hourTime = this.service.dtHourTime;
        this.positionOffset = this.service.dtPositionOffset;
        this.mode = this.service.dtMode;
        this.returnObject = this.service.dtReturnObject;
        moment.locale(this.service.dtLocale);
        this.subId = this.service.events.subscribe(
            ( selectedMoment: Moment ) => {
                this.selectedMoment = selectedMoment;
                this.returnSelectedMoment();
            }
        );
        this.openDialog(this.initialValue);
    }

    public openDialog( moment: any): void {
        this.show = true;

        if (this.mode === 'dropdown') {
            this.setDialogPosition();
        } else if (this.mode === 'inline') {
            this.setInlineDialogPosition();
        }
        this.dialogType = this.service.dtDialogType;
        this.service.setMoment(moment);
        return;
    }

    public cancelDialog(): void {
        this.show = false;
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any, dtLocal: string, dtViewFormat: string, dtReturnObject: string, dialogType: string,
                      dtPositionOffset: string, dtMode: 'popup' | 'dropdown' | 'inline',
                      dtHourTime: '12' | '24', dtTheme: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;

        this.service.setPickerOptions(dtLocal, dtViewFormat, dtReturnObject,
            dialogType, dtPositionOffset, dtMode, dtHourTime, dtTheme);

        // set now value
        this.now = moment();
    }

    public confirm(): void {
        this.returnSelectedMoment();
        this.cancelDialog();
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
        } else {
            this.dialogType = type;
        }
    }

    private setDialogPosition() {
        if (window.innerWidth < 768) {
            this.position = 'fixed';
            this.top = 0;
            this.left = 0;
            this.width = '100%';
            this.height = '100%';
        } else {
            let node = this.directiveElementRef.nativeElement;
            let position = 'static';
            let transform;
            let parentNode: any = null;
            let boxDirective;

            while (node !== null && node.tagName !== 'HTML') {
                position = window.getComputedStyle(node).getPropertyValue("position");
                transform = window.getComputedStyle(node).getPropertyValue("-webkit-transform");
                if (position !== 'static' && parentNode === null) {
                    parentNode = node;
                }
                if (position === 'fixed') {
                    break;
                }
                node = node.parentNode;
            }

            if (position !== 'fixed' || transform) {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
                if (parentNode === null) {
                    parentNode = node
                }
                let boxParent = this.createBox(parentNode, true);
                this.top = boxDirective.top - boxParent.top;
                this.left = boxDirective.left - boxParent.left;
            } else {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
                this.top = boxDirective.top;
                this.left = boxDirective.left;
                this.position = 'fixed';
            }

            this.top += boxDirective.height + 3;
            this.left += parseInt(this.positionOffset) / 100 * boxDirective.width;
            this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
        }
    }

    private setInlineDialogPosition() {
        this.position = 'relative';
        this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
    }

    private createBox( element: any, offset: boolean ) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    private returnSelectedMoment(): void {
        let selectedM = this.service.parseToReturnObjectType();
        this.directiveInstance.momentChanged(selectedM);
    }

    @HostListener('document:click', ['$event'])
    private onMouseDown( event: any ) {
        let target = event.srcElement || event.target;
        if (!this.el.nativeElement.contains(event.target) &&
            !(<Element> target).classList.contains('picker-day')
            && event.target != this.directiveElementRef.nativeElement) {
            this.show = false;
        }
    }
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
