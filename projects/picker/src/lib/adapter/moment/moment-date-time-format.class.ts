import { OwlDateTimeFormats } from '../date-time-format.class';

export const OWL_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parse: {
    dateTimeInput: 'l LT'
  },
  display: {
    fullInput: 'l LT',
    dateInput: 'l',
    timeInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
