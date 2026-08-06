/**
 * date.utils
 */

/**
 * Creates a date with the given year, month, date, hour, minute and second. Does not allow over/under-flow of the
 * month and date.
 */
export function createDate(
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0
): Date {
    if (month < 0 || month > 11) {
        throw Error(
            `Invalid month index "${month}". Month index has to be between 0 and 11.`
        );
    }

    if (date < 1) {
        throw Error(
            `Invalid date "${date}". Date has to be greater than 0.`
        );
    }

    if (hours < 0 || hours > 23) {
        throw Error(
            `Invalid hours "${hours}". Hours has to be between 0 and 23.`
        );
    }

    if (minutes < 0 || minutes > 59) {
        throw Error(
            `Invalid minutes "${minutes}". Minutes has to between 0 and 59.`
        );
    }

    if (seconds < 0 || seconds > 59) {
        throw Error(
            `Invalid seconds "${seconds}". Seconds has to be between 0 and 59.`
        );
    }

    const result = createDateWithOverflow(
        year,
        month,
        date,
        hours,
        minutes,
        seconds
    );

    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    // For example, createDate(2017, 1, 31) would try to create a date 2017/02/31 which is invalid
    if (result.getMonth() !== month) {
        throw Error(
            `Invalid date "${date}" for month with index "${month}".`
        );
    }

    return result;
}

/**
 * Gets the number of days in the month of the given date.
 */
export function getNumDaysInMonth(date: Date): number {
    const lastDateOfMonth = createDateWithOverflow(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    );

    return lastDateOfMonth.getDate();
}

/**
 * Creates a date but allows the month and date to overflow.
 */
function createDateWithOverflow(
    year: number,
    month: number,
    date: number,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0
): Date {
    const result = new Date(year, month, date, hours, minutes, seconds);

    if (year >= 0 && year < 100) {
        result.setFullYear(result.getFullYear() - 1900);
    }
    return result;
}
