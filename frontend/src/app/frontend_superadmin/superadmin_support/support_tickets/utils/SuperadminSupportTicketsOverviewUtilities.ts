// FLOW: Feature caller -> superadmin_support/support_tickets/utils/SuperadminSupportTicketsOverviewUtilities.ts -> typed input/contract -> deterministic helper result.
/** Responsibility: Superadmin Support Tickets Utilities; provides focused module-owned formatting or pure utility behavior. */
import type { SuperadminSupportTicket, SuperadminSupportTicketsFilter } from '@/app/frontend_superadmin/superadmin_support/support_tickets/types/SuperadminSupportTicketsOverviewTypes';

const CSV_COLUMNS = ['id', 'subject', 'tenant', 'assignee', 'status', 'priority', 'category', 'age'] as const satisfies readonly (keyof SuperadminSupportTicket)[];

const SUPPORT_TICKET_AGE_MINUTES = {
  minute: 1,
  hour: 60,
  day: 24 * 60,
  week: 7 * 24 * 60,
  month: 30 * 24 * 60,
  year: 365 * 24 * 60,
} as const;

/** Converts a displayed relative-age label to a chronological minute value. Unknown labels return null. */
export function parseSuperadminSupportTicketAgeMinutes(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = value.trim().toLocaleLowerCase().match(/^(\d+(?:\.\d+)?)\s*(minutes?|hours?|days?|weeks?|months?|years?)$/);
  if (!match) return null;
  const quantity = Number(match[1]);
  const unit = match[2].replace(/s$/, '') as keyof typeof SUPPORT_TICKET_AGE_MINUTES;
  if (!Number.isFinite(quantity) || quantity < 0) return null;
  return quantity * SUPPORT_TICKET_AGE_MINUTES[unit];
}

/** Compares ticket ages by elapsed duration rather than the lexical spelling of mixed units. */
export function compareSuperadminSupportTicketAges(left: unknown, right: unknown): number {
  const leftMinutes = parseSuperadminSupportTicketAgeMinutes(left);
  const rightMinutes = parseSuperadminSupportTicketAgeMinutes(right);
  if (leftMinutes !== null && rightMinutes !== null) return leftMinutes - rightMinutes;
  if (leftMinutes !== null) return -1;
  if (rightMinutes !== null) return 1;
  return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true, sensitivity: 'base' });
}

function csvCell(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

/** Filters the current preview state; it never implies an API-backed support query. 
 * @param tickets - Input supplied by the caller under the declared TypeScript contract.
 * @param filter - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function filterSuperadminSupportTickets(tickets: readonly SuperadminSupportTicket[], filter: SuperadminSupportTicketsFilter): SuperadminSupportTicket[] {
  return filter === 'All' ? [...tickets] : tickets.filter((ticket) => ticket.status === filter);
}

/** Creates an explicitly classified UTF-8 CSV from the current sample preview rows. 
 * @param tickets - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example buildSuperadminSupportTicketsPreviewCsv(tickets) uses the declared inputs to produce the module's canonical output.
 */
export function buildSuperadminSupportTicketsPreviewCsv(tickets: readonly SuperadminSupportTicket[]): string {
  const classificationRow = ['DATA CLASSIFICATION: SAMPLE PREVIEW — NOT LIVE SUPPORT TICKETS', ...Array(CSV_COLUMNS.length - 1).fill('')];
  return '\uFEFF' + [
    classificationRow.map(csvCell).join(','),
    CSV_COLUMNS.map(csvCell).join(','),
    ...tickets.map((ticket) => CSV_COLUMNS.map((column) => csvCell(ticket[column])).join(',')),
  ].join('\r\n');
}

/** Downloads an already-built preview CSV and defers URL revocation until the browser has started the download. 
 * @param csv - Input supplied by the caller under the declared TypeScript contract.
 * @returns No value; this function wires lifecycle behavior for the owning feature.
 * @example downloadSuperadminSupportTicketsPreviewCsv(csv) uses the declared inputs to produce the module's canonical output.
 */
export function downloadSuperadminSupportTicketsPreviewCsv(csv: string): void {
  const objectUrl = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'superadmin_sample_support_tickets_preview.csv';
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
