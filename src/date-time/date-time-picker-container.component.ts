/**
 * date-time-picker-container.component
 */

import {
    AfterContentInit, AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter, HostBinding, HostListener,
    OnInit, Optional,
    ViewChild
} from '@angular/core';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { OwlDateTimeIntl } from './date-time-picker-intl.service';
import { OwlCalendarComponent } from './calendar.component';
import { OwlTimerComponent } from './timer.component';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OwlDateTime, PickerType } from './date-time.class';
import { ESCAPE } from '../utils';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    exportAs: 'owlDateTimeContainer',
    selector: 'owl-date-time-container',
    templateUrl: './date-time-picker-container.component.html',
    styleUrls: ['./date-time-picker-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    animations: [
        trigger('containerAnimation', [
            state('visible', style({opacity: 1})),
            state('hidden', style({opacity: 0})),
            transition('void => visible', [style({opacity: 0}), animate('150ms ease-in')]),
            transition('visible => hidden', animate('150ms ease-out'))
        ])
    ]
})

export class OwlDateTimeContainerComponent<T> implements OnInit, AfterContentInit, AfterViewInit {

    @ViewChild(OwlCalendarComponent) calendar: OwlCalendarComponent<T>;
    @ViewChild(OwlTimerComponent) timer: OwlTimerComponent<T>;

    /** Emits when an animation state changes. */
    public animationStateChanged = new EventEmitter<AnimationEvent>();

    public picker: OwlDateTime<T>;
    public activeSelectedIndex = 0; // The current active SelectedIndex in range select mode (0: 'from', 1: 'to')

    private isAnimating = false;

    // Animation State
    private _containerState: 'init' | 'hidden' | 'visible' = 'init';

    /**
     * Stream emits when try to hide picker
     * */
    private hidePicker$ = new Subject<any>();

    get hidePickerStream(): Observable<any> {
        return this.hidePicker$.asObservable();
    }

    /**
     * Stream emits when try to confirm the selected value
     * */
    private confirmSelected$ = new Subject<any>();

    get confirmSelectedStream(): Observable<any> {
        return this.confirmSelected$.asObservable();
    }

    /**
     * The current picker moment. This determines which time period is shown and which date is
     * highlighted when using keyboard navigation.
     */
    private _clamPickerMoment: T;

    get pickerMoment() {
        return this._clamPickerMoment;
    }

    set pickerMoment( value: T ) {
        if (value) {
            this._clamPickerMoment = this.dateTimeAdapter.clampDate(value, this.picker.minDateTime, this.picker.maxDateTime);
        }
    }

    get pickerType(): PickerType {
        return this.picker.pickerType;
    }

    get cancelLabel(): string {
        return this.pickerIntl.cancelBtnLabel;
    }

    get setLabel(): string {
        return this.pickerIntl.setBtnLabel;
    }

    /**
     * The range 'from' label
     * */
    get fromLabel(): string {
        return this.pickerIntl.rangeFromLabel;
    }

    /**
     * The range 'to' label
     * */
    get toLabel(): string {
        return this.pickerIntl.rangeToLabel;
    }

    /**
     * The range 'from' formatted value
     * */
    get fromFormattedValue(): string {
        const value = this.picker.selecteds[0];
        return value ? this.dateTimeAdapter.format(value, this.picker.formatString) : '';
    }

    /**
     * The range 'to' formatted value
     * */
    get toFormattedValue(): string {
        const value = this.picker.selecteds[1];
        return value ? this.dateTimeAdapter.format(value, this.picker.formatString) : '';
    }

    /**
     * Cases in which the control buttons show in the picker
     * 1) picker mode is 'dialog'
     * 2) picker type is NOT 'calendar' and the picker mode is NOT 'inline'
     * */
    get showControlButtons(): boolean {
        return this.picker.pickerMode === 'dialog' ||
            (this.picker.pickerType !== 'calendar' && this.picker.pickerMode !== 'inline');
    }

