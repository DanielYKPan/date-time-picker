/**
 * dialog-position.directive
 */

import { AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PickerService } from './picker.service';

@Directive({
    selector: '[dialogPosition]',
})
export class DialogPositionDirective implements OnInit, AfterViewInit {

    @Input() directiveElementRef: ElementRef;

    private dialogPosition: 'top' | 'right' | 'bottom' | 'left';
    private dialogPositionOffset: string;
    private dialogHeight: number;
    private dialogWidth: number;
    private mode: 'popup' | 'dropdown' | 'inline';
    private top: number;
    private left: number;
    private width: string;
    private height: string = 'auto';
    private position: string;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
    }

    public ngOnInit(): void {
        this.dialogPosition = this.service.dtPosition;
        this.dialogPositionOffset = this.service.dtPositionOffset;
        this.mode = this.service.dtMode;
        this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
        this.setDialogStyle();
    }

    public ngAfterViewInit(): void {
        this.dialogHeight = this.el.nativeElement.offsetHeight;
        this.dialogWidth = this.el.nativeElement.offsetWidth;
        if (this.mode === 'dropdown') {
            this.setDropDownDialogPosition();
        } else if (this.mode === 'inline') {
            this.setInlineDialogPosition();
        }
        this.setDialogStyle();
    }

    private setDropDownDialogPosition() {
        if (window.innerWidth < 768) {
            this.position = 'fixed';
            this.top = 0;
            this.left = 0;
            this.width = '100%';
            this.height = '100%';
        } else {
            let node = this.directiveElementRef.nativeElement;
            let position = 'static';
            let transform;
            let parentNode: any = null;
            let boxDirective;

            while (node !== null && node.tagName !== 'HTML') {
                position = window.getComputedStyle(node).getPropertyValue("position");
                transform = window.getComputedStyle(node).getPropertyValue("-webkit-transform");
                if (position !== 'static' && parentNode === null) {
                    parentNode = node;
                }
                if (position === 'fixed') {
                    break;
                }
                node = node.parentNode;
            }

            if (position !== 'fixed' || transform) {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, true);
                if (parentNode === null) {
                    parentNode = node
                }
                let boxParent = this.createBox(parentNode, true);
                this.top = boxDirective.top - boxParent.top;
                this.left = boxDirective.left - boxParent.left;
            } else {
                boxDirective = this.createBox(this.directiveElementRef.nativeElement, false);
                this.top = boxDirective.top;
                this.left = boxDirective.left;
                this.position = 'fixed';
            }

            if (this.dialogPosition === 'left') {
                this.top += parseInt(this.dialogPositionOffset) / 100 * boxDirective.height;
                this.left -= this.dialogWidth + 3;
            } else if (this.dialogPosition === 'top') {
                this.top -= this.dialogHeight + 3;
                this.left += parseInt(this.dialogPositionOffset) / 100 * boxDirective.width;
            } else if (this.dialogPosition === 'right') {
                this.top += parseInt(this.dialogPositionOffset) / 100 * boxDirective.height;
                this.left += boxDirective.width + 3;
            } else {
                this.top += boxDirective.height + 3;
                this.left += parseInt(this.dialogPositionOffset) / 100 * boxDirective.width;
            }
        }
    }

    private createBox( element: any, offset: boolean ) {
        return {
            top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
            left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    }

    private setInlineDialogPosition() {
        this.position = 'relative';
        this.width = this.directiveElementRef.nativeElement.offsetWidth + 'px';
    }

    private setDialogStyle(): void {
        if (this.mode === 'popup') {
            return;
        } else {
            this.renderer.setStyle(this.el.nativeElement, 'width', this.width);
            this.renderer.setStyle(this.el.nativeElement, 'height', this.height);
            this.renderer.setStyle(this.el.nativeElement, 'top', this.top + 'px');
            this.renderer.setStyle(this.el.nativeElement, 'left', this.left + 'px');
            this.renderer.setStyle(this.el.nativeElement, 'position', this.position);
            return;
        }
    }
}
