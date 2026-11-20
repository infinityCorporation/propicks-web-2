import { format, parseISO } from 'date-fns';

export const formatGameDateParts = (isoString) => {
  const date = parseISO(isoString);
  
  // 1. Establish the boundary dates (Current Date +/- 1 Month)
  const now = new Date();

  // Calculate minimum boundary: Current date minus 1 month
  const minDate = new Date(now);
  minDate.setMonth(now.getMonth() - 1);

  const minYear = new Date(now);
  minYear.setMonth(now.getMonth() - 12);

  // Calculate maximum boundary: Current date plus 1 month
  const maxDate = new Date(now);
  maxDate.setMonth(now.getMonth() + 1);

  const maxYear = new Date(now);
  maxYear.setMonth(now.getMonth() + 12);

  // 2. Check if the input date is outside the one-month window
  const needsMonthDisplay = (date < minDate || date > maxDate);
  const needsYearDisplay = (date < minDate || date > maxDate);

  let dayFormat;
  if (needsMonthDisplay) {
    dayFormat = "EEE, MMM do"; 
  } else if (needsYearDisplay) {
    dayFormat = "MMM do, yyyy";
  } else {
    // If it's close, omit year: "EEE do"
    dayFormat = "EEE do";
  }

  const dayPart = format(date, dayFormat);        // e.g., "Mon 14th 2025" or "Mon 14th"
  const timePart = format(date, "h:mmaaa").toLowerCase(); // Time part remains the same

  return { dayPart, timePart };
};

