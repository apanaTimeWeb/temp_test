import type { AdminSystemBulkImportCsvParseResult, AdminSystemBulkImportPreviewRow } from '@/app/frontend_admin/admin_system/system_bulk_import/types/AdminSystemBulkImportTypes';

const ADMIN_SYSTEM_BULK_IMPORT_REQUIRED_HEADERS = ['name', 'phone', 'shift'] as const;
const ADMIN_SYSTEM_BULK_IMPORT_ALLOWED_HEADERS = new Set(['name', 'phone', 'email', 'shift', 'seat', 'plan', 'feepaid', 'joindate']);

function normalizeAdminSystemBulkImportHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseAdminSystemBulkImportCsvRecords(source: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let cell = '';
  let quoted = false;
  let closedQuote = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]!;
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
        closedQuote = true;
      } else {
        cell += character;
      }
      continue;
    }

    if (closedQuote && character !== ',' && character !== '\r' && character !== '\n' && character !== ' ' && character !== '\t') {
      throw new Error('IMPORT_CSV_MALFORMED_QUOTES');
    }
    if (character === '"' && cell.length === 0 && !closedQuote) {
      quoted = true;
    } else if (character === '"') {
      throw new Error('IMPORT_CSV_MALFORMED_QUOTES');
    } else if (character === ',') {
      closedQuote = false;
      record.push(cell);
      cell = '';
    } else if (character === '\r' || character === '\n') {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      record.push(cell);
      closedQuote = false;
      if (record.some((value) => value.trim().length > 0)) records.push(record);
      record = [];
      cell = '';
    } else {
      if (cell.length === 0 && character === ' ') { cell += character; }
      else cell += character;
    }
  }

  if (quoted) throw new Error('IMPORT_CSV_UNTERMINATED_QUOTE');
  record.push(cell);
  if (record.some((value) => value.trim().length > 0)) records.push(record);
  return records;
}

/** Parses the feature's own CSV template into a local validation preview; it performs no upload or mutation. */
export function parseAdminSystemBulkImportCsv(source: string): AdminSystemBulkImportCsvParseResult {
  let records: string[][];
  try {
    records = parseAdminSystemBulkImportCsvRecords(source.replace(/^\uFEFF/, ''));
  } catch (error) {
    const errorCode = error instanceof Error && error.message === 'IMPORT_CSV_UNTERMINATED_QUOTE'
      ? 'IMPORT_CSV_UNTERMINATED_QUOTE'
      : 'IMPORT_CSV_MALFORMED_QUOTES';
    return { rows: [], errorCode };
  }
  if (records.length < 2) return { rows: [], errorCode: 'IMPORT_CSV_EMPTY' };

  const headers = records[0]!.map(normalizeAdminSystemBulkImportHeader);
  const positions = new Map<string, number>();
  headers.forEach((header, index) => {
    if (!ADMIN_SYSTEM_BULK_IMPORT_ALLOWED_HEADERS.has(header) || positions.has(header)) {
      positions.clear();
      return;
    }
    positions.set(header, index);
  });
  if (positions.size !== headers.length || ADMIN_SYSTEM_BULK_IMPORT_REQUIRED_HEADERS.some((header) => !positions.has(header))) {
    return { rows: [], errorCode: 'IMPORT_CSV_HEADER_INVALID' };
  }

  const getValue = (cells: string[], header: string): string => {
    const position = positions.get(header);
    return position === undefined ? '' : (cells[position] ?? '').trim();
  };
  const rows: AdminSystemBulkImportPreviewRow[] = [];
  for (const [index, cells] of records.slice(1).entries()) {
    if (cells.length > headers.length) return { rows: [], errorCode: 'IMPORT_CSV_EXTRA_CELLS' };
    const name = getValue(cells, 'name');
    const phone = getValue(cells, 'phone');
    const email = getValue(cells, 'email');
    const shift = getValue(cells, 'shift');
    const seat = getValue(cells, 'seat');
    const plan = getValue(cells, 'plan');
    const feePaid = getValue(cells, 'feepaid');
    const joinDate = getValue(cells, 'joindate');

    let status: AdminSystemBulkImportPreviewRow['status'] = 'ok';
    let issue: string | undefined;
    if (!name) { status = 'error'; issue = 'IMPORT_ROW_NAME_REQUIRED'; }
    else if (!phone) { status = 'error'; issue = 'IMPORT_ROW_PHONE_REQUIRED'; }
    else if (!shift) { status = 'error'; issue = 'IMPORT_ROW_SHIFT_REQUIRED'; }
    else if (!email) { status = 'warning'; issue = 'IMPORT_ROW_EMAIL_OPTIONAL'; }

    rows.push({ row: index + 2, name, phone, email, shift, seat, plan, feePaid, joinDate, status, ...(issue ? { issue } : {}) });
  }

  return rows.length ? { rows } : { rows: [], errorCode: 'IMPORT_CSV_EMPTY' };
}
