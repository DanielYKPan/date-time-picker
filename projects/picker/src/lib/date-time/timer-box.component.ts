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
import { debounceTime } from 'rxjs/operators';

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

    private hasFocus = false;

    get displayValue(): string {
        if (this.hasFocus) {
            // Don't try to reformat the value that user is currently editing
            return this.valueInput.nativeElement.value;
        }

        const value = this.boxValue || this.value;

        if (value === null || isNaN(value)) {
            return '';
        }

        return value < 10 ? '0' + value.toString() : value.toString();
    }

    get owlDTTimerBoxClass(): boolean {
        return true;
    }

    @ViewChild('valueInput', { static: true })
    private valueInput: ElementRef<HTMLInputElement>;
    private onValueInputMouseWheelBind = this.onValueInputMouseWheel.bind(this);

    constructor() {
    }

    public ngOnInit() {
        this.inputStreamSub = this.inputStream.pipe(debounceTime(750)).subscribe(( val: string ) => {
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

    public handleInputChange(val: string ): void {
        this.inputStream.next(val);
    }

    public focusIn(): void {
        this.hasFocus = true;
    }

    public focusOut(value: string): void {
        this.hasFocus = false;
        if (value) {
            const inputValue = coerceNumberProperty(value, 0);
            this.updateValueViaInput(inputValue);
        }
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

    private onValueInputMouseWheel( event: any ): void {
        event = event || window.event;
        const delta = event.wheelDelta || -event.deltaY || -event.detail;

        if (delta > 0) {
          if (!this.upBtnDisabled) {
            this.upBtnClicked();
          }
        } else if (delta < 0) {
          if (!this.downBtnDisabled) {
            this.downBtnClicked();
          }
        }

        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    }

    private bindValueInputMouseWheel(): void {
        this.valueInput.nativeElement.addEventListener(
            'onwheel' in document ? 'wheel' : 'mousewheel',
            this.onValueInputMouseWheelBind);
    }

    private unbindValueInputMouseWheel(): void {
        this.valueInput.nativeElement.removeEventListener(
            'onwheel' in document ? 'wheel' : 'mousewheel',
            this.onValueInputMouseWheelBind);
    }
}
