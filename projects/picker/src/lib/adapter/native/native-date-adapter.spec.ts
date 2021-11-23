import { Platform } from '@angular/cdk/platform';
import { LOCALE_ID } from '@angular/core';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { NativeDateTimeAdapter } from './native-date-time-adapter.class';
import { NativeDateTimeModule } from './native-date-time.module';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE } from '../date-time-adapter.class';
import { DEC, FEB, JAN, MAR } from '../../utils/month-constants';

const SUPPORTS_INTL = typeof Intl !== 'undefined';

describe('NativeDateTimeAdapter', () => {
  let platform: Platform;
  let adapter: NativeDateTimeAdapter;
  let assertValidDate: (d: Date | null, valid: boolean) => void;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NativeDateTimeModule]
      }).compileComponents();
    })
  );

  beforeEach(inject(
    [DateTimeAdapter, Platform],
    (dateAdapter: NativeDateTimeAdapter, _platform: Platform) => {
      adapter = dateAdapter;
      platform = _platform;

      assertValidDate = (d: Date | null, valid: boolean) => {
        expect(adapter.isDateInstance(d)).not.toBeNull(`Expected ${d} to be a date instance`);
        expect(adapter.isValid(d!)).toBe(
          valid,
          `Expected ${d} to be ${valid ? 'valid' : 'invalid'},` +
            ` but was ${valid ? 'invalid' : 'valid'}`
        );
      };
    }
  ));

  it('should get year', () => {
    expect(adapter.getYear(new Date(2017, JAN, 1))).toBe(2017);
  });

  it('should get month', () => {
    expect(adapter.getMonth(new Date(2017, JAN, 1))).toBe(0);
  });

  it('should get date', () => {
    expect(adapter.getDate(new Date(2017, JAN, 1))).toBe(1);
  });

  it('should get day of week', () => {
    expect(adapter.getDayOfWeek(new Date(2017, JAN, 1))).toBe(0);
  });

  it('should get long month names', () => {
    expect(adapter.getMonthNames('long')).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]);
  });

  it('should get short month names', () => {
    expect(adapter.getMonthNames('short')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]);
  });

  it('should get narrow month names', () => {
    // Edge & IE use same value for short and narrow.
    if (platform.EDGE || platform.TRIDENT) {
      expect(adapter.getMonthNames('narrow')).toEqual([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ]);
    } else {
      expect(adapter.getMonthNames('narrow')).toEqual([
        'J',
        'F',
        'M',
        'A',
        'M',
        'J',
        'J',
        'A',
        'S',
        'O',
        'N',
        'D'
      ]);
    }
  });

  it('should get month names in a different locale', () => {
    adapter.setLocale('ja-JP');
    if (SUPPORTS_INTL) {
      expect(adapter.getMonthNames('long')).toEqual([
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ]);
    } else {
      expect(adapter.getMonthNames('long')).toEqual([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]);
    }
  });

  it('should get date names', () => {
    expect(adapter.getDateNames()).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31'
    ]);
  });

  it('should get date names in a different locale', () => {
    adapter.setLocale('ja-JP');
    if (SUPPORTS_INTL) {
      expect(adapter.getDateNames()).toEqual([
        '1日',
        '2日',
        '3日',
        '4日',
        '5日',
        '6日',
        '7日',
        '8日',
        '9日',
        '10日',
        '11日',
        '12日',
        '13日',
        '14日',
        '15日',
        '16日',
        '17日',
        '18日',
        '19日',
        '20日',
        '21日',
        '22日',
        '23日',
        '24日',
        '25日',
        '26日',
        '27日',
        '28日',
        '29日',
        '30日',
        '31日'
      ]);
    } else {
      expect(adapter.getDateNames()).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
      ]);
    }
  });

  it('should get long day of week names', () => {
    expect(adapter.getDayOfWeekNames('long')).toEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]);
  });

  it('should get short day of week names', () => {
    expect(adapter.getDayOfWeekNames('short')).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat'
    ]);
  });

  it('should get narrow day of week names', () => {
    // Edge & IE use two-letter narrow days.
    if (platform.EDGE || platform.TRIDENT) {
      expect(adapter.getDayOfWeekNames('narrow')).toEqual([
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa'
      ]);
    } else {
      expect(adapter.getDayOfWeekNames('narrow')).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
    }
  });

  it('should get day of week names in a different locale', () => {
    adapter.setLocale('ja-JP');
    if (SUPPORTS_INTL) {
      expect(adapter.getDayOfWeekNames('long')).toEqual([
        '日曜日',
        '月曜日',
        '火曜日',
        '水曜日',
        '木曜日',
        '金曜日',
        '土曜日'
      ]);
    } else {
      expect(adapter.getDayOfWeekNames('long')).toEqual([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]);
    }
  });

  it('should get year name', () => {
    expect(adapter.getYearName(new Date(2017, JAN, 1))).toBe('2017');
  });

  it('should get year name in a different locale', () => {
    adapter.setLocale('ja-JP');
    if (SUPPORTS_INTL) {
      expect(adapter.getYearName(new Date(2017, JAN, 1))).toBe('2017年');
    } else {
      expect(adapter.getYearName(new Date(2017, JAN, 1))).toBe('2017');
    }
  });

  it('should get first day of week', () => {
    expect(adapter.getFirstDayOfWeek()).toBe(0);
  });

  it('should create Date', () => {
    expect(adapter.createDate(2017, JAN, 1)).toEqual(new Date(2017, JAN, 1));
  });

  it('should not create Date with month over/under-flow', () => {
    expect(() => adapter.createDate(2017, DEC + 1, 1)).toThrow();
    expect(() => adapter.createDate(2017, JAN - 1, 1)).toThrow();
  });

  it('should not create Date with date over/under-flow', () => {
    expect(() => adapter.createDate(2017, JAN, 32)).toThrow();
    expect(() => adapter.createDate(2017, JAN, 0)).toThrow();
  });

  it('should create Date with low year number', () => {
    expect(adapter.createDate(-1, JAN, 1).getFullYear()).toBe(-1);
    expect(adapter.createDate(0, JAN, 1).getFullYear()).toBe(0);
    expect(adapter.createDate(50, JAN, 1).getFullYear()).toBe(50);
    expect(adapter.createDate(99, JAN, 1).getFullYear()).toBe(99);
    expect(adapter.createDate(100, JAN, 1).getFullYear()).toBe(100);
  });

  it("should get today's date", () => {
    expect(adapter.sameDate(adapter.now(), new Date())).toBe(
      true,
      "should be equal to today's date"
    );
  });

  it('should parse string', () => {
    expect(adapter.parse('1/1/2017')).toEqual(new Date(2017, JAN, 1));
  });

  it('should parse number', () => {
    const timestamp = new Date().getTime();
    expect(adapter.parse(timestamp)).toEqual(new Date(timestamp));
  });

  it('should parse Date', () => {
    const date = new Date(2017, JAN, 1);
    expect(adapter.parse(date)).toEqual(date);
    expect(adapter.parse(date)).not.toBe(date);
  });

  it('should parse invalid value as invalid', () => {
    const d = adapter.parse('hello');
    expect(d).not.toBeNull();
    expect(adapter.isDateInstance(d)).toBe(
      true,
      'Expected string to have been fed through Date.parse'
    );
    expect(adapter.isValid(d as Date)).toBe(false, 'Expected to parse as "invalid date" object');
  });

  it('should format', () => {
    if (SUPPORTS_INTL) {
      expect(adapter.format(new Date(2017, JAN, 1), {})).toEqual('1/1/2017');
    } else {
      expect(adapter.format(new Date(2017, JAN, 1), {})).toEqual('Sun Jan 01 2017');
    }
  });

  it('should format with custom format', () => {
    if (SUPPORTS_INTL) {
      expect(
        adapter.format(new Date(2017, JAN, 1), {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      ).toEqual('January 1, 2017');
    } else {
      expect(
        adapter.format(new Date(2017, JAN, 1), {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      ).toEqual('Sun Jan 01 2017');
    }
  });

  it('should format with a different locale', () => {
    adapter.setLocale('ja-JP');
    if (SUPPORTS_INTL) {
      // Edge & IE use a different format in Japanese.
      if (platform.EDGE || platform.TRIDENT) {
        expect(adapter.format(new Date(2017, JAN, 1), {})).toEqual('2017年1月1日');
      } else {
        expect(adapter.format(new Date(2017, JAN, 1), {})).toEqual('2017/1/1');
      }
    } else {
      expect(adapter.format(new Date(2017, JAN, 1), {})).toEqual('Sun Jan 01 2017');
    }
  });

  it('should throw when attempting to format invalid date', () => {
    expect(() => adapter.format(new Date(NaN), {})).toThrowError(
      /NativeDateAdapter: Cannot format invalid date\./
    );
  });

  it('should add years', () => {
    expect(adapter.addCalendarYears(new Date(2017, JAN, 1), 1)).toEqual(new Date(2018, JAN, 1));
    expect(adapter.addCalendarYears(new Date(2017, JAN, 1), -1)).toEqual(new Date(2016, JAN, 1));
  });

  it('should respect leap years when adding years', () => {
    expect(adapter.addCalendarYears(new Date(2016, FEB, 29), 1)).toEqual(new Date(2017, FEB, 28));
    expect(adapter.addCalendarYears(new Date(2016, FEB, 29), -1)).toEqual(new Date(2015, FEB, 28));
  });

  it('should add months', () => {
    expect(adapter.addCalendarMonths(new Date(2017, JAN, 1), 1)).toEqual(new Date(2017, FEB, 1));
    expect(adapter.addCalendarMonths(new Date(2017, JAN, 1), -1)).toEqual(new Date(2016, DEC, 1));
  });

  it('should respect month length differences when adding months', () => {
    expect(adapter.addCalendarMonths(new Date(2017, JAN, 31), 1)).toEqual(new Date(2017, FEB, 28));
    expect(adapter.addCalendarMonths(new Date(2017, MAR, 31), -1)).toEqual(new Date(2017, FEB, 28));
  });

  it('should add days', () => {
    expect(adapter.addCalendarDays(new Date(2017, JAN, 1), 1)).toEqual(new Date(2017, JAN, 2));
    expect(adapter.addCalendarDays(new Date(2017, JAN, 1), -1)).toEqual(new Date(2016, DEC, 31));
  });

  it('should clone', () => {
    const date = new Date(2017, JAN, 1);
    expect(adapter.clone(date)).toEqual(date);
    expect(adapter.clone(date)).not.toBe(date);
  });

  it('should preserve time when cloning', () => {
    const date = new Date(2017, JAN, 1, 4, 5, 6);
    expect(adapter.clone(date)).toEqual(date);
    expect(adapter.clone(date)).not.toBe(date);
  });

  it('should compare dates', () => {
    expect(adapter.compareDate(new Date(2017, JAN, 1), new Date(2017, JAN, 2))).toBeLessThan(0);
    expect(adapter.compareDate(new Date(2017, JAN, 1), new Date(2017, FEB, 1))).toBeLessThan(0);
    expect(adapter.compareDate(new Date(2017, JAN, 1), new Date(2018, JAN, 1))).toBeLessThan(0);
    expect(adapter.compareDate(new Date(2017, JAN, 1), new Date(2017, JAN, 1))).toBe(0);
    expect(adapter.compareDate(new Date(2018, JAN, 1), new Date(2017, JAN, 1))).toBeGreaterThan(0);
    expect(adapter.compareDate(new Date(2017, FEB, 1), new Date(2017, JAN, 1))).toBeGreaterThan(0);
    expect(adapter.compareDate(new Date(2017, JAN, 2), new Date(2017, JAN, 1))).toBeGreaterThan(0);
  });

  it('should clamp date at lower bound', () => {
    expect(
      adapter.clampDate(new Date(2017, JAN, 1), new Date(2018, JAN, 1), new Date(2019, JAN, 1))
    ).toEqual(new Date(2018, JAN, 1));
  });

  it('should clamp date at upper bound', () => {
    expect(
      adapter.clampDate(new Date(2020, JAN, 1), new Date(2018, JAN, 1), new Date(2019, JAN, 1))
    ).toEqual(new Date(2019, JAN, 1));
  });

  it('should clamp date already within bounds', () => {
    expect(
      adapter.clampDate(new Date(2018, FEB, 1), new Date(2018, JAN, 1), new Date(2019, JAN, 1))
    ).toEqual(new Date(2018, FEB, 1));
  });

  it('should use UTC for formatting by default', () => {
    if (SUPPORTS_INTL) {
      expect(adapter.format(new Date(1800, 7, 14), { day: 'numeric' })).toBe('14');
    } else {
      expect(adapter.format(new Date(1800, 7, 14), { day: 'numeric' })).toBe('Thu Aug 14 1800');
    }
  });

  it('should count today as a valid date instance', () => {
    const d = new Date();
    expect(adapter.isValid(d)).toBe(true);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it('should count an invalid date as an invalid date instance', () => {
    const d = new Date(NaN);
    expect(adapter.isValid(d)).toBe(false);
    expect(adapter.isDateInstance(d)).toBe(true);
  });

  it('should count a string as not a date instance', () => {
    const d = '1/1/2017';
    expect(adapter.isDateInstance(d)).toBe(false);
  });

  it('should create dates from valid ISO strings', () => {
    assertValidDate(adapter.deserialize('1985-04-12T23:20:50.52Z'), true);
    assertValidDate(adapter.deserialize('1996-12-19T16:39:57-08:00'), true);
    assertValidDate(adapter.deserialize('1937-01-01T12:00:27.87+00:20'), true);
    assertValidDate(adapter.deserialize('2017-01-01'), true);
    assertValidDate(adapter.deserialize('2017-01-01T00:00:00'), true);
    assertValidDate(adapter.deserialize('1990-13-31T23:59:00Z'), false);
    assertValidDate(adapter.deserialize('1/1/2017'), false);
    assertValidDate(adapter.deserialize('2017-01-01T'), false);
    expect(adapter.deserialize('')).toBeNull();
    expect(adapter.deserialize(null)).toBeNull();
    assertValidDate(adapter.deserialize(new Date()), true);
    assertValidDate(adapter.deserialize(new Date(NaN)), false);
  });

  it('should create an invalid date', () => {
    assertValidDate(adapter.invalid(), false);
  });

  it('should not throw when attempting to format a date with a year less than 1', () => {
    expect(() => adapter.format(new Date(-1, 1, 1), {})).not.toThrow();
  });

  it('should not throw when attempting to format a date with a year greater than 9999', () => {
    expect(() => adapter.format(new Date(10000, 1, 1), {})).not.toThrow();
  });
});

describe('NativeDateTimeAdapter with OWL_DATE_TIME_LOCALE override', () => {
  let adapter: NativeDateTimeAdapter;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NativeDateTimeModule],
        providers: [{ provide: OWL_DATE_TIME_LOCALE, useValue: 'da-DK' }]
      }).compileComponents();
    })
  );

  beforeEach(inject([DateTimeAdapter], (d: NativeDateTimeAdapter) => {
    adapter = d;
  }));

  it('should take the default locale id from the MAT_DATE_LOCALE injection token', () => {
    const expectedValue = SUPPORTS_INTL
      ? ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    expect(adapter.getDayOfWeekNames('long')).toEqual(expectedValue);
  });
});

describe('NativeDateTimeAdapter with LOCALE_ID override', () => {
  let adapter: NativeDateTimeAdapter;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NativeDateTimeModule],
        providers: [{ provide: LOCALE_ID, useValue: 'da-DK' }]
      }).compileComponents();
    })
  );

  beforeEach(inject([DateTimeAdapter], (d: NativeDateTimeAdapter) => {
    adapter = d;
  }));

  it('should cascade locale id from the LOCALE_ID injection token to MAT_DATE_LOCALE', () => {
    const expectedValue = SUPPORTS_INTL
      ? ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    expect(adapter.getDayOfWeekNames('long')).toEqual(expectedValue);
  });
});
