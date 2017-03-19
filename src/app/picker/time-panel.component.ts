/**
 * time-panel.component
 */

import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Moment } from 'moment/moment';
import { DialogType } from './dialog.component';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./time-panel.component.scss");
const myDpTpl: string = require("./time-panel.component.html");
// webpack2_

@Component({
    selector: 'dialog-time-panel',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: myDpTpl,
    styles: [myDpStyles],
})
export class TimePanelComponent implements OnInit {

    @Input() moment: Moment;
    @Input() now: Moment;
    @Input() dialogType: DialogType;

    hourValue: number;
    minValue: number;
    meridianValue: string;

    constructor() {
    }

    public ngOnInit() {
        if (this.moment.hours() <= 11) {
            this.hourValue = this.moment.hours();
        } else if (this.moment.hours() > 12) {
            this.hourValue = this.moment.hours() - 12;
        } else if (this.moment.hours() === 0 || this.moment.hours() === 12) {
            this.hourValue = 12;
        }

        this.minValue = this.moment.minutes();
        this.meridianValue = this.moment.format('A');
    }

    public setMeridian( meridian: string ): void {
        this.meridianValue = meridian;
    }
}
