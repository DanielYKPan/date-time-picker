import { InjectionToken } from '@angular/core';

export interface OwlDateTimeFormats {
  parse: {
    dateTimeInput: any;
  };
  display: {
    fullInput: any;
    dateInput: any;
    timeInput: any;
    monthYearLabel: any;
    dateA11yLabel: any;
    monthYearA11yLabel: any;
  };
}

/** InjectionToken for date time picker that can be used to override default format. */
export const OWL_DATE_TIME_FORMATS = new InjectionToken<OwlDateTimeFormats>(
  'owl-date-time-formats'
);