    get containerElm(): HTMLElement {
        return this.elmRef.nativeElement;
    }

    @HostBinding('class.owl-dt-container')
    get owlDTContainerClass(): boolean {
        return true;
    }

    @HostBinding('class.owl-dt-popup-container')
    get owlDTPopupContainerClass(): boolean {
        return this.picker.pickerMode === 'popup';
    }

    @HostBinding('class.owl-dt-dialog-container')
    get owlDTDialogContainerClass(): boolean {
        return this.picker.pickerMode === 'dialog';
    }

    @HostBinding('class.owl-dt-inline-container')
    get owlDTInlineContainerClass(): boolean {
        return this.picker.pickerMode === 'inline';
    }

    @HostBinding('class.owl-dt-container-disabled')
    get owlDTContainerDisabledClass(): boolean {
        return this.picker.disabled;
    }

    @HostBinding('attr.id')
    get owlDTContainerId(): string {
        return this.picker.id;
    }

    @HostBinding('@containerAnimation')
    get owlDTContainerAnimation(): any {
        return this._containerState;
    }

    constructor( private cdRef: ChangeDetectorRef,
                 private elmRef: ElementRef,
                 private pickerIntl: OwlDateTimeIntl,
                 @Optional() private dateTimeAdapter: DateTimeAdapter<T> ) {
    }

    public ngOnInit() {
    }

    public ngAfterContentInit(): void {
        this.initPicker();
    }

    public ngAfterViewInit(): void {
        this.focusPicker();
    }

    public showPickerViaAnimation(): void {
        this._containerState = 'visible';
        this.cdRef.markForCheck();
    }

    public hidePickerViaAnimation(): void {
        this._containerState = 'hidden';
        this.cdRef.markForCheck();
    }

    public dateSelected( date: T ): void {
        let result;

        if (this.picker.selectMode === 'single') {
            result = this.dateSelectedInSingleMode(date);
            if (result) {
                this.pickerMoment = result;
                this.picker.select(result);
            }
            return;
        }

        if (this.picker.selectMode === 'range') {
            result = this.dateSelectedInRangeMode(date);
            if (result) {
                this.pickerMoment = result[this.activeSelectedIndex];
                this.picker.select(result);
            }
        }
    }

    public timeSelected( time: T ): void {
        if (!this.picker.dateTimeChecker(time)) {
            return;
        }

        if (this.picker.selectMode === 'single') {
            this.pickerMoment = this.dateTimeAdapter.clone(time);
            this.picker.select(time);
            return;
        }

        if (this.picker.selectMode === 'range') {
            this.pickerMoment = this.dateTimeAdapter.clone(time);
            const selecteds = [...this.picker.selecteds];

            // check if the 'from' is after 'to' or 'to'is before 'from'
            // In this case, we set both the 'from' and 'to' the same value
            if ((this.activeSelectedIndex === 0 && selecteds[1] && this.dateTimeAdapter.compare(time, selecteds[1]) === 1) ||
                (this.activeSelectedIndex === 1 && selecteds[0] && this.dateTimeAdapter.compare(time, selecteds[0]) === -1)) {
                selecteds[0] = time;
                selecteds[1] = time;
            } else {
                selecteds[this.activeSelectedIndex] = time;
            }

            this.picker.select(selecteds);
        }
    }

    @HostListener('@containerAnimation.start', ['$event'])
    public onAnimationStart( event: AnimationEvent ): void {
        this.isAnimating = true;
        this.animationStateChanged.emit(event);
    }

    @HostListener('@containerAnimation.done', ['$event'])
    public onAnimationDone( event: AnimationEvent ): void {
        const toState = event.toState;
        if (toState === 'visible' || toState === 'hidden') {
            // Note: as of Angular 4.3, the animations module seems to fire the `start` callback before
            // the end if animations are disabled. Make this call async to ensure that it still fires
            // at the appropriate time.
            Promise.resolve().then(() => {
                this.animationStateChanged.emit(event);
                this.isAnimating = false;
            });
        }
    }

