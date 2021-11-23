import { EventEmitter, Inject, Input, Optional, Directive } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { DateTimeAdapter } from '../adapter/date-time-adapter.class';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from '../adapter/date-time-format.class';

let nextUniqueId = 0;

export type PickerType = 'both' | 'calendar' | 'timer';

export type PickerMode = 'popup' | 'dialog' | 'inline';

export type SelectMode = 'single' | 'range' | 'rangeFrom' | 'rangeTo';

@Directive()
export abstract class OwlDateTime<T> {
  /**
   * Whether to show the second's timer
   */
  private _showSecondsTimer = false;
  @Input()
  get showSecondsTimer(): boolean {
    return this._showSecondsTimer;
  }

  set showSecondsTimer(val: boolean) {
    this._showSecondsTimer = coerceBooleanProperty(val);
  }

  /**
   * Whether the timer is in hour12 format
   */
  private _hour12Timer = false;
  @Input()
  get hour12Timer(): boolean {
    return this._hour12Timer;
  }

  set hour12Timer(val: boolean) {
    this._hour12Timer = coerceBooleanProperty(val);
  }

  /**
   * The view that the calendar should start in.
   */
  @Input()
  startView: 'month' | 'year' | 'multi-years' = 'month';

  /**
   * Hours to change per step
   */
  private _stepHour = 1;
  @Input()
  get stepHour(): number {
    return this._stepHour;
  }

  set stepHour(val: number) {
    this._stepHour = coerceNumberProperty(val, 1);
  }

  /**
   * Minutes to change per step
   */
  private _stepMinute = 1;
  @Input()
  get stepMinute(): number {
    return this._stepMinute;
  }

  set stepMinute(val: number) {
    this._stepMinute = coerceNumberProperty(val, 1);
  }

  /**
   * Seconds to change per step
   */
  private _stepSecond = 1;
  @Input()
  get stepSecond(): number {
    return this._stepSecond;
  }

  set stepSecond(val: number) {
    this._stepSecond = coerceNumberProperty(val, 1);
  }

  /**
   * Set the first day of week
   */
  private _firstDayOfWeek: number;
  @Input()
  get firstDayOfWeek() {
    return this._firstDayOfWeek;
  }

  set firstDayOfWeek(value: number) {
    value = coerceNumberProperty(value);
    if (value > 6 || value < 0) {
      this._firstDayOfWeek = undefined;
    } else {
      this._firstDayOfWeek = value;
    }
  }

  /**
   * Whether to hide dates in other months at the start or end of the current month.
   */
  private _hideOtherMonths = false;
  @Input()
  get hideOtherMonths(): boolean {
    return this._hideOtherMonths;
  }

  set hideOtherMonths(val: boolean) {
    this._hideOtherMonths = coerceBooleanProperty(val);
  }

  private readonly _id: string;
  get id(): string {
    return this._id;
  }

  abstract get selected(): T | null;

  abstract get selecteds(): T[] | null;

  abstract get dateTimeFilter(): (date: T | null) => boolean;

  abstract get maxDateTime(): T | null;

  abstract get minDateTime(): T | null;

  abstract get selectMode(): SelectMode;

  abstract get startAt(): T | null;

  abstract get opened(): boolean;

  abstract get pickerMode(): PickerMode;

  abstract get pickerType(): PickerType;

  abstract get isInSingleMode(): boolean;

  abstract get isInRangeMode(): boolean;

  abstract select(date: T | T[]): void;

  abstract yearSelected: EventEmitter<T>;

  abstract monthSelected: EventEmitter<T>;

  abstract selectYear(normalizedYear: T): void;

  abstract selectMonth(normalizedMonth: T): void;

  get formatString(): string {
    return this.pickerType === 'both'
      ? this.dateTimeFormats.display.fullInput
      : this.pickerType === 'calendar'
      ? this.dateTimeFormats.display.dateInput
      : this.dateTimeFormats.display.timeInput;
  }

  /**
   * Date Time Checker to check if the give dateTime is selectable
   */
  public dateTimeChecker = (dateTime: T) => {
    return (
      !!dateTime &&
      (!this.dateTimeFilter || this.dateTimeFilter(dateTime)) &&
      (!this.minDateTime || this.dateTimeAdapter.compareDate(dateTime, this.minDateTime) >= 0) &&
      (!this.maxDateTime || this.dateTimeAdapter.compareDate(dateTime, this.maxDateTime) <= 0)
    );
  };

  get disabled(): boolean {
    return false;
  }

  constructor(
    @Optional() protected dateTimeAdapter: DateTimeAdapter<T>,
    @Optional()
    @Inject(OWL_DATE_TIME_FORMATS)
    protected dateTimeFormats: OwlDateTimeFormats
  ) {
    if (!this.dateTimeAdapter) {
      throw Error(
        `OwlDateTimePicker: No provider found for DateTimeAdapter. You must import one of the following ` +
          `modules at your application root: OwlNativeDateTimeModule or provide a ` +
          `custom implementation.`
      );
    }

    if (!this.dateTimeFormats) {
      throw Error(
        `OwlDateTimePicker: No provider found for OWL_DATE_TIME_FORMATS. You must import one of the following ` +
          `modules at your application root: OwlNativeDateTimeModule or provide a ` +
          `custom implementation.`
      );
    }

    this._id = `owl-dt-picker-${nextUniqueId++}`;
  }

  protected getValidDate(obj: any): T | null {
    return this.dateTimeAdapter.isDateInstance(obj) && this.dateTimeAdapter.isValid(obj)
      ? obj
      : null;
  }
}
