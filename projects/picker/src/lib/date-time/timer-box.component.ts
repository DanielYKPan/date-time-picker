/**
 * timer-box.component
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    ElementRef,
    ViewChild,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    exportAs: 'owlDateTimeTimerBox',
    selector: 'owl-date-time-timer-box',
    templateUrl: './timer-box.component.html',
    styleUrls: ['./timer-box.component.scss'],
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.owl-dt-timer-box]': 'owlDTTimerBoxClass'
    }
})

export class OwlTimerBoxComponent implements OnInit, OnDestroy {

    @Input() showDivider = false;

    @Input() upBtnAriaLabel: string;

    @Input() upBtnDisabled: boolean;

    @Input() downBtnAriaLabel: string;

    @Input() downBtnDisabled: boolean;

    /**
     * Value would be displayed in the box
     * If it is null, the box would display [value]
     * */
    @Input() boxValue: number;

    @Input() value: number;

    @Input() min: number;

    @Input() max: number;

    @Input() step = 1;

    @Input() inputLabel: string;

    @Output() valueChange = new EventEmitter<number>();

    @Output() inputChange = new EventEmitter<number>();

    private inputStream = new Subject<string>();

    private inputStreamSub = Subscription.EMPTY;

    get displayValue(): number {
        return this.boxValue || this.value;
    }

    get owlDTTimerBoxClass(): boolean {
        return true;
    }

    @ViewChild('valueInput') private valueInput: ElementRef;

    constructor() {
    }

    public ngOnInit() {
        this.inputStreamSub = this.inputStream.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(( val: string ) => {
            if (val) {
                const inputValue = coerceNumberProperty(val, 0);
                this.updateValueViaInput(inputValue);
            }
        });
        this.bindValueInputMouseWheel();
    }

    public ngOnDestroy(): void {
        this.unbindValueInputMouseWheel();
        this.inputStreamSub.unsubscribe();
    }

    public upBtnClicked(): void {
        this.updateValue(this.value + this.step);
    }

    public downBtnClicked(): void {
        this.updateValue(this.value - this.step);
    }

    public handleInputChange( val: string ): void {
        this.inputStream.next(val);
    }

    private updateValue( value: number ): void {
        this.valueChange.emit(value);
    }

    private updateValueViaInput( value: number ): void {
        if (value > this.max || value < this.min) {
            return;
        }
        this.inputChange.emit(value);
    }

    private onValueInputMouseWheelBind = this.onValueInputMouseWheel.bind(this);
    private onValueInputMouseWheel( event: any ): void {
        event = event || window.event;
        var delta = event.wheelDelta || -event.deltaY || -event.detail;

        if (delta > 0){
            !this.upBtnDisabled && this.upBtnClicked();
        } else if (delta < 0){
            !this.downBtnDisabled && this.downBtnClicked();
        }

        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }

    private bindValueInputMouseWheel(): void {
        this.valueInput.nativeElement.addEventListener(
            'onwheel' in document ? "wheel" : "mousewheel",
            this.onValueInputMouseWheelBind);
    }

    private unbindValueInputMouseWheel(): void {
        this.valueInput.nativeElement.removeEventListener(
            'onwheel' in document ? "wheel" : "mousewheel",
            this.onValueInputMouseWheelBind);
    }
}
