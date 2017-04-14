/**
 * highlight.directive
 */

import {
    Directive, ElementRef, HostListener, Input,
    OnDestroy, OnInit, Renderer2
} from '@angular/core';
import { Moment } from 'moment/moment';
import { Subscription } from 'rxjs/Rx';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';

@Directive({
    selector: '[pickerHighlight]'
})
export class HighlightDirective implements OnInit, OnDestroy {

    @Input() public day: Moment;

    private selectedMoment: Moment;
    private subId: Subscription;
    private lightColor: string;
    private color: string;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
    }

    public ngOnInit(): void {
        this.color = this.service.dtTheme;
        this.lightColor = shadeBlendConvert(0.7, this.color);
        this.subId = this.service.selectedMomentChange.subscribe(
            ( selectedMoment: Moment ) => {
                this.selectedMoment = selectedMoment;
                if (this.isSelected()) {
                    this.highlight(this.color);
                } else {
                    this.highlight(null);
                }
            }
        );
    }

    public ngOnDestroy(): void {
        if (this.subId) {
            this.subId.unsubscribe();
        }
    }

    @HostListener('mouseenter')
    public onMouseEnter() {
        if (this.isSelected()) {
            return;
        }
        this.highlight(this.lightColor);
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        if (this.isSelected()) {
            return;
        }
        this.highlight(null);
    }

    private isSelected(): boolean {
        return this.day && this.selectedMoment && this.day.isSame(this.selectedMoment, 'day');
    }

    private highlight( color: string ) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    }
}

