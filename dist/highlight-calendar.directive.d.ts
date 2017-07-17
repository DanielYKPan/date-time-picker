import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Moment } from 'moment/moment';
import { PickerService } from './picker.service';
export declare class HighlightCalendarDirective implements OnChanges, OnInit, OnDestroy {
    private el;
    private renderer;
    private service;
    day: Moment;
    month: string;
    year: string;
    calendarMoment: Moment;
    private selectedElm;
    private subId;
    private selectedMoment;
    constructor(el: ElementRef, renderer: Renderer2, service: PickerService);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private isCalendarMonth();
    private isCalendarYear();
    private isOutFocus();
    private isToday(day);
    private highlightSelectedDay();
    private highlightInvalidDays();
}
