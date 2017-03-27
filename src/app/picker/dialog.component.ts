/**
 * dialog.component
 */

import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./dialog.component.scss");
const myDpTpl: string = require("./dialog.component.html");
// webpack2_

@Component({
    selector: 'date-time-dialog',
    template: myDpTpl,
    styles: [myDpStyles],
})
export class DialogComponent implements OnInit {

    private show: boolean;
    private moment: Moment;
    private initialValue: string;
    private selectedMoment: Moment;
    private directiveInstance: any;
    private directiveElementRef: ElementRef;
    private now: Moment;
    private dialogType: DialogType;

    private dtLocale: string;
    private dtViewFormat: string;
    private dtReturnObject: string;
    private dtDialogType: DialogType;
    private dtPositionOffset: string;
    private dtMode: string;
    private dtHourTime: '12' | '24';
    private dtTheme: string;

    private top: number;
    private left: number;
    private width: string;
    private height: string = 'auto';
    private position: string;

    constructor( private el: ElementRef ) {
    }

    public ngOnInit() {
        this.openDialog(this.initialValue, false);
    }

    public openDialog( moment: any, emit: boolean = true ): void {
        this.show = true;

        if (this.dtMode === 'dropdown') {
            this.setDialogPosition();
            document.addEventListener('mousedown', ( event: any ) => {
                this.onMouseDown(event)
            });
        }
        this.dialogType = this.dtDialogType;
        this.setInitialMoment(moment);
        this.setMomentFromString(moment, emit);
        return;
    }

    public cancelDialog(): void {
        this.show = false;
        if (this.dtMode === 'dropdown') {
            document.removeEventListener('mousedown', ( event: any ) => {
                this.onMouseDown(event)
            });
        }
        return;
    }

    public setInitialMoment( value: any ) {
        this.initialValue = value;
    }

    public setDialog( instance: any, elementRef: ElementRef, initialValue: any,
                      dtLocale: string, dtViewFormat: string, dtReturnObject: string,
                      dtDialogType: string, dtMode: string, dtPositionOffset: string,
                      dtHourTime: '12' | '24', dtTheme: string ): void {
        this.directiveInstance = instance;
        this.directiveElementRef = elementRef;
        this.initialValue = initialValue;
        this.dtLocale = dtLocale;
        this.dtViewFormat = dtViewFormat;
        this.dtReturnObject = dtReturnObject;
        this.dtMode = dtMode;
        this.dtPositionOffset = dtPositionOffset;
        this.dtHourTime = dtHourTime;
        this.dtTheme = dtTheme;

        if (dtDialogType === 'time') {
            this.dtDialogType = DialogType.Time;
        } else {
            this.dtDialogType = DialogType.Date;
        }

        // set moment locale (default is en)
        moment.locale(this.dtLocale);

        // set now value
        this.now = moment();

    }

    public select( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        let daysDifference = moment.clone().startOf('date').diff(m.clone().startOf('date'), 'days');
        this.selectedMoment = m.add(daysDifference, 'd');
        let selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        return;
    }

    public confirm(): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : moment();
        let selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.cancelDialog();
    }

    public setTime( moment: Moment ): void {
        let m = this.selectedMoment ? this.selectedMoment.clone() : this.moment.clone();
        this.selectedMoment = m.hours(moment.hours()).minutes(moment.minutes());
        let selectedM = this.parseToReturnObjectType(m);
        this.directiveInstance.momentChanged(selectedM);
        this.dialogType = this.dtDialogType;
    }

    public toggleDialogType( type: DialogType ): void {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
        } else {
            this.dialogType = type;
        }
    }

    private setMomentFromString( value: any, emit: boolean = true ) {
        if (value) {
            this.moment = this.dtReturnObject === 'string' ? moment(value, this.dtViewFormat) :
                moment(value);
            this.selectedMoment = this.moment.clone();
        } else {
            this.moment = moment();
        }
    }

    private parseToReturnObjectType( day: Moment ): any {
        switch (this.dtReturnObject) {
            case 'js':
                return day.toDate();

            case 'string':
                return day.format(this.dtViewFormat);

            case 'moment':
                return day;

            case 'json':
                return day.toJSON();

            case 'array':
                return day.toArray();

            case 'iso':
                return day.toISOString();

            case 'object':
                return day.toObject();

            default:
                return day;
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
            this.left += parseInt(this.dtPositionOffset) / 100 * boxDirective.width;
            this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
        }
    }

    private createBox( element: any, offset: boolean ) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    private onMouseDown( event: any ) {
        if ((!this.isDescendant(this.el.nativeElement, event.target)
            && event.target != this.directiveElementRef.nativeElement)) {
            this.show = false;
        }
    }

    private isDescendant( parent: any, child: any ): boolean {
        let node: any = child.parentNode;
        while (node !== null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}

export enum DialogType {
    Time,
    Date,
    Month,
    Year,
}