    /**
     * Handle click on cancel button
     * @param {any} event
     * @return {void}
     * */
    public onCancelClicked( event: any ): void {
        this.hidePicker$.next(null);
        event.preventDefault();
        return;
    }

    /**
     * Handle click on set button
     * @param {any} event
     * @return {void}
     * */
    public onSetClicked( event: any ): void {
        this.confirmSelected$.next(event);
        event.preventDefault();
        return;
    }

    /**
     * Toggle the active index in range mode
     * @return {void}
     * */
    public toggleRangeActiveIndex(): void {
        this.activeSelectedIndex =
            this.activeSelectedIndex === 0 ? 1 : 0;

        const selected = this.picker.selecteds[this.activeSelectedIndex];
        if (this.picker.selecteds && selected) {
            this.pickerMoment = this.dateTimeAdapter.clone(selected);
        }
        return;
    }

    @HostListener('keydown', ['$event'])
    public handleKeydownOnHost( event: KeyboardEvent ): void {
        if (event.keyCode === ESCAPE && this.picker.pickerMode === 'popup') {
            this.hidePicker$.next(null);
            event.preventDefault();
        }
    }

    private initPicker(): void {
        this.pickerMoment = this.picker.startAt || this.dateTimeAdapter.now();
    }

    /**
     * Select calendar date in single mode
     * @param {Date} date
     * @return {Date | null}
     * */
    private dateSelectedInSingleMode( date: T ): T | null {

        if (this.dateTimeAdapter.isSameDay(date, this.picker.selected)) {
            return null;
        }

        return this.updateAndCheckCalendarDate(date);
    }

    /**
     * Select dates in range Mode
     * @param {Date} date
     * @return {Date[] | null}
     * */
    private dateSelectedInRangeMode( date: T ): T[] | null {
        let from = this.picker.selecteds[0];
        let to = this.picker.selecteds[1];

        const result = this.updateAndCheckCalendarDate(date);

        if (!result) {
            return null;
        }

        // if the given calendar day is after or equal to 'from',
        // set ths given date as 'to'
        // otherwise, set it as 'from' and set 'to' to null
        if (this.picker.selecteds && this.picker.selecteds.length && !to &&
            this.dateTimeAdapter.differenceInCalendarDays(result, from) >= 0) {
            to = result;
            this.activeSelectedIndex = 1;
        } else {
            from = result;
            to = null;
            this.activeSelectedIndex = 0;
        }

        return [from, to];
    }

    /**
     * Update the given calendar date's time and check if it is valid
     * Because the calendar date has 00:00:00 as default time, if the picker type is 'both',
     * we need to update the given calendar date's time before selecting it.
     * if it is valid, return the updated dateTime
     * if it is not valid, return null
     * @param {Date} date
     * @return {Date}
     * */
    private updateAndCheckCalendarDate( date: T ): T {
        let result;

        // if the picker is 'both', update the calendar date's time value
        if (this.picker.pickerType === 'both') {
            result = this.dateTimeAdapter.createDate(
                this.dateTimeAdapter.getYear(date),
                this.dateTimeAdapter.getMonth(date),
                this.dateTimeAdapter.getDate(date),
                this.dateTimeAdapter.getHours(this.pickerMoment),
                this.dateTimeAdapter.getMinutes(this.pickerMoment),
                this.dateTimeAdapter.getSeconds(this.pickerMoment),
            );
            result = this.dateTimeAdapter.clampDate(result, this.picker.minDateTime, this.picker.maxDateTime);
        } else {
            result = this.dateTimeAdapter.clone(date);
        }

        // check the updated dateTime
        return this.picker.dateTimeChecker(result) ? result : null;
    }

    /**
     * Focus to the picker
     * */
    private focusPicker(): void {

        if (this.picker.pickerMode === 'inline') {
            return;
        }

        if (this.calendar) {
            this.calendar.focusActiveCell();
        } else if (this.timer) {
            this.timer.focus();
        }
    }
}
