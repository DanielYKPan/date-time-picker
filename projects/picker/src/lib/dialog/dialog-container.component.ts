/**
 * dialog-container.component
 */

import {
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  OnInit,
  Optional,
  signal,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import {
    BasePortalOutlet,
    CdkPortalOutlet,
    ComponentPortal,
    TemplatePortal,
} from '@angular/cdk/portal';
import { OwlDateTimeContainerComponent } from '../date-time/date-time-picker-container.component';
import { IDateTimePickerAnimationEvent } from '../date-time/date-time-picker-animation-event';
import { OwlDialogConfigInterface } from './dialog-config.class';

@Component({
    selector: 'owl-dialog-container',
    templateUrl: './dialog-container.component.html',
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Eager,
    host: {
        '[class.owl-dialog-container]': 'owlDialogContainerClass',
        '[attr.tabindex]': 'owlDialogContainerTabIndex',
        '[attr.id]': 'owlDialogContainerId',
        '[attr.role]': 'owlDialogContainerRole',
        '[attr.aria-labelledby]': 'owlDialogContainerAriaLabelledby',
        '[attr.aria-describedby]': 'owlDialogContainerAriaDescribedby'
    }
})
export class OwlDialogContainerComponent extends BasePortalOutlet
    implements OnInit {
    @ViewChild(CdkPortalOutlet, { static: true })
    portalOutlet: CdkPortalOutlet | null = null;

    /** The class that traps and manages focus within the dialog. */
    private focusTrap: FocusTrap;

    /** ID of the element that should be considered as the dialog's label. */
    public ariaLabelledBy: string | null = null;

    /** Emits when an animation state changes. */
    public animationStateChanged = new EventEmitter<IDateTimePickerAnimationEvent>();

    public isAnimating = signal(false);

    private _config: OwlDialogConfigInterface;
    private _component: ComponentRef<unknown>;
    get config(): OwlDialogConfigInterface {
        return this._config;
    }

    // for animation purpose
    private params: any = {
        x: '0px',
        y: '0px',
        ox: '50%',
        oy: '50%',
        scale: 0
    };

    // A variable to hold the focused element before the dialog was open.
    // This would help us to refocus back to element when the dialog was closed.
    private elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

    get owlDialogContainerClass(): boolean {
        return true;
    }

    get owlDialogContainerTabIndex(): number {
        return -1;
    }

    get owlDialogContainerId(): string {
        return this._config.id;
    }

    get owlDialogContainerRole(): string {
        return this._config.role || null;
    }

    get owlDialogContainerAriaLabelledby(): string {
        return this.ariaLabelledBy;
    }

    get owlDialogContainerAriaDescribedby(): string {
        return this._config.ariaDescribedBy || null;
    }

    constructor(
        private elementRef: ElementRef,
        private focusTrapFactory: FocusTrapFactory,
        @Optional()
        @Inject(DOCUMENT)
        private document: any,
    ) {
        super();
    }

    public ngOnInit() {}

    /**
     * Attach a ComponentPortal as content to this dialog container.
     */
    public attachComponentPortal<T>(
        portal: ComponentPortal<T>,
    ): ComponentRef<T> {
        if (this.portalOutlet.hasAttached()) {
            throw Error(
                'Attempting to attach dialog content after content is already attached',
            );
        }

        this.savePreviouslyFocusedElement();
        const component = this.portalOutlet.attachComponentPortal(portal);
        const pickerContainer = component.instance as OwlDateTimeContainerComponent<unknown>;
        pickerContainer.animationStateChanged.subscribe(state => this.onAnimationDone(state));
        this._component = component;
        return component;
    }

    public attachTemplatePortal<C>(
        portal: TemplatePortal<C>,
    ): EmbeddedViewRef<C> {
        throw new Error('Method not implemented.');
    }

    public setConfig(config: OwlDialogConfigInterface): void {
        this._config = config;

        if (config.event) {
            this.calculateZoomOrigin(event);
        }
    }

    public onAnimationStart(event: IDateTimePickerAnimationEvent): void {
        this.isAnimating.set(true);
        this.animationStateChanged.emit(event);
    }

    public onAnimationDone(event: IDateTimePickerAnimationEvent): void {
        if (event.toState === 'enter') {
            this.trapFocus();
        } else if (event.toState === 'leave') {
            this.restoreFocus();
        }

        this.animationStateChanged.emit(event);
        this.isAnimating.set(false);
    }

    public startExitAnimation() {
        this._component.destroy();
    }

    /**
     * Calculate origin used in the `zoomFadeInFrom()`
     * for animation purpose
     */
    private calculateZoomOrigin(event: any): void {
        if (!event) {
            return;
        }

        const clientX = event.clientX;
        const clientY = event.clientY;

        const wh = window.innerWidth / 2;
        const hh = window.innerHeight / 2;
        const x = clientX - wh;
        const y = clientY - hh;
        const ox = clientX / window.innerWidth;
        const oy = clientY / window.innerHeight;

        this.params.x = `${x}px`;
        this.params.y = `${y}px`;
        this.params.ox = `${ox * 100}%`;
        this.params.oy = `${oy * 100}%`;
        this.params.scale = 0;

        return;
    }

    /**
     * Save the focused element before dialog was open
     */
    private savePreviouslyFocusedElement(): void {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document
                .activeElement as HTMLElement;

            Promise.resolve().then(() => this.elementRef.nativeElement.focus());
        }
    }

    private trapFocus(): void {
        if (!this.focusTrap) {
            this.focusTrap = this.focusTrapFactory.create(
                this.elementRef.nativeElement,
            );
        }

        if (this._config.autoFocus) {
            this.focusTrap.focusInitialElementWhenReady();
        }
    }

    private restoreFocus(): void {
        const toFocus = this.elementFocusedBeforeDialogWasOpened;

        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }

        if (this.focusTrap) {
            this.focusTrap.destroy();
        }
    }
}
