/** Safely serializes untrusted CSV values for spreadsheet consumers. */
export function sanitizeManagerInvoiceCsvCell(value: unknown): string {
  const text = String(value ?? '');
  // A leading apostrophe prevents spreadsheet formula evaluation, including when
  // a formula marker is preceded by whitespace, control characters, or a BOM.
  const safe = /^[\u0000-\u0020\uFEFF]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}
