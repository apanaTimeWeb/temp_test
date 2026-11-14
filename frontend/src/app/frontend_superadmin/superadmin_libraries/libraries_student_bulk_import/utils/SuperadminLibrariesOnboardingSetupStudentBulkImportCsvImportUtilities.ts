// RESPONSIBILITY: Format or generate the declared local sample/export output for libraries student bulk import; it does not represent a live backend export or record.
// FLOW: Feature caller -> superadmin_libraries/libraries_student_bulk_import/utils/SuperadminLibrariesOnboardingSetupStudentBulkImportCsvImportUtilities.ts -> typed local sample input -> generated preview/export output.
import type { SuperadminSystemBulkImportRow, SuperadminSystemBulkImportRowStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/types/SuperadminLibrariesOnboardingSetupStudentBulkImportTypes';

const REQUIRED_HEADERS = ['name', 'phone', 'shift'] as const;

/** Parses CSV rows, including quoted commas/newlines, escaped quotes, CRLF and UTF-8 BOMs. 
 * @param text - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example SuperadminSystemParseCsv(text) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminSystemParseCsv(text: string): string[][] {
  const source = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (char === '"' && quoted && source[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[i + 1] === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(value => value.length > 0)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error('The CSV contains an unclosed quoted field.');
  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim());
    if (row.some(value => value.length > 0)) rows.push(row);
  }
  return rows;
}

/** Validates the uploaded CSV and returns preview rows only; it does not import records. 
 * @param text - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 * @example SuperadminSystemValidateCsv(text) uses the declared inputs to produce the module's canonical output.
 */
export function SuperadminSystemValidateCsv(text: string): SuperadminSystemBulkImportRow[] {
  const rows = SuperadminSystemParseCsv(text);
  if (rows.length < 2) throw new Error('The CSV must include a header row and at least one data row.');
  if (rows.length - 1 > 500) throw new Error('The CSV contains more than 500 data rows; split it into smaller files.');

  const headerRow = rows[0];
  if (!headerRow) throw new Error('The CSV must include a header row and at least one data row.');
  const headers = headerRow.map(header => header.toLowerCase().replaceAll('*', '').trim());
  const indexes = new Map(headers.map((header, index) => [header, index]));
  const missing = REQUIRED_HEADERS.filter(header => !indexes.has(header));
  if (missing.length) throw new Error(`Required columns missing: ${missing.join(', ')}.`);
  const valueFor = (record: string[], header: string) => record[indexes.get(header) ?? -1] ?? '';

  return rows.slice(1).map((record, index) => {
    const name = valueFor(record, 'name');
    const phone = valueFor(record, 'phone');
    const email = valueFor(record, 'email');
    const shift = valueFor(record, 'shift');
    const seat = valueFor(record, 'seat');
    const plan = valueFor(record, 'plan');
    const feePaid = valueFor(record, 'fee paid');
    const joinDate = valueFor(record, 'join date');
    const missingFields = [!name && 'name', !phone && 'phone', !shift && 'shift'].filter(Boolean) as Array<'name' | 'phone' | 'shift'>;
    const status: SuperadminSystemBulkImportRowStatus = missingFields.length ? 'error' : !email ? 'warning' : 'ok';
    return {
      row: index + 1, name, phone, email, shift, seat, plan, feePaid, joinDate, status,
      issue: missingFields.length ? 'REQUIRED_FIELDS_MISSING' : (!email ? 'EMAIL_BLANK_OPTIONAL' : undefined),
      issueFields: missingFields.length ? missingFields : undefined,
    };
  });
}

/** Masks phone numbers rendered in the CSV preview table; the import remains preview-only. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function maskSensitiveData(value: string): string {
  if (value.includes('@')) {
    const [localPart, domainPart = ''] = value.split('@');
    if (!localPart || !domainPart) return '•••';
    const domainSegments = domainPart.split('.');
    const domainName = domainSegments.shift() ?? '';
    const suffix = domainSegments.length ? `.${domainSegments.join('.')}` : '';
    return `${localPart.slice(0, 1)}***@${domainName.slice(0, 1)}***${suffix}`;
  }
  if (/^\*+\d{4}$/.test(value)) return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return '•••';
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
