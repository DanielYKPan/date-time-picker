/**
 * dialog-config.class
 */
import { ViewContainerRef } from '@angular/core';

let uniqueId = 0;

export class OwlDialogConfig {

    /**
     * ID of the element that describes the dialog.
     * @type {string}
     * @default {null}
     * */
    public ariaDescribedBy?: string | null = null;

    /**
     * Whether to focus the dialog when the dialog is opened
     * @type {boolean}
     * @default {true}
     * */
    public autoFocus? = true;

    /** Whether the dialog's backdrop is transparent. */
    public transparentBackdrop? = false;

    /** Whether the dialog has a backdrop. */
    public hasBackdrop? = true;

    /** Custom class for the backdrop, */
    public backdropClass? = '';

    /**
     * Custom style for the backdrop
     * */
    public backdropStyle?: any;

    /** Data being injected into the child component. */
    public data?: any = null;

    /** Whether the user can use escape or clicking outside to close a modal. */
    public disableClose? = false;

    /**
     * ID for the modal. If omitted, a unique one will be generated.
     * @type {string}
     * */
    public id?: string;

    /**
     * The ARIA role of the dialog element.
     * @type {'dialog' | 'alertdialog'}
     * @default {'dialog'}
     * */
    public role?: 'dialog' | 'alertdialog' = 'dialog';

    /**
     * Custom class for the pane
     * */
    public paneClass? = '';

    /**
     * Custom style for the pane
     * */
    public paneStyle?: any;

    /**
     * Mouse Event
     * */
    public event?: MouseEvent = null;

    public viewContainerRef?: ViewContainerRef;

    constructor() {
        this.id = `owl-dialog-${uniqueId++}`;
    }
}
