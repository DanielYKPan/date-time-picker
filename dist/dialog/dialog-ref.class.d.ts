import { Location } from '@angular/common';
import { OverlayRef } from '@angular/cdk/overlay';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { DialogPosition } from './dialog-config.class';
import { Observable } from 'rxjs';
export declare class OwlDialogRef<T> {
    private overlayRef;
    private container;
    readonly id: string;
    private result;
    private _beforeClose$;
    private _afterOpen$;
    private _afterClosed$;
    private locationChanged;
    componentInstance: T;
    disableClose: boolean;
    constructor(overlayRef: OverlayRef, container: OwlDialogContainerComponent, id: string, location?: Location);
    close(dialogResult?: any): void;
    backdropClick(): Observable<any>;
    keydownEvents(): Observable<KeyboardEvent>;
    updatePosition(position?: DialogPosition): this;
    updateSize(width?: string, height?: string): this;
    isAnimating(): boolean;
    afterOpen(): Observable<any>;
    beforeClose(): Observable<any>;
    afterClosed(): Observable<any>;
    private getPositionStrategy;
}
