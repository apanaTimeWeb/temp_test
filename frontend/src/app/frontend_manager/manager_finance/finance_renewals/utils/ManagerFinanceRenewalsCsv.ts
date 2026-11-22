/** Safely serializes untrusted CSV values for spreadsheet consumers. */
export function sanitizeManagerRenewalsCsvCell(value: unknown): string {
  const text = String(value ?? '');
  // A leading apostrophe prevents spreadsheet formula evaluation, including when
  // a formula marker is preceded by whitespace, control characters, or a BOM.
  const safe = /^[\u0000-\u0020\uFEFF]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function exportManagerRenewalsCsv(
  records: Array<{ studentName: string; smartId: string; shift: string; plan: string; expiryDate: string; daysLeft: number; lastPaymentDate: string; due: number }>,
  filter: string
): void {
  const headers = ['Student Name', 'Smart ID', 'Shift', 'Plan', 'Expiry Date', 'Days Left', 'Last Payment', 'Due (INR)'];
  const rows = records.map((r) => [
    sanitizeManagerRenewalsCsvCell(r.studentName),
    sanitizeManagerRenewalsCsvCell(r.smartId),
    sanitizeManagerRenewalsCsvCell(r.shift),
    sanitizeManagerRenewalsCsvCell(r.plan),
    sanitizeManagerRenewalsCsvCell(r.expiryDate),
    sanitizeManagerRenewalsCsvCell(r.daysLeft),
    sanitizeManagerRenewalsCsvCell(r.lastPaymentDate),
    sanitizeManagerRenewalsCsvCell(r.due),
  ]);
  const blob = new Blob([[headers.join(','), ...rows.map((row) => row.join(','))].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const anchor = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `renewals_${filter}_${new Date().toISOString().slice(0, 10)}.csv`,
  });
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(anchor.href);
}
