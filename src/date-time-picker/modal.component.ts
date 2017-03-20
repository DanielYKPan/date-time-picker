/**
 * modal.component
 */

import {
    Component, Output, OnInit, EventEmitter, trigger, transition, style, state, animate,
    ChangeDetectionStrategy
} from "@angular/core";

// webpack1_
declare let require: any;
const myDpStyles: string = require("./modal.component.scss");
const myDpTpl: string = require("./modal.component.html");
// webpack2_

@Component({
    selector: 'picker-modal',
    template: myDpTpl,
    styles: [myDpStyles],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('modalAnimation', [
            state('*',
                style({
                    opacity: 1,
                    transform: 'translate(-50%, 0)',
                })
            ),
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'translate(-50%, -100%)',
                }),
                animate('0.3s cubic-bezier(.13,.68,1,1.53)')
            ])
        ])
    ],
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
