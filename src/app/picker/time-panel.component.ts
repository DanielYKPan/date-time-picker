/**
 * time-panel.component
 */

import { Component, OnInit } from '@angular/core';

// webpack1_
declare let require: any;
const myDpStyles: string = require("./time-panel.component.scss");
const myDpTpl: string = require("./time-panel.component.html");
// webpack2_

@Component({
    selector: 'dialog-time-panel',
    template: myDpTpl,
    styles: [myDpStyles],
})
export class TimePanelComponent implements OnInit {
    constructor() {
    }

    public ngOnInit() {
    }

    public lowValueChange( event: number ): void {
        console.log(event);
    }
}
