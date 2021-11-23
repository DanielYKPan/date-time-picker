import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
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
   */
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

  constructor() {}

  get displayValue(): number {
    return this.boxValue || this.value;
  }

  get owlDTTimerBoxClass(): boolean {
    return true;
  }

  public ngOnInit() {
    this.inputStreamSub = this.inputStream.pipe(debounceTime(500)).subscribe((val: string) => {
      if (val) {
        const inputValue = coerceNumberProperty(val, 0);
        this.updateValueViaInput(inputValue);
      }
    });
  }

  public ngOnDestroy(): void {
    this.inputStreamSub.unsubscribe();
  }

  public upBtnClicked(): void {
    let newValue = this.value + this.step;
    if (newValue > this.max) {
      newValue = this.min;
    }
    this.updateValue(newValue);
  }

  public downBtnClicked(): void {
    let newValue = this.value - this.step;
    if (newValue < this.min) {
      newValue = this.max;
    }
    this.updateValue(newValue);
  }

  public handleInputChange(value: string): void {
    this.inputStream.next(value);
  }

  public focusOut(value: string): void {
    if (value) {
      const inputValue = coerceNumberProperty(value, 0);
      this.updateValueViaInput(inputValue);
    }
  }

  public handleWheelChange(event: WheelEvent) {
    const deltaY = event.deltaY;
    if (deltaY > 0 && !this.upBtnDisabled) {
      this.downBtnClicked();
    } else if (deltaY < 0 && !this.downBtnDisabled) {
      this.upBtnClicked();
    }
  }

  private updateValue(value: number): void {
    this.valueChange.emit(value);
  }

  private updateValueViaInput(value: number): void {
    if (value > this.max || value < this.min) {
      return;
    }
    this.inputChange.emit(value);
  }
}
