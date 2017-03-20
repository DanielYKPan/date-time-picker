import { OnInit, EventEmitter } from "@angular/core";
export declare class ModalComponent implements OnInit {
    onOverlayClick: EventEmitter<boolean>;
    constructor();
    ngOnInit(): void;
    closeModal(): void;
}
