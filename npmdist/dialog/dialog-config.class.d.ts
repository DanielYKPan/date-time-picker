import { ViewContainerRef } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';
export interface DialogPosition {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
}
export declare class OwlDialogConfig {
    ariaDescribedBy?: string | null;
    autoFocus?: boolean;
    hasBackdrop?: boolean;
    backdropStyle?: any;
    data?: any;
    disableClose?: boolean;
    id?: string;
    role?: 'dialog' | 'alertdialog';
    paneClass?: string | string[];
    event?: MouseEvent;
    backdropClass?: string | string[];
    closeOnNavigation?: boolean;
    width?: string;
    height?: string;
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    position?: DialogPosition;
    scrollStrategy?: ScrollStrategy;
    viewContainerRef?: ViewContainerRef;
    constructor();
}
