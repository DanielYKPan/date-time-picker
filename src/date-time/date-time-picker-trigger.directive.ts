/**
 * date-time-picker-trigger.directive
 */


import {
    AfterContentInit, ChangeDetectorRef, Directive, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit,
    SimpleChanges
} from '@angular/core';
import { OwlDateTimeComponent } from './date-time-picker.component';
import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';

@Directive({
    selector: '[owlDateTimeTrigger]',
})
export class OwlDateTimeTriggerDirective<T> implements OnInit, OnChanges, AfterContentInit, OnDestroy {

    @Input('owlDateTimeTrigger') dtPicker: OwlDateTimeComponent<T>;

    private _disabled: boolean;
    @Input()
    get disabled(): boolean {
        return this._disabled === undefined ? this.dtPicker.disabled : !!this._disabled;
    }

    set disabled( value: boolean ) {
        this._disabled = value;
    }

    @HostBinding('class.owl-dt-trigger-disabled')
    get owlDTTriggerDisabledClass(): boolean {
        return this.disabled;
    }

    private stateChanges = Subscription.EMPTY;

    constructor( protected changeDetector: ChangeDetectorRef ) {
    }

    public ngOnInit(): void {
    }

    public ngOnChanges( changes: SimpleChanges ) {
        if (changes.datepicker) {
            this.watchStateChanges();
        }
    }

    public ngAfterContentInit() {
        this.watchStateChanges();
    }

    public ngOnDestroy(): void {
        this.stateChanges.unsubscribe();
    }

    @HostListener('click', ['$event'])
    private handleClickOnHost( event: Event ): void {
        if (this.dtPicker) {
            this.dtPicker.open();
            event.stopPropagation();
        }
    }

    private watchStateChanges(): void {
        this.stateChanges.unsubscribe();

        const inputDisabled = this.dtPicker && this.dtPicker.dtInput ?
            this.dtPicker.dtInput.disabledChange : Observable.of();

        const pickerDisabled = this.dtPicker ?
            this.dtPicker.disabledChange : Observable.of();

        this.stateChanges = Observable.merge(pickerDisabled, inputDisabled)
            .subscribe(() => {
                this.changeDetector.markForCheck();
            });
    }
}
