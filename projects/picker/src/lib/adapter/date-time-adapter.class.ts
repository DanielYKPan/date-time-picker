import { Observable, Subject } from 'rxjs';
import { inject, InjectionToken, LOCALE_ID } from '@angular/core';

/** InjectionToken for date-time picker that can be used to override default locale code. */
export const OWL_DATE_TIME_LOCALE = new InjectionToken<string>('OWL_DATE_TIME_LOCALE', {
  providedIn: 'root',
  factory: OWL_DATE_TIME_LOCALE_FACTORY
});

/** @docs-private */
export function OWL_DATE_TIME_LOCALE_FACTORY(): string {
  return inject(LOCALE_ID);
}

/** Adapts type `T` to be usable as a date by cdk-based components that work with dates. */
export abstract class DateTimeAdapter<T> {
  /** The locale to use for all dates. */
  protected locale: string;
  /** total milliseconds in a day. */
  protected readonly millisecondsInDay = 86400000;
  /** total milliseconds in a minute. */
  protected readonly milliseondsInMinute = 60000;

  protected _localeChanges = new Subject<void>();

  /** A stream that emits when the locale changes. */
  get localeChanges(): Observable<void> {
    return this._localeChanges;
  }

  /**
   * Gets the year component of the given date.
   * @param date The date to extract the year from.
   * @returns The year component.
   */
  abstract getYear(date: T): number;

  /**
   * Gets the month component of the given date.
   * @param date The date to extract the month from.
   * @returns The month component (0-indexed, 0 = January).
   */
  abstract getMonth(date: T): number;

  /**
   * Gets the date of the month component of the given date.
   * @param date The date to extract the date of the month from.
   * @returns The month component (1-indexed, 1 = first of month).
   */
  abstract getDate(date: T): number;

  /**
   * Gets the day of the week component of the given date.
   * @param date The date to extract the day of the week from.
   * @returns The month component (0-indexed, 0 = Sunday).
   */
  abstract getDayOfWeek(date: T): number;

  /**
   * Gets a list of names for the months.
   * @param style The naming style (e.g. long = 'January', short = 'Jan', narrow = 'J').
   * @returns An ordered list of all month names, starting with January.
   */
  abstract getMonthNames(style: 'long' | 'short' | 'narrow'): string[];

  /**
   * Gets a list of names for the dates of the month.
   * @returns An ordered list of all date of the month names, starting with '1'.
   */
  abstract getDateNames(): string[];

