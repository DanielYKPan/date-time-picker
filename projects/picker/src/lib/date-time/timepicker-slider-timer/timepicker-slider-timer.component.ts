import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'owl-timepicker-slider-timer',
  templateUrl: './timepicker-slider-timer.component.html',
  styleUrls: ['./timepicker-slider-timer.component.scss']
})
export class TimepickerSliderTimerComponent implements OnInit {
  @Input() label: string;
  @Input() min = 0;
  @Input() max = 59;

  private _value: number;
  get value(): number {
    return this._value;
  }

  @Input()
  set value(value: number) {
    this._value = value;
    this.model = value;
  }

  @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

  model: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

  valueChanges(newModel: number) {
    // console.log('new model', newModel);
    if (newModel !== undefined) {
      this.valueChange.emit(newModel);
    }
  }
}
