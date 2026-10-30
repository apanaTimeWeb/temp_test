/** Encodes untrusted seat-matrix cell values as spreadsheet-safe CSV cells. */
export function escapeAdminSeatMatrixCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const formulaSafeText = /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${formulaSafeText.replaceAll('"', '""')}"`;
}

/** Builds a UTF-8 CSV snapshot from the exact rows visible to the seat-matrix view. */
export function buildAdminSeatMatrixSeatMatrixCsv(rows: readonly (readonly unknown[])[]): string {
  return `\uFEFF${rows.map((row) => row.map(escapeAdminSeatMatrixCsvCell).join(',')).join('\r\n')}`;
}

/** Starts a browser download and keeps the Blob URL alive long enough for the browser to consume it. */
export function downloadAdminSeatMatrixCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
