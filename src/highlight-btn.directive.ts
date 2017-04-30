/**
 * highlight-btn.directive
 */

import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';

@Directive({
    selector: '[pickerBtnHighlight]',
})
export class HighlightBtnDirective implements OnInit {

    private themeColor: string;
    private themeDarkColor: string;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
        this.themeColor = this.service.dtTheme;
        this.themeDarkColor = shadeBlendConvert(-0.1, this.themeColor);
    }

    public ngOnInit(): void {
        this.highlight(this.themeColor);
    }

    @HostListener('mouseenter')
    public onMouseEnter() {
        this.highlight(this.themeDarkColor);
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        this.highlight(this.themeColor);
    }

    private highlight( bgColor: string ) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', bgColor);
    }
}
