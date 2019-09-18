/**
 * dialog.service
 */

import {
    ComponentRef,
    Inject,
    Injectable,
    InjectionToken,
    Injector,
    Optional,
    SkipSelf,
    TemplateRef
} from '@angular/core';
import { Location } from '@angular/common';
import { OwlDialogConfig } from './dialog-config.class';
import { OwlDialogRef } from './dialog-ref.class';
import { OwlDialogContainerComponent } from './dialog-container.component';
import { extendObject } from '../utils';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
    Overlay,
    OverlayConfig,
    OverlayContainer,
    OverlayRef,
    ScrollStrategy
} from '@angular/cdk/overlay';
import {
    ComponentPortal,
    ComponentType,
    PortalInjector
} from '@angular/cdk/portal';

export const OWL_DIALOG_DATA = new InjectionToken<any>('OwlDialogData');

/**
 * Injection token that determines the scroll handling while the dialog is open.
 * */
export const OWL_DIALOG_SCROLL_STRATEGY = new InjectionToken<
    () => ScrollStrategy
>('owl-dialog-scroll-strategy');

export function OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(
    overlay: Overlay
): () => ScrollStrategy {
    const fn = () => overlay.scrollStrategies.block();
    return fn;
}

/** @docs-private */
export const OWL_DIALOG_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DIALOG_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};

/** I
 * njection token that can be used to specify default dialog options.
 * */
export const OWL_DIALOG_DEFAULT_OPTIONS = new InjectionToken<OwlDialogConfig>(
    'owl-dialog-default-options'
);

@Injectable()
export class OwlDialogService {
    private ariaHiddenElements = new Map<Element, string | null>();

