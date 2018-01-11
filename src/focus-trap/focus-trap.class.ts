/**
 * focus-trap.class
 */
import { NgZone, Renderer2 } from '@angular/core';
import { InteractivityChecker } from './interactivity-checker';

export class FocusTrap {

    private startAnchor: HTMLElement | null;
    private endAnchor: HTMLElement | null;

    private _enabled = true;
    get enabled() {
        return this._enabled;
    }

    set enabled( value: boolean ) {
        this._enabled = value;

        if (this.startAnchor && this.endAnchor) {
            this.startAnchor.tabIndex = this.endAnchor.tabIndex = this._enabled ? 0 : -1;
        }
    }

    constructor( private element: HTMLElement,
                 private ngZone: NgZone,
                 private renderer: Renderer2,
                 private checker: InteractivityChecker,
                 private document: Document ) {
    }

    public attachAnchors(): void {
        if (!this.startAnchor) {
            this.startAnchor = this.createAnchor();
        }

        if (!this.endAnchor) {
            this.endAnchor = this.createAnchor();
        }

        this.ngZone.runOutsideAngular(() => {

            this.renderer.listen(this.startAnchor!, 'focus', () => {
                this.focusLastTabbableElement();
            });


            this.renderer.listen(this.endAnchor!, 'focus', () => {
                this.focusFirstTabbableElement();
            });

            const parent = this.renderer.parentNode(this.element);
            if (parent) {
                this.renderer.insertBefore(parent, this.startAnchor!, this.element);
                this.renderer.insertBefore(parent, this.endAnchor!, this.element.nextSibling);
            }
        });
    }

    public destroy(): void {
        if (this.startAnchor) {
            const startParent = this.renderer.parentNode(this.startAnchor);
            this.renderer.removeChild(startParent, this.startAnchor);
        }

        if (this.endAnchor) {
            const endParent = this.renderer.parentNode(this.endAnchor);
            this.renderer.removeChild(endParent, this.endAnchor);
        }

        this.startAnchor = this.endAnchor = null;
    }

    /**
     * Focuses the first tabbable element within the focus trap region.
     * @returns Whether focus was moved successfuly.
     */
    private focusFirstTabbableElement(): boolean {
        const redirectToElement = this.getRegionBoundary('start');

        if (redirectToElement) {
            redirectToElement.focus();
        }

        return !!redirectToElement;
    }

    /**
     * Focused the last tabbable element with in the focus trap region
     * @returns Whether focus was moved successfuly.
     * */
    private focusLastTabbableElement(): boolean {
        const redirectToElement = this.getRegionBoundary('end');

        if (redirectToElement) {
            redirectToElement.focus();
        }

        return !!redirectToElement;
    }

    /**
     * Get the specified boundary element of the trapped region.
     * @param {'start' | 'end'} boundary -- The boundary to get (start or end of trapped region).
     * @return {HTMLElement} The boundary element.
     */
    private getRegionBoundary( boundary: 'start' | 'end' ): HTMLElement {
        if (boundary === 'start') {
            return this.getFirstTabbableElement(this.element);
        } else {
            return this.getLastTabbableElement(this.element);
        }
    }

    /**
     * Get the first tabbable element from a DOM subtree (inclusive).
     * */
    private getFirstTabbableElement( target: HTMLElement ): HTMLElement {
        if (this.checker.isFocusable(target) && this.checker.isTabbable(target)) {
            return target;
        }

        const children = target.children || target.childNodes;

        for (let i = 0; i < children.length; i++) {
            const tabbableChild = children[i].nodeType === Node.ELEMENT_NODE ?
                this.getFirstTabbableElement(children[i] as HTMLElement) :
                null;

            if (tabbableChild) {
                return tabbableChild;
            }
        }

        return null;
    }

    /**
     * Get the last tabbable element from a DOM subtree (inclusive).
     * */
    private getLastTabbableElement( target: HTMLElement ): HTMLElement {
        if (this.checker.isFocusable(target) && this.checker.isTabbable(target)) {
            return target;
        }

        const children = target.children || target.childNodes;

        for (let i = children.length - 1; i >= 0; i--) {
            const tabbableChild = children[i].nodeType === Node.ELEMENT_NODE ?
                this.getLastTabbableElement(children[i] as HTMLElement) :
                null;

            if (tabbableChild) {
                return tabbableChild;
            }
        }

        return null;
    }

    /**
     * Creates an anchor element.
     * @return {HTMLElement}
     * */
    private createAnchor(): HTMLElement {
        const anchor = this.renderer.createElement('div');
        const tabIndex = this._enabled ? '0' : '-1';
        this.renderer.setAttribute(anchor, 'tabindex', tabIndex);
        this.renderer.addClass(anchor, 'owl-hidden-accessible');
        this.renderer.addClass(anchor, 'owl-focus-trap-anchor');
        return anchor;
    }
}
