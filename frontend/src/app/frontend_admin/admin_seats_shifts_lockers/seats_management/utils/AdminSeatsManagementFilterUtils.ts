/** Returns true when a canonical filter matches the value or selects the all-values option. */
export function matchesAdminSeatsFilter(
  actualValue: string,
  selectedValue: string,
  allValue = 'all',
): boolean {
  return selectedValue === allValue || actualValue === selectedValue;
}