    private _openDialogsAtThisLevel: OwlDialogRef<any>[] = [];
    private _afterOpenAtThisLevel = new Subject<OwlDialogRef<any>>();
    private _afterAllClosedAtThisLevel = new Subject<void>();

    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): OwlDialogRef<any>[] {
        return this.parentDialog
            ? this.parentDialog.openDialogs
            : this._openDialogsAtThisLevel;
    }

    /** Stream that emits when a dialog has been opened. */
    get afterOpen(): Subject<OwlDialogRef<any>> {
        return this.parentDialog
            ? this.parentDialog.afterOpen
            : this._afterOpenAtThisLevel;
    }

    get _afterAllClosed(): any {
        const parent = this.parentDialog;
        return parent
            ? parent._afterAllClosed
            : this._afterAllClosedAtThisLevel;
    }

    /**
     * Stream that emits when all open dialog have finished closing.
     * Will emit on subscribe if there are no open dialogs to begin with.
     */

    afterAllClosed: Observable<{}> = defer(
        () =>
            this._openDialogsAtThisLevel.length
                ? this._afterAllClosed
                : this._afterAllClosed.pipe(startWith(undefined))
    );

    private scrollStrategy: () => ScrollStrategy;

    constructor(
        private overlay: Overlay,
        private injector: Injector,
        @Optional() private location: Location,
        @Inject(OWL_DIALOG_SCROLL_STRATEGY) scrollStrategy: any,
        @Optional()
        @Inject(OWL_DIALOG_DEFAULT_OPTIONS)
        private defaultOptions: OwlDialogConfig,
        @Optional()
        @SkipSelf()
        private parentDialog: OwlDialogService,
        private overlayContainer: OverlayContainer
    ) {
        this.scrollStrategy = scrollStrategy;
        if (!parentDialog && location) {
            location.subscribe(() => this.closeAll());
        }
    }

    public open<T>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: OwlDialogConfig
    ): OwlDialogRef<any> {
        config = applyConfigDefaults(config, this.defaultOptions);

        if (config.id && this.getDialogById(config.id)) {
            throw Error(
                `Dialog with id "${
                    config.id
                }" exists already. The dialog id must be unique.`
            );
        }

        const overlayRef = this.createOverlay(config);
        const dialogContainer = this.attachDialogContainer(overlayRef, config);
        const dialogRef = this.attachDialogContent<T>(
            componentOrTemplateRef,
            dialogContainer,
            overlayRef,
            config
        );

        if (!this.openDialogs.length) {
            this.hideNonDialogContentFromAssistiveTechnology();
        }

        this.openDialogs.push(dialogRef);
        dialogRef
            .afterClosed()
            .subscribe(() => this.removeOpenDialog(dialogRef));
        this.afterOpen.next(dialogRef);
        return dialogRef;
    }

    /**
     * Closes all of the currently-open dialogs.
     */
    public closeAll(): void {
        let i = this.openDialogs.length;

        while (i--) {
            this.openDialogs[i].close();
        }
    }

    /**
     * Finds an open dialog by its id.
     * @param id ID to use when looking up the dialog.
     */
    public getDialogById(id: string): OwlDialogRef<any> | undefined {
        return this.openDialogs.find(dialog => dialog.id === id);
    }

    private attachDialogContent<T>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        dialogContainer: OwlDialogContainerComponent,
        overlayRef: OverlayRef,
        config: OwlDialogConfig
    ) {
        const dialogRef = new OwlDialogRef<T>(
            overlayRef,
            dialogContainer,
            config.id,
            this.location
        );

        if (config.hasBackdrop) {
            overlayRef.backdropClick().subscribe(() => {
                if (!dialogRef.disableClose) {
                    dialogRef.close();
                }
            });
        }

        if (componentOrTemplateRef instanceof TemplateRef) {
        } else {
            const injector = this.createInjector<T>(
                config,
                dialogRef,
                dialogContainer
            );
            const contentRef = dialogContainer.attachComponentPortal(
                new ComponentPortal(componentOrTemplateRef, undefined, injector)
            );
            dialogRef.componentInstance = contentRef.instance;
        }

        dialogRef
            .updateSize(config.width, config.height)
            .updatePosition(config.position);

        return dialogRef;
    }

    private createInjector<T>(
        config: OwlDialogConfig,
        dialogRef: OwlDialogRef<T>,
        dialogContainer: OwlDialogContainerComponent
    ) {
        const userInjector =
            config &&
            config.viewContainerRef &&
            config.viewContainerRef.injector;
        const injectionTokens = new WeakMap();

        injectionTokens.set(OwlDialogRef, dialogRef);
        injectionTokens.set(OwlDialogContainerComponent, dialogContainer);
        injectionTokens.set(OWL_DIALOG_DATA, config.data);

        return new PortalInjector(
            userInjector || this.injector,
            injectionTokens
        );
    }

    private createOverlay(config: OwlDialogConfig): OverlayRef {
        const overlayConfig = this.getOverlayConfig(config);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(
        overlayRef: OverlayRef,
        config: OwlDialogConfig
    ): OwlDialogContainerComponent {
        const containerPortal = new ComponentPortal(
            OwlDialogContainerComponent,
            config.viewContainerRef
        );
        const containerRef: ComponentRef<
            OwlDialogContainerComponent
        > = overlayRef.attach(containerPortal);
        containerRef.instance.setConfig(config);

        return containerRef.instance;
    }

    private getOverlayConfig(dialogConfig: OwlDialogConfig): OverlayConfig {
        const state = new OverlayConfig({
            positionStrategy: this.overlay.position().global(),
            scrollStrategy:
                dialogConfig.scrollStrategy || this.scrollStrategy(),
            panelClass: dialogConfig.paneClass,
            hasBackdrop: dialogConfig.hasBackdrop,
            minWidth: dialogConfig.minWidth,
            minHeight: dialogConfig.minHeight,
            maxWidth: dialogConfig.maxWidth,
            maxHeight: dialogConfig.maxHeight
        });

        if (dialogConfig.backdropClass) {
            state.backdropClass = dialogConfig.backdropClass;
        }

        return state;
    }

    private removeOpenDialog(dialogRef: OwlDialogRef<any>): void {
        const index = this._openDialogsAtThisLevel.indexOf(dialogRef);

        if (index > -1) {
            this.openDialogs.splice(index, 1);
            // If all the dialogs were closed, remove/restore the `aria-hidden`
            // to a the siblings and emit to the `afterAllClosed` stream.
            if (!this.openDialogs.length) {
                this.ariaHiddenElements.forEach((previousValue, element) => {
                    if (previousValue) {
                        element.setAttribute('aria-hidden', previousValue);
                    } else {
                        element.removeAttribute('aria-hidden');
                    }
                });

                this.ariaHiddenElements.clear();
                this._afterAllClosed.next();
            }
        }
    }

    /**
     * Hides all of the content that isn't an overlay from assistive technology.
     */
    private hideNonDialogContentFromAssistiveTechnology() {
        const overlayContainer = this.overlayContainer.getContainerElement();

        // Ensure that the overlay container is attached to the DOM.
        if (overlayContainer.parentElement) {
            const siblings = overlayContainer.parentElement.children;

            for (let i = siblings.length - 1; i > -1; i--) {
                let sibling = siblings[i];

                if (
                    sibling !== overlayContainer &&
                    sibling.nodeName !== 'SCRIPT' &&
                    sibling.nodeName !== 'STYLE' &&
                    !sibling.hasAttribute('aria-live')
                ) {
                    this.ariaHiddenElements.set(
                        sibling,
                        sibling.getAttribute('aria-hidden')
                    );
                    sibling.setAttribute('aria-hidden', 'true');
                }
            }
        }
    }
}

/**
 * Applies default options to the dialog config.
 * @param config Config to be modified.
 * @param defaultOptions Default config setting
 * @returns The new configuration object.
 */
function applyConfigDefaults(
    config?: OwlDialogConfig,
    defaultOptions?: OwlDialogConfig
): OwlDialogConfig {
    return extendObject(new OwlDialogConfig(), config, defaultOptions);
}
