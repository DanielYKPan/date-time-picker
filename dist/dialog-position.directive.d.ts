import { AfterViewInit, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { PickerService } from './picker.service';
export declare class DialogPositionDirective implements OnInit, AfterViewInit {
    private el;
    private renderer;
    private service;
    directiveElementRef: ElementRef;
    private dialogPosition;
    private dialogPositionOffset;
    private dialogHeight;
    private dialogWidth;
    private mode;
    private top;
    private left;
    private position;
    constructor(el: ElementRef, renderer: Renderer2, service: PickerService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private setDropDownDialogPosition();
    private createBox(element, offset);
    private setDialogStyle();
}
