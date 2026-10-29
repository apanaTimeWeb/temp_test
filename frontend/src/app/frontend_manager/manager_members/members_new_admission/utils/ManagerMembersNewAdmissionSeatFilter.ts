/**
 * Normalize seat labels for matching the dashboard seat-matrix route parameter
 * against student-list values. The seat-matrix adapter removes an optional
 * `S-` prefix before exposing its seat ID, so the filter accepts either form.
 */
export function normalizeManagerNewAdmissionSeatFilter(value: string): string {
  return value.trim().toLowerCase().replace(/^s-/, '');
}
