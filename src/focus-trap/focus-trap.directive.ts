/**
 * focus-trap.directive
 */

import { AfterContentInit, Directive, ElementRef, Inject, Input, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FocusTrap } from './focus-trap.class';
import { InteractivityChecker } from './interactivity-checker';

@Directive({
    selector: '[owlFocusTrap]',
    exportAs: 'owlFocusTrap',
})
export class OwlFocusTrapDirective implements AfterContentInit, OnDestroy {

    private focusTrap: FocusTrap;

    /** Whether the focus trap is active. */
    @Input('owlFocusTrap')
    get enabled(): boolean {
        return this.focusTrap.enabled;
    }

    set enabled( value: boolean ) {
        this.focusTrap.enabled = value;
    }

    constructor( private elmRef: ElementRef,
                 private ngZone: NgZone,
                 private renderer: Renderer2,
                 private checker: InteractivityChecker,
                 @Inject(DOCUMENT) private document: any ) {

        this.focusTrap = new FocusTrap(this.elmRef.nativeElement, this.ngZone, this.renderer, this.checker, this.document);
    }

    public ngAfterContentInit(): void {
        this.focusTrap.attachAnchors();
    }

    public ngOnDestroy(): void {
        this.focusTrap.destroy();
    }
}
