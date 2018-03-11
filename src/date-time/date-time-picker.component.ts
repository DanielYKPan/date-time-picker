/**
 * date-time-picker.component
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    EventEmitter,
    Inject,
    InjectionToken,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    ViewContainerRef
} from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { ComponentPortal } from '@angular/cdk/portal';
import {
    Overlay,
    OverlayConfig,
    OverlayRef,
    PositionStrategy,
    BlockScrollStrategy,
    ScrollStrategy
} from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { OwlDateTimeContainerComponent } from './date-time-picker-container.component';
import { OwlDateTimeInputDirective } from './date-time-picker-input.directive';
import { DateTimeAdapter } from './adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from './adapter/date-time-format.class';
import { OwlDateTime, PickerMode, PickerType, SelectMode } from './date-time.class';
import { OwlDialogRef, OwlDialogService } from '../dialog';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';

/** Injection token that determines the scroll handling while the dtPicker is open. */
export const OWL_DTPICKER_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('owl-dtpicker-scroll-strategy');

/** @docs-private */
export function OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY( overlay: Overlay ): () => BlockScrollStrategy {
    return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER = {
    provide: OWL_DTPICKER_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: OWL_DTPICKER_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

@Component({
    selector: 'owl-date-time',
    exportAs: 'owlDateTime',
    templateUrl: './date-time-picker.component.html',
    styleUrls: ['./date-time-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
})

export class OwlDateTimeComponent<T> extends OwlDateTime<T> implements OnInit, OnDestroy {

    /** The date to open the calendar to initially. */
    private _startAt: T | null;
    @Input()
    get startAt(): T | null {
        // If an explicit startAt is set we start there, otherwise we start at whatever the currently
        // selected value is.
        if (this._startAt) {
            return this._startAt;
        }

        if (this._dtInput) {

            if (this._dtInput.selectMode === 'single') {
                return this._dtInput.value || null;
            } else if (this._dtInput.selectMode === 'range' ||
                this._dtInput.selectMode === 'rangeFrom') {
                return this._dtInput.values[0] || null;
            } else if (this._dtInput.selectMode === 'rangeTo') {
                return this._dtInput.values[1] || null;
            }

        } else {
            return null;
        }
    }

    set startAt( date: T | null ) {
        this._startAt = this.getValidDate(this.dateTimeAdapter.deserialize(date));
    }

    /**
     * Set the type of the dateTime picker
     *      'both' -- show both calendar and timer
     *      'calendar' -- show only calendar
     *      'timer' -- show only timer
     * @default 'both'
     * @type {'both' | 'calendar' | 'timer'}
     * */
    private _pickerType: PickerType = 'both';
    @Input()
    get pickerType(): PickerType {
        return this._pickerType;
    }

    set pickerType( val: PickerType ) {
        if (val !== this._pickerType) {
            this._pickerType = val;
            if (this._dtInput.isInSingleMode) {
                this._dtInput.value = this._dtInput.value;
            } else {
                this._dtInput.values = this._dtInput.values;
            }
        }
    }

    /**
     * Whether the picker open as a dialog
     * @default {false}
     * @type {boolean}
     * */
    _pickerMode: PickerMode = 'popup';
    @Input()
    get pickerMode() {
        return this._pickerMode;
    }

    set pickerMode( mode: PickerMode ) {
        if (mode === 'popup') {
            this._pickerMode = mode;
        } else {
            this._pickerMode = 'dialog';
        }
    }

    /** Whether the date time picker should be disabled. */
    private _disabled = false;
    @Input()
    get disabled(): boolean {
        return this._disabled === undefined && this._dtInput ?
            this._dtInput.disabled : !!this._disabled;
    }

    set disabled( value: boolean ) {
        value = coerceBooleanProperty(value);
        if (value !== this._disabled) {
            this._disabled = value;
            this.disabledChange.next(value);
        }
    }

    /**
     * Callback when the picker is closed
     * */
    @Output() afterPickerClosed = new EventEmitter<any>();

    /**
     * Callback when the picker is open
     * */
    @Output() afterPickerOpen = new EventEmitter<any>();

    /**
     * Emit when the selected value has been confirmed
     * */
    public confirmSelectedChange = new EventEmitter<T[] | T>();

    /**
     * Emits when the date time picker is disabled.
     * */
    public disabledChange = new EventEmitter<boolean>();

    public opened: boolean;

    private pickerContainerPortal: ComponentPortal<OwlDateTimeContainerComponent<T>>;
    private pickerContainer: OwlDateTimeContainerComponent<T>;
    private popupRef: OverlayRef;
    private dialogRef: OwlDialogRef<OwlDateTimeContainerComponent<T>>;
    private dtInputSub = Subscription.EMPTY;
    private hidePickerStreamSub: Subscription;
    private confirmSelectedStreamSub: Subscription;

    /** The element that was focused before the date time picker was opened. */
    private focusedElementBeforeOpen: HTMLElement | null = null;

    private _dtInput: OwlDateTimeInputDirective<T>;
    get dtInput() {
        return this._dtInput;
    }

    private _selected: T | null;
    get selected() {
        return this._selected;
    }

    set selected( value: T | null ) {
        this._selected = value;
        this.changeDetector.markForCheck();
    }

    private _selecteds: T[] = [];
    get selecteds() {
        return this._selecteds;
    }

    set selecteds( values: T[] ) {
        this._selecteds = values;
        this.changeDetector.markForCheck();
    }

    /** The minimum selectable date. */
    get minDateTime(): T | null {
        return this._dtInput && this._dtInput.min;
    }

    /** The maximum selectable date. */
    get maxDateTime(): T | null {
        return this._dtInput && this._dtInput.max;
    }

    get dateTimeFilter(): ( date: T | null ) => boolean {
        return this._dtInput && this._dtInput.dateTimeFilter;
    }

    get selectMode(): SelectMode {
        return this._dtInput.selectMode;
    }

    get isInSingleMode(): boolean {
        return this._dtInput.isInSingleMode;
    }

    get isInRangeMode(): boolean {
        return this._dtInput.isInRangeMode;
    }

    constructor( private overlay: Overlay,
                 private viewContainerRef: ViewContainerRef,
                 private dialogService: OwlDialogService,
                 private ngZone: NgZone,
                 protected changeDetector: ChangeDetectorRef,
                 @Optional() protected dateTimeAdapter: DateTimeAdapter<T>,
                 @Inject(OWL_DTPICKER_SCROLL_STRATEGY) private scrollStrategy: () => ScrollStrategy,
                 @Optional() @Inject(OWL_DATE_TIME_FORMATS) protected dateTimeFormats: OwlDateTimeFormats,
                 @Optional() @Inject(DOCUMENT) private document: any ) {
        super(dateTimeAdapter, dateTimeFormats);
    }

    public ngOnInit() {
    }

    public ngOnDestroy(): void {
        this.clean();
        this.dtInputSub.unsubscribe();
        this.disabledChange.complete();

        if (this.popupRef) {
            this.popupRef.dispose();
        }
    }

    public registerInput( input: OwlDateTimeInputDirective<T> ): void {
        if (this._dtInput) {
            throw Error('A Owl DateTimePicker can only be associated with a single input.');
        }

        this._dtInput = input;
        this.dtInputSub = this._dtInput.valueChange.subscribe(( value: T[] | T | null ) => {
            if (Array.isArray(value)) {
                this.selecteds = value;
            } else {
                this.selected = value;
            }
        });
    }

    public open(): void {

        if (this.opened || this.disabled) {
            return;
        }

        if (!this._dtInput) {
            throw Error('Attempted to open an DateTimePicker with no associated input.');
        }

        if (this.document) {
            this.focusedElementBeforeOpen = this.document.activeElement;
        }

        // reset the picker selected value
        if (this.isInSingleMode) {
            this.selected = this._dtInput.value;
        } else if (this.isInRangeMode) {
            this.selecteds = this._dtInput.values;
        }

        this.pickerMode === 'dialog' ?
            this.openAsDialog() :
            this.openAsPopup();


        this.pickerContainer.picker = this;

        // Listen to picker container's hidePickerStream
        this.hidePickerStreamSub = this.pickerContainer.hidePickerStream
            .subscribe(() => {
                this.hidePicker();
            });

        // Listen to picker container's confirmSelectedStream
        this.confirmSelectedStreamSub = this.pickerContainer.confirmSelectedStream
            .subscribe(( event: any ) => {
                this.confirmSelect(event);
            });

        this.opened = true;
    }

    /**
     * Selects the given date
     * @param date -- a date to be selected
     * @return {void}
     * */
    public select( date: T[] | T ): void {

        if (Array.isArray(date)) {
            this.selecteds = [...date];
        } else {
            this.selected = date;
        }

        /**
         * Cases in which automatically confirm the select when date or dates are selected:
         * 1) picker mode is NOT 'dialog'
         * 2) picker type is 'calendar' and selectMode is 'single'.
         * 3) picker type is 'calendar' and selectMode is 'range' and
         *    the 'selecteds' has 'from'(selecteds[0]) and 'to'(selecteds[1]) values.
         * */
        if (this.pickerMode !== 'dialog' &&
            this.pickerType === 'calendar' &&
            (this.isInSingleMode || (this.isInRangeMode && this.selecteds[0] && this.selecteds[1]))) {
            this.confirmSelect();
        }
    }

    /**
     * Confirm the selected value
     * @param {any} event
     * @return {void}
     * */
    private confirmSelect( event?: any ): void {

        if (this.isInSingleMode) {
            const selected = this.selected || this.startAt || this.dateTimeAdapter.now();
            this.confirmSelectedChange.emit(selected);
        } else if (this.isInRangeMode) {
            this.confirmSelectedChange.emit(this.selecteds);
        }

        this.hidePicker(event);
        return;
    }

    /**
     * Hide the picker
     * @param {any} event
     * @return {void}
     * */
    private hidePicker( event?: any ): void {
        if (!this.opened) {
            return;
        }

        if (this.dialogRef) {
            this.dialogRef.close();
        }

        if (this.popupRef) {
            this.pickerContainer.hidePickerViaAnimation();
        }
    }

    /**
     * Open the picker as a dialog
     * @return {void}
     * */
    private openAsDialog(): void {
        this.dialogRef = this.dialogService.open(OwlDateTimeContainerComponent, {
            autoFocus: false,
            paneClass: 'owl-dt-dialog',
            viewContainerRef: this.viewContainerRef,
        });
        this.pickerContainer = this.dialogRef.componentInstance;

        this.dialogRef.afterOpen().subscribe(() => this.afterPickerOpen.emit(null));
        this.dialogRef.afterClosed().subscribe(() => this.clean());
    }

    /**
     * Open the picker as popup
     * @return {void}
     * */
    private openAsPopup(): void {

        if (!this.pickerContainerPortal) {
            this.pickerContainerPortal = new ComponentPortal<OwlDateTimeContainerComponent<T>>(OwlDateTimeContainerComponent, this.viewContainerRef);
        }

        if (!this.popupRef) {
            this.createPopup();
        }

        if (!this.popupRef.hasAttached()) {
            const componentRef: ComponentRef<OwlDateTimeContainerComponent<T>> =
                this.popupRef.attach(this.pickerContainerPortal);
            this.pickerContainer = componentRef.instance;
            this.pickerContainer.showPickerViaAnimation();

            // Update the position once the calendar has rendered.
            this.ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
                this.popupRef.updatePosition();
            });
        }

        merge(
            this.popupRef.backdropClick(),
            this.popupRef.detachments(),
            this.popupRef.keydownEvents().pipe(filter(event => event.keyCode === ESCAPE))
        ).subscribe(() => this.hidePicker());

        // Listen to picker's container animation state
        this.pickerContainer.animationStateChanged.subscribe(( event: AnimationEvent ) => {
            if (event.phaseName === 'done' && event.toState === 'visible') {
                this.afterPickerOpen.emit(null);
            }

            if (event.phaseName === 'done' && event.toState === 'hidden') {
                this.clean();
            }
        });
    }

    private createPopup(): void {
        const overlayConfig = new OverlayConfig({
            positionStrategy: this.createPopupPositionStrategy(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop',
            scrollStrategy: this.scrollStrategy(),
            panelClass: 'owl-dt-popup',
        });

        this.popupRef = this.overlay.create(overlayConfig);
    }

    /**
     * Create the popup PositionStrategy.
     * */
    private createPopupPositionStrategy(): PositionStrategy {
        const fallbackOffset = 0;

        return this.overlay.position()
            .connectedTo(this._dtInput.elementRef,
                {originX: 'start', originY: 'bottom'},
                {overlayX: 'start', overlayY: 'top'}
            )
            .withFallbackPosition(
                {originX: 'start', originY: 'top'},
                {overlayX: 'start', overlayY: 'bottom'},
                undefined,
                fallbackOffset
            )
            .withFallbackPosition(
                {originX: 'end', originY: 'bottom'},
                {overlayX: 'end', overlayY: 'top'}
            )
            .withFallbackPosition(
                {originX: 'end', originY: 'top'},
                {overlayX: 'end', overlayY: 'bottom'},
                undefined,
                fallbackOffset
            )
            .withFallbackPosition(
                {originX: 'start', originY: 'top'},
                {overlayX: 'start', overlayY: 'bottom'},
                undefined,
                176
            )
            .withFallbackPosition(
                {originX: 'start', originY: 'top'},
                {overlayX: 'start', overlayY: 'bottom'},
                undefined,
                352
            );
    }

    /**
     * Clean all the dynamic components
     * @return {void}
     * */
    private clean(): void {
        if (!this.opened) {
            return;
        }

        if (this.popupRef && this.popupRef.hasAttached()) {
            this.popupRef.detach();
        }

        if (this.pickerContainerPortal && this.pickerContainerPortal.isAttached) {
            this.pickerContainerPortal.detach();
        }

        if (this.hidePickerStreamSub) {
            this.hidePickerStreamSub.unsubscribe();
            this.hidePickerStreamSub = null;
        }

        if (this.confirmSelectedStreamSub) {
            this.confirmSelectedStreamSub.unsubscribe();
            this.confirmSelectedStreamSub = null;
        }

        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }

        const completeClose = () => {
            if (this.opened) {
                this.opened = false;
                this.afterPickerClosed.emit(null);
                this.focusedElementBeforeOpen = null;
            }
        };

        if (this.focusedElementBeforeOpen &&
            typeof this.focusedElementBeforeOpen.focus === 'function') {
            // Because IE moves focus asynchronously, we can't count on it being restored before we've
            // marked the datepicker as closed. If the event fires out of sequence and the element that
            // we're refocusing opens the datepicker on focus, the user could be stuck with not being
            // able to close the calendar at all. We work around it by making the logic, that marks
            // the datepicker as closed, async as well.
            this.focusedElementBeforeOpen.focus();
            setTimeout(completeClose);
        } else {
            completeClose();
        }
    }
}
