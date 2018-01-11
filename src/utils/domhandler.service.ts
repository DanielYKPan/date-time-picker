/**
 * domhandler.service
 */

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class DomHandlerService {

    constructor( @Inject(DOCUMENT) private document: any ) {
    }

    public relativePosition( element: any, target: any ): void {
        const elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        const targetHeight = target.offsetHeight;
        const targetWidth = target.offsetWidth;
        const targetOffset = target.getBoundingClientRect();
        const viewport = this.getViewport();
        let top, left;

        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = 0;
            }
        } else {
            top = targetHeight;
        }


        if ((targetOffset.left + elementDimensions.width) > viewport.width) {
            left = targetWidth - elementDimensions.width;
        } else {
            left = 0;
        }

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    public absolutePosition( element: any, target: any ): void {
        const elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        const elementOuterHeight = elementDimensions.height;
        const elementOuterWidth = elementDimensions.width;
        const targetOuterHeight = target.offsetHeight;
        const targetOuterWidth = target.offsetWidth;
        const targetOffset = target.getBoundingClientRect();
        const windowScrollTop = this.getWindowScrollTop();
        const windowScrollLeft = this.getWindowScrollLeft();
        const viewport = this.getViewport();
        let top, left;

        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
            if (top < 0) {
                top = 0 + windowScrollTop;
            }
        } else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
        }

        if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width) {
            left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
        } else {
            left = targetOffset.left + windowScrollLeft;
        }

        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }

    public getHiddenElementDimensions( element: any ): any {
        const dimensions: any = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';

        return dimensions;
    }

    public getViewport(): any {
        const win = window,
            d = this.document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;

        return {width: w, height: h};
    }

    public getWindowScrollTop(): number {
        const doc = this.document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    public getWindowScrollLeft(): number {
        const doc = this.document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

    public appendChild( element: any, target: any ) {
        if (this.isElement(target)) {
            target.appendChild(element);
        } else if (target.el && target.el.nativeElement) {
            target.el.nativeElement.appendChild(element);
        } else {
            throw Error('Cannot append ' + target + ' to ' + element);
        }

    }

    public isElement( obj: any ) {
        return (typeof HTMLElement === 'object' ? obj instanceof HTMLElement :
                obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        );
    }

    public getOuterWidth( el: any, margin?: any ) {
        let width = el.offsetWidth;

        if (margin) {
            const style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }

        return width;
    }

    public getOuterHeight( el: any, margin?: any ) {
        let height = el.offsetHeight;

        if (margin) {
            const style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }

        return height;
    }

    public findSingle( element: HTMLElement, selector: string ): any {
        return element.querySelector(selector);
    }

    public scrollInView( container: any, item: any ) {
        const borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
        const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
        const paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
        const paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const offset = (itemRect.top + this.document.body.scrollTop) -
            (containerRect.top + this.document.body.scrollTop) - borderTop - paddingTop;
        const scroll = container.scrollTop;
        const elementHeight = container.clientHeight;
        const itemHeight = this.getOuterHeight(item);

        if (offset < 0) {
            container.scrollTop = scroll + offset;
        } else if ((offset + itemHeight) > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }

    public getUserAgent(): string {
        return navigator.userAgent;
    }

    public width( el: HTMLElement ): number {
        let width = el.offsetWidth;
        const style = getComputedStyle(el);

        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }

    public getViewportScrollPosition( documentRect?: any ): any {
        if (!documentRect) {
            documentRect = this.document.documentElement.getBoundingClientRect();
        }

        const top = -((documentRect)).top || this.document.body.scrollTop || window.scrollY ||
            this.document.documentElement.scrollTop || 0;

        const left = -((documentRect)).left || this.document.body.scrollLeft || window.scrollX ||
            this.document.documentElement.scrollLeft || 0;

        return {top, left};
    }

    public blockScroll(): void {
        const root = this.document.documentElement;
        root.classList.add('owl-global-scrollblock');
    }

    public resumeScroll(): void {
        const root = this.document.documentElement;
        root.classList.remove('owl-global-scrollblock');
    }
}
