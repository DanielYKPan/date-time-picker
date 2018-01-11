/**
 * dialog-container.component
 */

import {
    ChangeDetectorRef, Component, ComponentRef, EmbeddedViewRef, EventEmitter, forwardRef, OnInit, Optional,
    ViewChild, Inject, ElementRef, HostBinding, HostListener, NgZone
} from '@angular/core';
import {
    animate, AnimationEvent, query, style, transition, trigger, keyframes,
    animateChild
} from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { OwlDialogConfig } from './dialog-config.class';
import { BasePortalHost, ComponentPortal, TemplatePortal, PortalHostDirective } from '../portal';
import { take } from 'rxjs/operators';

const zoomFadeIn = {opacity: 0, transform: 'translateX({{ x }}) translateY({{ y }}) scale({{scale}})'};
const zoomFadeInFrom = {...zoomFadeIn, transformOrigin: '{{ ox }} {{ oy }}'};
const easeInFor = ( duration: number ) => `${duration}ms cubic-bezier(0.35, 0, 0.25, 1)`;

@Component({
    selector: 'owl-dialog-container',
    templateUrl: './dialog-container.component.html',
    animations: [
        trigger('slideModal', [
            transition('void => enter', [
                query('.owl-overlay-dialog-container', style(zoomFadeInFrom)),
                query('.owl-overlay-dialog-container',
                    animate(easeInFor(300), style('*'))
                ),
                query('.owl-overlay-dialog-container',
                    animate(150, keyframes([
                        style({transform: 'scale(1)', offset: 0}),
                        style({transform: 'scale(1.05)', offset: 0.3}),
                        style({transform: 'scale(.95)', offset: 0.8}),
                        style({transform: 'scale(1)', offset: 1.0})
                    ]))
                ),
                animateChild()
            ], {params: {x: '0px', y: '0px', ox: '50%', oy: '50%', scale: 1}}),
            transition('enter => exit', [
                animateChild(),
                query('.owl-overlay-dialog-container',
                    animate(200, style(zoomFadeIn))
                )
            ], {params: {x: '0px', y: '0px', ox: '50%', oy: '50%'}})
        ])
    ]
})

export class OwlDialogContainerComponent extends BasePortalHost implements OnInit {

    /** The portal host inside of this container into which the dialog content will be loaded. */
    @ViewChild(forwardRef(() => PortalHostDirective)) portalHost: PortalHostDirective;

    /** ID of the element that should be considered as the dialog's label. */
    public ariaLabelledBy: string | null = null;

    /** Emits when an animation state changes. */
    public animationStateChanged = new EventEmitter<AnimationEvent>();

    public config: OwlDialogConfig;

    public isAnimating = false;

    private state: 'void' | 'enter' | 'exit' = 'enter';

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

    @HostBinding('class.owl-global-overlay-wrapper')
    get owlGlobalOverlayWrapperClass(): boolean {
        return true;
    }

    @HostBinding('attr.tabindex')
    get owlDialogContainerTabIndex(): number {
        return -1;
    }

    @HostBinding('attr.id')
    get owlDialogContainerId(): string {
        return this.config.id;
    }

    @HostBinding('attr.role')
    get owlDialogContainerRole(): string {
        return this.config.role || null;
    }

    @HostBinding('attr.aria-labelledby')
    get owlDialogContainerAriaLabelledby(): string {
        return this.ariaLabelledBy;
    }

    @HostBinding('attr.aria-describedby')
    get owlDialogContainerAriaDescribedby(): string {
        return this.config.ariaDescribedBy || null;
    }

    @HostBinding('@slideModal')
    get owlDialogContainerAnimation(): any {
        return {value: this.state, params: this.params};
    }

    constructor( private changeDetector: ChangeDetectorRef,
                 private elementRef: ElementRef,
                 private ngZone: NgZone,
                 @Optional() @Inject(DOCUMENT) private document: any ) {
        super();
    }

    public ngOnInit() {
    }

    /**
     * Attach a ComponentPortal as content to this dialog container.
     * @param portal Portal to be attached as the dialog content.
     */
    public attachComponentPortal<T>( portal: ComponentPortal<T> ): ComponentRef<T> {
        if (this.portalHost.hasAttached()) {
            throw Error('Attempting to attach dialog content after content is already attached');
        }

        this.savePreviouslyFocusedElement();
        return this.portalHost.attachComponentPortal(portal);
    }

    public attachTemplatePortal<C>( portal: TemplatePortal<C> ): EmbeddedViewRef<C> {
        throw new Error('Method not implemented.');
    }

    public setConfig( config: OwlDialogConfig ): void {
        this.config = config;

        if (config.event) {
            this.calculateZoomOrigin(event);
        }
    }

    @HostListener('@slideModal.start', ['$event'])
    public onAnimationStart( event: AnimationEvent ): void {
        this.isAnimating = true;
        this.animationStateChanged.emit(event);
    }

    @HostListener('@slideModal.done', ['$event'])
    public onAnimationDone( event: AnimationEvent ): void {
        if (event.toState === 'enter') {
            this.focusDialog();
        } else if (event.toState === 'exit') {
            this.restoreFocus();
        }

        this.animationStateChanged.emit(event);
        this.isAnimating = false;
    }

    public startExitAnimation() {
        this.state = 'exit';
        this.changeDetector.markForCheck();
    }

    /**
     * Calculate origin used in the `zoomFadeInFrom()`
     * for animation purpose
     * @param {any} event
     * @return {void}
     */
    private calculateZoomOrigin( event: any ): void {

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
     * @return {void}
     * */
    private savePreviouslyFocusedElement(): void {
        if (this.document) {
            this.elementFocusedBeforeDialogWasOpened = this.document.activeElement as HTMLElement;
        }
    }

    private focusDialog(): void {
        if (this.config.autoFocus) {
            this.elementRef.nativeElement.focus();
        }
    }

    private restoreFocus(): void {
        const toFocus = this.elementFocusedBeforeDialogWasOpened;

        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (toFocus && typeof toFocus.focus === 'function') {
            toFocus.focus();
        }
    }
}
