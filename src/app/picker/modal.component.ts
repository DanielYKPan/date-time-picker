/**
 * modal.component
 */

import {
    Component, Output, OnInit, EventEmitter,
    ChangeDetectionStrategy
} from "@angular/core";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'picker-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
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
