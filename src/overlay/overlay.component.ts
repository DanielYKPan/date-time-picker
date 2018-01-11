/**
 * overlay.component
 */


import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, HostBinding, OnDestroy, OnInit, Renderer2,
    ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DomHandlerService, ESCAPE } from '../utils';
import { ComponentType, PortalContainerDirective } from '../portal';
import { OwlOverlayPaneComponent } from './overlay-pane.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'owl-owl-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('backdropAnimate', [
            transition('void => enter, :enter', [
                style({opacity: 0}),
                animate(
                    '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({opacity: '*'})
                )
            ]),
            transition('enter => exit, :leave', [
                animate(
                    '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({opacity: 0})
                )
            ])
        ])
    ],
})

export class OwlOverlayComponent implements OnInit, OnDestroy {

    @HostBinding('class.owl-overlay-container') owlOverlayContainerClass = true;

    @ViewChild(PortalContainerDirective) portalContainer: PortalContainerDirective;

    private _attachedPanesAmount = 0;
    get attachedPanesAmount() {
        return this._attachedPanesAmount;
    }

    private _hasBackdrop = true;
    get hasBackdrop(): boolean {
        return this._hasBackdrop;
    }

    private _backdropClass = '';
    get backdropClass(): string {
        return this._backdropClass;
    }

    set backdropClass( val: string ) {
        this._backdropClass = val;
    }

    private _backdropStyle: any;
    get backdropStyle(): any {
        return this._backdropStyle;
    }

    set backdropStyle( val: any ) {
        this._backdropStyle = val;
    }

    private _transparentBackdrop = true;
    get transparentBackdrop(): boolean {
        return this._transparentBackdrop;
    }

    private _state: 'void' | 'enter' | 'exit' = 'enter';
    get state(): 'void' | 'enter' | 'exit' {
        return this._state;
    }

    get escapeKeyDown(): Observable<any> {
        return this._escapeKeyDown$.asObservable();
    }

    get backdropClick(): Observable<any> {
        return this._backdropClick$.asObservable();
    }

    private _backdropClick$ = new Subject<any>();
    private _escapeKeyDown$ = new Subject<any>();
    private documentEscapeListener: Function;

    constructor( private renderer: Renderer2,
                 private domHandler: DomHandlerService,
                 private changeDetector: ChangeDetectorRef ) {
    }

    public ngOnInit() {
        this.domHandler.blockScroll();
        this.bindDocumentEscapeListener();
    }

    public ngOnDestroy(): void {
        this.domHandler.resumeScroll();
        this.documentEscapeListener();
    }

    public attachPane( component: ComponentType<any> = OwlOverlayPaneComponent ): ComponentRef<any> {
        if (this.portalContainer) {
            return this.portalContainer.attachContainer(component);
        } else {
            return null;
        }
    }

    /**
     * Apply the backdrop config from dialogConfig
     * @param {any} config
     * @return {void}
     * */
    public applyBackdropConfig( config: any ): void {
        if (config.hasBackdrop !== this._hasBackdrop) {
            this._hasBackdrop = config.hasBackdrop;
        }

        if (config.backdropClass) {
            this._backdropClass = config.backdropClass;
        }

        if (config.backdropStyle) {
            this._backdropStyle = config.backdropStyle;
        }

        if (config.transparentBackdrop !== this._transparentBackdrop) {
            this._transparentBackdrop = config.transparentBackdrop;
        }

        this.changeDetector.markForCheck();
        return;
    }

    public onBackdropClick( event?: any ) {
        this._backdropClick$.next();
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    public startBackdropExitAnimation() {
        this._state = 'exit';
        this.changeDetector.markForCheck();
    }

    public onPaneAttached(): void {
        this._attachedPanesAmount += 1;
    }

    public onPaneDestroyed(): void {
        if (this._attachedPanesAmount > 0) {
            this._attachedPanesAmount -= 1;
        }
    }

    private bindDocumentEscapeListener(): void {
        this.documentEscapeListener = this.renderer.listen('document', 'keydown', ( event ) => {
            if (event.keyCode === ESCAPE) {
                this._escapeKeyDown$.next();
            }
        });
        return;
    }
}
