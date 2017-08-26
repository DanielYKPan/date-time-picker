/**
 * highlight.directive
 */

import {
    Directive, ElementRef, Input, OnChanges, OnDestroy,
    OnInit, Renderer2, SimpleChanges
} from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';

@Directive({
    selector: '[pickerCalendarHighlight]'
})
export class HighlightCalendarDirective implements OnChanges, OnInit, OnDestroy {

    @Input() public day: Moment;
    @Input() public month: string;
    @Input() public year: string;
    @Input() public calendarMoment: Moment;

    private selectedElm: any;
    private subId: Subscription;
    private selectedMoment: Moment;

    constructor( private el: ElementRef,
                 private renderer: Renderer2,
                 private service: PickerService ) {
    }

    public ngOnChanges( changes: SimpleChanges ): void {

        if (changes['day'] && changes['day'].currentValue) {
            this.renderer.addClass(this.el.nativeElement, 'day-show');

            this.highlightInvalidDays();
            this.highlightSelectedDay();
            if (this.isToday(this.day)) {
                this.renderer.addClass(this.el.nativeElement, 'day-today');
            }

            if (this.isOutFocus()) {
                this.renderer.addClass(this.el.nativeElement, 'out-focus');
            }
        }

        if (this.month && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarMonth()) {
                this.renderer.addClass(this.el.nativeElement, 'selected');
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'selected');
            }
        }

        if (this.year && changes['calendarMoment'] &&
            changes['calendarMoment'].currentValue) {
            if (this.isCalendarYear()) {
                this.renderer.addClass(this.el.nativeElement, 'selected');
            } else {
                this.renderer.removeClass(this.el.nativeElement, 'selected');
            }
        }
    }

    public ngOnInit(): void {
        this.subId = this.service.refreshCalendar
            .subscribe(
            ( data ) => {
                this.selectedMoment = data;
                this.highlightSelectedDay();
                this.highlightInvalidDays();
            }
        );
    }

    public ngOnDestroy(): void {
        this.subId.unsubscribe();
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

    private isToday( day: Moment ): boolean {
        return this.service.isTheSameDay(day, this.service.now);
    }

    private highlightSelectedDay() {
        if (this.selectedElm) {
            this.renderer.removeClass(this.selectedElm.nativeElement, 'selected');
            this.selectedElm = null;
        }

        if (this.service.isTheSameDay(this.day)) {
            this.renderer.addClass(this.el.nativeElement, 'selected');
            this.selectedElm = this.el;
        }
    }

    private highlightInvalidDays(): void {
        this.renderer.removeClass(this.el.nativeElement, 'day-invalid');

        if (!this.service.isValidDate(this.day)) {
            this.renderer.addClass(this.el.nativeElement, 'day-invalid');
        }
    }
}

