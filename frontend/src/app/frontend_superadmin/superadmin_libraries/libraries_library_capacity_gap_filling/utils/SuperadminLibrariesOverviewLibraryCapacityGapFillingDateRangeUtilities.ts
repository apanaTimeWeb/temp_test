// RESPONSIBILITY: Format typed values for libraries library capacity gap filling display using the supplied locale/currency contract; it does not mutate underlying values.
// FLOW: Feature UI -> superadmin_libraries/libraries_library_capacity_gap_filling/utils/SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRangeUtilities.ts -> typed values and locale -> formatted display output.
/** Date-only range used by the local library-capacity preview, normalized to UTC calendar days. */
export interface SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRange {
  /** Inclusive UTC start date in YYYY-MM-DD form. */
  fromDate: string;
  /** Inclusive UTC end date in YYYY-MM-DD form. */
  toDate: string;
}

/**
 * Creates a rolling date range starting on the supplied UTC calendar day.
 * @param now Reference instant; defaults to the current instant when omitted.
 * @param daysAhead Number of days between the start date and end date.
 * @returns A stable YYYY-MM-DD date range suitable for URL state and date inputs.
 */
export function SuperadminLibrariesOverviewGetDefaultUtcDateRange(
  now: Date = new Date(),
  daysAhead = 7,
): SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRange {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + Math.max(0, Math.trunc(daysAhead)));
  return { fromDate: start.toISOString().slice(0, 10), toDate: end.toISOString().slice(0, 10) };
}

/** Validates a real ISO calendar date rather than accepting regex-shaped impossible dates. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function SuperadminLibrariesOverviewIsValidUtcCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
