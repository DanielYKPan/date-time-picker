/**
 * modal.component
 */

import { Component, Output, OnInit, EventEmitter } from "@angular/core";

// webpack1_
declare let require: any;
const myDpStyles: string = require("./modal.component.scss");
const myDpTpl: string = require("./modal.component.html");
// webpack2_

@Component({
    selector: 'picker-modal',
    template: myDpTpl,
    styles: [myDpStyles],
})

export class ModalComponent implements OnInit {

    @Output() onOverlayClick = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit() {
    }

    closeModal() {
        this.onOverlayClick.emit(false);
    }
}
