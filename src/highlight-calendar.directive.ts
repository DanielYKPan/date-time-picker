/**
 * highlight.directive
 */

import {
    Directive, ElementRef, HostListener, Input, OnChanges, OnDestroy,
    OnInit, Renderer2, SimpleChanges
} from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { shadeBlendConvert } from './utils';
import { Subscription } from 'rxjs/Subscription';

const black: string = '#000000';
const white: string = '#FFFFFF';
const grey: string = '#dddddd';

@Directive({
    selector: '[pickerCalendarHighlight]'
})
export class HighlightCalendarDirective implements OnChanges, OnInit, OnDestroy {

    @Input() public day: Moment;
    @Input() public month: string;
    @Input() public year: string;
    @Input() public calendarMoment: Moment;

    private themeLightColor: string;
    private themeColor: string;
    private originalDayColor: string = black;
    private selectedElm: any;
    private subId: Subscription;
    private selectedMoment: Moment;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
        this.themeColor = this.service.dtTheme;
        this.themeLightColor = shadeBlendConvert(0.7, this.themeColor);
    }

    public ngOnChanges( changes: SimpleChanges ): void {

        if (changes['day'] && changes['day'].currentValue) {
            if (!this.service.isValidDate(this.day)) {
                this.originalDayColor = grey;
                this.renderer.addClass(this.el.nativeElement, 'picker-day-invalid');
            }
            if (this.isOutFocus()) {
                this.originalDayColor = grey;
                this.renderer.addClass(this.el.nativeElement, 'picker-day-out-focus');
            }
            this.highlight('transparent', this.originalDayColor);
        }

        if (this.month && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarMonth()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-month-current');
            } else {
                this.highlight('transparent', black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-month-current');
            }
        }

        if (this.year && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarYear()) {
                this.highlight(this.themeColor, white);
                this.renderer.addClass(this.el.nativeElement, 'picker-year-current');
            } else {
                this.highlight('transparent', black);
                this.renderer.removeClass(this.el.nativeElement, 'picker-year-current');
            }
        }
    }

    public ngOnInit(): void {
        this.subId = this.service.selectedMomentChange.subscribe(
            (data) => {
                this.selectedMoment = data;
                this.highlightSelectedDay();
            }
        );
    }

    public ngOnDestroy(): void {
        this.subId.unsubscribe();
    }

    @HostListener('mouseenter')
    public onMouseEnter() {
        if (!this.service.isValidDate(this.day) ||
            this.service.isTheSameDay(this.day, this.selectedMoment) ||
            this.isCalendarMonth() ||
            this.isCalendarYear()) {
            return;
        }
        this.highlight(this.themeLightColor, black);
    }

    @HostListener('mouseleave')
    public onMouseLeave() {
        if (!this.service.isValidDate(this.day) ||
            this.service.isTheSameDay(this.day, this.selectedMoment) ||
            this.isCalendarMonth() ||
            this.isCalendarYear()) {
            return;
        }
        let color = this.isOutFocus() ? grey : black;
        this.highlight('transparent', color);
    }

    private isCalendarMonth(): boolean {
        return this.month && this.calendarMoment &&
            this.month === this.calendarMoment.locale(this.service.dtLocale).format('MMM');
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

    private highlightSelectedDay() {
        if (this.selectedElm) {
            this.highlight('transparent', this.originalDayColor);
            this.renderer.removeClass(this.selectedElm.nativeElement, 'picker-day-selected');
            this.selectedElm = null;
        }

        if (this.service.isTheSameDay(this.day, this.selectedMoment)) {
            this.highlight(this.themeColor, white);
            this.renderer.addClass(this.el.nativeElement, 'picker-day-selected');
            this.selectedElm = this.el;
        }
    }
}

