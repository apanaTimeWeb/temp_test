/** Returns true when a canonical filter matches the value or selects the all-values option. */
export function matchesAdminSeatsFilter(
  actualValue: string,
  selectedValue: string,
  allValue = 'all',
): boolean {
  return selectedValue === allValue || actualValue === selectedValue;
}

const MONTH_INDEX_BY_ABBREVIATION: Readonly<Record<string, number>> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

/** Converts the module's `dd MMM yyyy` display dates to ISO dates for stable comparisons. */
export function toIsoAdminSeatsDisplayDate(value: string): string {
  const match = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(value.trim());
  if (!match) return '';

  const [, dayPart, monthAbbreviation, yearPart] = match;
  if (!dayPart || !monthAbbreviation || !yearPart) return '';

  const day = Number(dayPart);
  const monthIndex = MONTH_INDEX_BY_ABBREVIATION[monthAbbreviation];
  const year = Number(yearPart);
  if (monthIndex === undefined || day < 1 || day > 31) return '';

  const parsed = new Date(Date.UTC(year, monthIndex, day));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== monthIndex || parsed.getUTCDate() !== day) return '';

  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
