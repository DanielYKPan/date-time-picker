import { OwlDateTimeFormats } from '../date-time-format.class';

export const OWL_NATIVE_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parse: {
    dateTimeInput: null
  },
  display: {
    fullInput: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
    timeInput: { hour: 'numeric', minute: 'numeric' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};
