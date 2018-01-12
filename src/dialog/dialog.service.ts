/**
 * dialog.service
 */

import {
    ComponentRef, Injectable, InjectionToken, Injector, Optional, SkipSelf, TemplateRef
} from '@angular/core';
import { Location } from '@angular/common';
import { OwlOverlayComponent } from '../overlay';
import { OwlDialogConfig } from './dialog-config.class';
import { OwlDialogRef } from './dialog-ref.class';
import { ComponentPortal, PortalInjector } from '../portal';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { InjectionService, extendObject } from '../utils';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { startWith } from 'rxjs/operators';

export const OWL_DIALOG_DATA = new InjectionToken<any>('OwlDialogData');

export interface ComponentType<T> {
    new ( ...args: any[] ): T;
}

@Injectable()
export class OwlDialogService {

    private overlayRef: ComponentRef<OwlOverlayComponent>;
    private _openDialogsAtThisLevel: OwlDialogRef<any>[] = [];
    private _afterOpenAtThisLevel = new Subject<OwlDialogRef<any>>();
    private _afterAllClosedAtThisLevel = new Subject<void>();

    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): OwlDialogRef<any>[] {
        return this.parentDialog ? this.parentDialog._openDialogsAtThisLevel : this._openDialogsAtThisLevel;
    }

    /** Stream that emits when a dialog has been opened. */
    get afterOpen(): Subject<OwlDialogRef<any>> {
        return this.parentDialog ? this.parentDialog.afterOpen : this._afterOpenAtThisLevel;
    }

    get _afterAllClosed(): any {
        const parent = this.parentDialog;
        return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
    }

    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */
    afterAllClosed: Observable<void> = defer<void>(() => this._openDialogsAtThisLevel.length ?
        this._afterAllClosed :
        this._afterAllClosed.pipe(startWith(undefined)));

    constructor( private injector: Injector,
                 private injectionService: InjectionService,
                 @Optional() location: Location,
                 @Optional() @SkipSelf() private parentDialog: OwlDialogService ) {
        if (!parentDialog && location) {
            location.subscribe(() => this.closeAll());
        }
    }

    public open<T>( componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
                    config?: OwlDialogConfig ): OwlDialogRef<any> {

        const inProgressDialog = this.openDialogs.find(dialog => dialog.isAnimating());

        // If there's a dialog that is in the process of being opened, return it instead.
        if (inProgressDialog) {
            return inProgressDialog;
        }

        config = applyConfigDefaults(config);

        // create the overlay component
        if (!this.overlayRef) {
            this.overlayRef = this.createOverlay();
        }

        // apply backdrop config to OverlayComponent
        this.overlayRef.instance.applyBackdropConfig(config);

        // attach dialog container to overlay
        const dialogContainerRef = this.overlayRef.instance.attachPane(OwlDialogContainerComponent);
        dialogContainerRef.instance.setConfig(config);

        // attach dialog content to container/**/
        const dialogRef = this.attachDialogContent(componentOrTemplateRef, dialogContainerRef, config);

        this._openDialogsAtThisLevel.push(dialogRef);

        // Listen to backdrop click stream
        this.overlayRef.instance.backdropClick.subscribe(() => this.handleDialogClose());

        // If the closing dialogRef is the last opening dialog,
        // start the overlay backdrop exit animation
        dialogRef.beforeClose().subscribe(() => {
            if (this._openDialogsAtThisLevel.length === 1) {
                this.overlayRef.instance.startBackdropExitAnimation();
            }
        });

        // Listen to ESCAPE keydown stream
        this.overlayRef.instance.escapeKeyDown.subscribe(() => this.handleDialogClose());

        // after the dialog close animation, remove the dialog
        dialogRef.afterClosed().subscribe(() => this.removeOpenDialog(dialogRef));

        this.afterOpen.next(dialogRef);

        return dialogRef;
    }

    /**
     * Closes all of the currently-open dialogs.
     */
    public closeAll(): void {
        let i = this._openDialogsAtThisLevel.length;

        while (i--) {
            this._openDialogsAtThisLevel[i].close();
        }
    }

    public disposeOverlay(): void {
        if (this.overlayRef) {
            this.overlayRef.destroy();
            this.overlayRef = null;
        }
    }

    private attachDialogContent<T>( componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
                                    containerRef: ComponentRef<OwlDialogContainerComponent>,
                                    config: OwlDialogConfig ) {
        const container = containerRef.instance;
        const dialogRef = new OwlDialogRef<T>(containerRef, config.id);

        if (componentOrTemplateRef instanceof TemplateRef) {

        } else {
            const injector = this.createInjector<T>(config, dialogRef, container);
            const contentRef = container.attachComponentPortal(
                new ComponentPortal(componentOrTemplateRef, undefined, injector)
            );
            dialogRef.componentInstance = contentRef.instance;
        }

        return dialogRef;
    }

    private createInjector<T>( config: OwlDialogConfig, dialogRef: OwlDialogRef<T>, container: OwlDialogContainerComponent ) {
        const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
        const injectionTokens = new WeakMap();

        injectionTokens.set(OwlDialogRef, dialogRef);
        injectionTokens.set(OwlDialogContainerComponent, container);
        injectionTokens.set(OWL_DIALOG_DATA, config.data);

        return new PortalInjector(userInjector || this.injector, injectionTokens);
    }

    private removeOpenDialog( dialogRef: OwlDialogRef<any> ): void {
        const index = this._openDialogsAtThisLevel.indexOf(dialogRef);

        if (index > -1) {
            this._openDialogsAtThisLevel.splice(index, 1);
            dialogRef.containerRef.destroy();

            // If all the open dialogs is closed, destroy the overlay component
            if (!this._openDialogsAtThisLevel.length) {
                this._afterAllClosed.next();
                this.disposeOverlay();
            }
        }
    }

    /**
     * Handles global ESCAPE key presses while there are open dialogs. Closes the
     * top dialog when the user presses escape.
     */
    private handleDialogClose(): void {
        const topDialog = this._openDialogsAtThisLevel[this._openDialogsAtThisLevel.length - 1];

        if (topDialog && !topDialog.disableClose) {
            topDialog.close();
        }
    }

    private createOverlay() {
        return this.injectionService.appendComponent(OwlOverlayComponent);
    }
}

/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @returns The new configuration object.
 */
function applyConfigDefaults( config?: OwlDialogConfig ): OwlDialogConfig {
    return extendObject(new OwlDialogConfig(), config);
}
