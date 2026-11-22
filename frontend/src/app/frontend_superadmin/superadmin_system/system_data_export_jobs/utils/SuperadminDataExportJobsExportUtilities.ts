// FLOW: Feature caller -> superadmin_system/system_data_export_jobs/utils/SuperadminDataExportJobsExportUtilities.ts -> typed local sample input -> generated preview/export output.
/** Responsibility: Superadmin System Export Utilities; provides focused module-owned formatting or pure utility behavior. */
export interface SuperadminSystemExportManifestEntry {
  id: string;
  label: string;
  estimatedRows: number | null;
  exportKind: 'module' | 'quick_export';
}

/**
 * Defines the public SuperadminSystemExportManifestInput contract for data export jobs. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property entries Value defined by the existing feature-local contract. Declared type: SuperadminSystemExportManifestEntry[].
 * @property dateFrom Value defined by the existing feature-local contract. Declared type: string.
 * @property dateTo Value defined by the existing feature-local contract. Declared type: string.
 * @property requestedFormat Value defined by the existing feature-local contract. Declared type: 'CSV'.
 * @property generatedAt Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminSystemExportManifestInput {
  entries: SuperadminSystemExportManifestEntry[];
  dateFrom: string;
  dateTo: string;
  requestedFormat: 'CSV';
  generatedAt: string;
}

function SuperadminSystemCsvCell(value: string | number | null): string {
  const escaped = String(value ?? '').replace(/\"/g, '\"\"');
  return `\"${escaped}\"`;
}

/** Builds a configuration manifest, not a data export. No domain records are fabricated. 
 * @param input - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example SuperadminSystemCreateExportManifestCsv(input) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminSystemCreateExportManifestCsv(input: SuperadminSystemExportManifestInput): string {
  if (input.dateFrom && input.dateTo && input.dateFrom > input.dateTo) {
    throw new Error('The start date must be on or before the end date.');
  }
  if (input.entries.length === 0) {
    throw new Error('Choose at least one module or quick export before downloading a manifest.');
  }
  const headers = ['Manifest classification', 'Export ID', 'Export label', 'Export kind', 'Estimated sample rows', 'From date filter', 'To date filter', 'Requested format', 'Generated at', 'Data included'];
  const lines = [headers, ...input.entries.map((entry) => [
    'SAMPLE CONFIGURATION MANIFEST — NOT A DATA EXPORT',
    entry.id,
    entry.label,
    entry.exportKind,
    entry.estimatedRows ?? 'Not estimated',
    input.dateFrom || 'Not selected',
    input.dateTo || 'Not selected',
    input.requestedFormat,
    input.generatedAt,
    'No student, payment, attendance, tenant, or other business records included',
  ])];
  return `\uFEFF${lines.map((line) => line.map((value) => SuperadminSystemCsvCell(value)).join(',')).join('\r\n')}`;
}

/** Downloads a manifest CSV only; this does not call or emulate a business-data API. 
 * @param csv - Input supplied by the caller under the declared TypeScript contract.
 * @param fileName - Input supplied by the caller under the declared TypeScript contract.
 * @returns No value; this function wires lifecycle behavior for the owning feature.
 * @example SuperadminSystemDownloadExportManifestCsv(csv, fileName) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminSystemDownloadExportManifestCsv(csv: string, fileName: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
