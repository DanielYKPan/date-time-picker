/**
 * code-highlight.directive
 */

import { Directive, ElementRef, OnInit } from '@angular/core';

declare let Prism: any;

@Directive({selector: '[appCodeHighlight]'})
export class CodeHighlightDirective implements OnInit {

    constructor( public el: ElementRef ) {
    }

    public ngOnInit() {
        Prism.highlightElement(this.el.nativeElement);
    }
}
