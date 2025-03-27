import { format, isValid, parseISO } from 'date-fns';

/** Strict input type for date parameter */
type DateInput = Date | string;

/**
 * Formats a date into German format (DD.MM.YYYY)
 * @param {DateInput} date - The date to format (Date object or date string)
 * @param {boolean} showTime - Whether to include time in the output
 * @returns {string} Formatted date string in German format
 */
export const dateFormat = (date: DateInput, showTime = false): string => {
  try {
    // Parse the date if it's a string
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;

    if (!isValid(parsedDate)) {
      // console.warn("Invalid date provided to dateFormat");
      return '';
    }

    // Define the format based on whether time is to be included
    const dateFormatString = showTime ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy';

    // Format the date using date-fns
    return format(parsedDate, dateFormatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

// Usage examples:
// dateFormat(new Date())                    // "20.01.2025"
// dateFormat("2025-01-20")                  // "20.01.2025"
// dateFormat(new Date(), true)              // "20.01.2025 14:30"
// dateFormat("2025-01-20T14:30:00", true)   // "20.01.2025 14:30"
