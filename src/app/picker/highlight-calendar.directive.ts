/**
 * highlight.directive
 */

import {
    Directive, ElementRef, HostListener, Input, OnChanges,
    OnInit, Renderer2, SimpleChanges
} from '@angular/core';
import * as moment from 'moment/moment';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';

const black: string = '#000000';
const white: string = '#FFFFFF';
const grey: string = '#dddddd';

@Directive({
    selector: '[pickerCalendarHighlight]'
})
export class HighlightCalendarDirective implements OnChanges, OnInit {

    @Input() public day: Moment;
    @Input() public month: string;
    @Input() public year: string;
    @Input() public selectedMoment: Moment;
    @Input() public calendarMoment: Moment;

    private themeLightColor: string;
    private themeColor: string;
    private momentFunc = (moment as any).default ? (moment as any).default : moment;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
        this.themeColor = this.service.dtTheme;
        this.themeLightColor = shadeBlendConvert(0.7, this.themeColor);
        this.momentFunc.locale(this.service.dtLocale);
    }

    public ngOnChanges( changes: SimpleChanges ): void {

        if (this.day && changes['selectedMoment'] &&
            changes['selectedMoment'].currentValue) {
            if (this.isSelected()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-day-selected');
            } else {
                let color = this.isOutFocus() ? grey : black;
                this.highlight(null, color);
                this.renderer.removeClass(this.el.nativeElement, 'picker-day-selected');
            }
        }

        if (this.month && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarMonth()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-month-current');
            } else {
                this.highlight(null, black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-month-current');
            }
        }

        if (this.year && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarYear()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-year-current');
            } else {
                this.highlight(null, black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-year-current');
            }
        }
    }

    public ngOnInit(): void {
        if (this.isOutFocus()) {
            this.highlight(null, grey);
        }
    }

    @HostListener('mouseenter')
    public onMouseEnter() {
        if (this.isSelected() || this.isCalendarMonth() || this.isCalendarYear()) {
            return;
        }
        this.highlight(this.themeLightColor, black);
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        if (this.isSelected() || this.isCalendarMonth() || this.isCalendarYear()) {
            return;
        }
        let color = this.isOutFocus() ? grey : black;
        this.highlight(null, color);
    }

    private isSelected(): boolean {
        return this.day && this.selectedMoment && this.day.isSame(this.selectedMoment, 'day');
    }

    private isCalendarMonth(): boolean {
        return this.month && this.calendarMoment && this.month === this.calendarMoment.format('MMM');
    }

    private isCalendarYear(): boolean {
        return this.year && this.calendarMoment && this.year === this.calendarMoment.format('YYYY');
    }

    private isOutFocus(): boolean {
        return this.day && this.calendarMoment && !this.day.isSame(this.calendarMoment, 'month');
    }

    private highlight( bgColor: string, color: string ) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', bgColor);
        this.renderer.setStyle(this.el.nativeElement, 'color', color);
    }
}