  /**
   * Gets a list of names for the days of the week.
   * @param style The naming style (e.g. long = 'Sunday', short = 'Sun', narrow = 'S').
   * @returns An ordered list of all weekday names, starting with Sunday.
   */
  abstract getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];

  /**
   * Gets the name for the year of the given date.
   * @param date The date to get the year name for.
   * @returns The name of the given year (e.g. '2017').
   */
  abstract getYearName(date: T): string;

  /**
   * Gets the first day of the week.
   * @returns The first day of the week (0-indexed, 0 = Sunday).
   */
  abstract getFirstDayOfWeek(): number;

  /**
   * Gets the number of days in the month of the given date.
   * @param date The date whose month should be checked.
   * @returns The number of days in the month of the given date.
   */
  abstract getNumDaysInMonth(date: T): number;

  /**
   * Gets the hours component of the given date.
   * @param date The date to extract the hours from.
   * @returns The hours component.
   */
  abstract getHours(date: T): number;

  /**
   * Gets the minutes component of the given date.
   * @param date The date to extract the minutes from.
   * @returns The minutes component.
   */
  abstract getMinutes(date: T): number;

  /**
   * Gets the seconds component of the given date.
   * @param date The date to extract the seconds from.
   * @returns The seconds component.
   */
  abstract getSeconds(date: T): number;

  /**
   * Gets the milliseconds component of the given date.
   * @param date The date to extract the milliseconds from.
   * @returns The milliseconds component.
   */
  abstract getMilliseconds(date: T): number;

  /**
   * Gets the milliseconds timestamp component of the given date.
   * @param date The date to extract the milliseconds timestamp from.
   * @returns The milliseconds timestamp component.
   */
  abstract getTime(date: T): number;

  /**
   * Clones the given date.
   * @param date The date to clone
   * @returns A new date equal to the given date.
   */
  abstract clone(date: T): T;

  /**
   * Creates a date with the given year, month, and date. Does not allow over/under-flow of the
   * month and date.
   * @param year The full year of the date. (e.g. 89 means the year 89, not the year 1989).
   * @param month The month of the date (0-indexed, 0 = January). Must be an integer 0 - 11.
   * @param date The date of month of the date. Must be an integer 1 - length of the given month.
   * @param hours The hours of the date.
   * @param minutes The minutes of the date.
   * @param seconds The seconds of the date.
   * @param ms The milliseconds of the date.
   * @returns The new date, or null if invalid.
   */
  abstract createDate(
    year: number,
    month: number,
    date: number,
    hours?: number,
    minutes?: number,
    seconds?: number,
    ms?: number
  ): T;

  /**
   * Gets current time.
   * @returns Current time.
   */
  abstract now(): T;

  /**
   * Parses a date from a user-provided value.
   * @param value The value to parse.
   * @param parseFormat The expected format of the value being parsed
   *     (type is implementation-dependent).
   * @returns The parsed date.
   */
  abstract parse(value: any, parseFormat: any): T | null;

  /**
   * Formats a date as a string according to the given format.
   * @param date The value to format.
   * @param displayFormat The format to use to display the date as a string.
   * @returns The formatted date string.
   */
  abstract format(date: T, displayFormat: any): string;

  /**
   * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
   * calendar for each year and then finding the closest date in the new month. For example when
   * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
   * @param date The date to add years to.
   * @param years The number of years to add (may be negative).
   * @returns A new date equal to the given one with the specified number of years added.
   */
  abstract addCalendarYears(date: T, years: number): T;

  /**
   * Adds the given number of months to the date. Months are counted as if flipping a page on the
   * calendar for each month and then finding the closest date in the new month. For example when
   * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
   * @param date The date to add months to.
   * @param months The number of months to add (may be negative).
   * @returns A new date equal to the given one with the specified number of months added.
   */
  abstract addCalendarMonths(date: T, months: number): T;

  /**
   * Adds the given number of days to the date. Days are counted as if moving one cell on the
   * calendar for each day.
   * @param date The date to add days to.
   * @param days The number of days to add (may be negative).
   * @returns A new date equal to the given one with the specified number of days added.
   */
  abstract addCalendarDays(date: T, days: number): T;

  /**
   * Adds the given number of hours to the date.
   * @param date The date to add hours to.
   * @param hours The number of hours to add (may be negative).
   * @returns A new date equal to the given one with the specified number of hours added.
   */
  abstract addTimerHours(date: T, hours: number): T;

  /**
   * Adds the given number of minutes to the date.
   * @param date The date to add minutes to.
   * @param minutes The number of minutes to add (may be negative).
   * @returns A new date equal to the given one with the specified number of minutes added.
   */
  abstract addTimerMinutes(date: T, minutes: number): T;

  /**
   * Adds the given number of seconds to the date.
   * @param date The date to add seconds to.
   * @param seconds The number of seconds to add (may be negative).
   * @returns A new date equal to the given one with the specified number of seconds added.
   */
  abstract addTimerSeconds(date: T, seconds: number): T;

  /**
   * Adds the given number of milliseconds to the date.
   * @param date The date to add milliseconds to.
   * @param milliseconds The number of milliseconds to add (may be negative).
   * @returns A new date equal to the given one with the specified number of milliseconds added.
   */
  abstract addTimerMilliseconds(date: T, milliseconds: number): T;

  /**
   * Gets the RFC 3339 compatible string (https://tools.ietf.org/html/rfc3339) for the given date.
   * This method is used to generate date strings that are compatible with native HTML attributes
   * such as the `min` or `max` attribute of an `<input>`.
   * @param date The date to get the ISO date string for.
   * @returns The ISO date string date string.
   */
  abstract toIso8601(date: T): string;

  /**
   * Checks whether the given object is considered a date instance by this DateAdapter.
   * @param obj The object to check
   * @returns Whether the object is a date instance.
   */
  abstract isDateInstance(obj: any): boolean;

  /**
   * Checks whether the given date is valid.
   * @param date The date to check.
   * @returns Whether the date is valid.
   */
  abstract isValid(date: T): boolean;

  /**
   * Gets date instance that is not valid.
   * @returns An invalid date.
   */
  abstract invalid(): T;

  /**
   * Get the number of calendar days between the given dates.
   * If dateLeft is before dateRight, it would return positive value
   * If dateLeft is after dateRight, it would return negative value
   */
  abstract differenceInCalendarDays(dateLeft: T, dateRight: T): number;

  /**
   * Attempts to deserialize a value to a valid date object. This is different from parsing in that
   * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
   * string). The default implementation does not allow any deserialization, it simply checks that
   * the given value is already a valid date object or null. The `<mat-datepicker>` will call this
   * method on all of its `@Input()` properties that accept dates. It is therefore possible to
   * support passing values from your backend directly to these properties by overriding this method
   * to also deserialize the format used by your backend.
   * @param value The value to be deserialized into a date object.
   * @returns The deserialized date object, either a valid date, null if the value can be
   *     deserialized into a null date (e.g. the empty string), or an invalid date.
   */
  deserialize(value: any): T | null {
    if (value == null || (this.isDateInstance(value) && this.isValid(value))) {
      return value;
    }
    return this.invalid();
  }

  /**
   * Sets the locale used for all dates.
   * @param locale The new locale.
   */
  setLocale(locale: string) {
    this.locale = locale;
    this._localeChanges.next();
  }

  /**
   * Compares two dates.
   * @param first The first date to compare.
   * @param second The second date to compare.
   * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
   *     a number greater than 0 if the first date is later.
   */
  compareDate(first: T, second: T): number {
    return this.getTime(first) - this.getTime(second);
  }

  /**
   * Checks if two dates are equal.
   * @param first The first date to check.
   * @param second The second date to check.
   * @returns Whether the two dates are equal.
   *     Null dates are considered equal to other null dates.
   */
  sameDate(first: T | null, second: T | null): boolean {
    if (first && second) {
      const firstValid = this.isValid(first);
      const secondValid = this.isValid(second);
      if (firstValid && secondValid) {
        return !this.compareDate(first, second);
      }
      return firstValid === secondValid;
    }
    return first === second;
  }

  /**
   * Clamp the given date between min and max dates.
   * @param date The date to clamp.
   * @param min The minimum value to allow. If null or omitted no min is enforced.
   * @param max The maximum value to allow. If null or omitted no max is enforced.
   * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
   *     otherwise `date`.
   */
  clampDate(date: T, min?: T | null, max?: T | null): T {
    if (min && this.compareDate(date, min) < 0) {
      return min;
    }
    if (max && this.compareDate(date, max) > 0) {
      return max;
    }
    return date;
  }
}
