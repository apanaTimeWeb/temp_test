import {
  ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS,
  ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';
import type { AdminAllocationsDemoAllocation } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/mocks/AdminAllocationsDemoFixtures';
import { parseAdminAllocationsCsvRows } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsCsvParser';

const REQUIRED_HEADERS = [
  'studentName', 'smartId', 'phone', 'seatNo', 'shift', 'customSlots',
  'lockerNo', 'feeStatus', 'validFrom', 'validTill', 'daysLeft', 'status',
] as const satisfies readonly (keyof AdminAllocationsDemoAllocation)[];

function normalizeAllocationDate(value: string): string | null {
  const raw = value.trim();
  let year: number; let month: number; let day: number;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (iso) { year = Number(iso[1]); month = Number(iso[2]); day = Number(iso[3]); }
  else {
    const display = /^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(raw);
    if (!display) return null;
    const months: Record<string, number> = { Jan:1, Feb:2, Mar:3, Apr:4, May:5, Jun:6, Jul:7, Aug:8, Sep:9, Oct:10, Nov:11, Dec:12 };
    day = Number(display[1]); month = months[display[2] ?? ''] ?? 0; year = Number(display[3]);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!month || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function normalizeStatus<T extends string>(value: string, allowed: readonly T[]): T | null {
  return allowed.find((item) => item.toLowerCase() === value.trim().toLowerCase()) ?? null;
}

export function parseAdminAllocationsCsv(source: string): AdminAllocationsDemoAllocation[] {
  const rows = parseAdminAllocationsCsvRows(source.replace(/^\uFEFF/, ''));
  if (rows.length < 2) throw new Error('no-data-rows');

  const headerRow = rows[0];
  if (!headerRow) throw new Error('missing-header-row');
  const headers = headerRow.map((header) => header.trim());
  const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
  if (missing.length > 0) throw new Error(`missing-headers:${missing.join(',')}`);

  const indexByHeader = new Map(headers.map((header, index) => [header, index]));
  const validStatuses = Object.keys(ADMIN_ALLOCATIONS_ALLOCATION_STATUS_BADGE_CLASS) as Array<AdminAllocationsDemoAllocation['status']>;
  const validFeeStatuses = Object.keys(ADMIN_ALLOCATIONS_ALLOCATION_FEE_STATUS_BADGE_CLASS) as Array<AdminAllocationsDemoAllocation['feeStatus']>;

  return rows.slice(1).map((cells, rowIndex) => {
    const value = (key: (typeof REQUIRED_HEADERS)[number]) => (cells[indexByHeader.get(key) ?? -1] ?? '').trim();
    const rowNumber = rowIndex + 2;
    const studentName = value('studentName');
    const smartId = value('smartId');
    const phone = value('phone');
    const seatNo = value('seatNo');
    const shift = value('shift');
    const customSlots = value('customSlots');
    const lockerNo = value('lockerNo');
    const feeStatus = normalizeStatus(value('feeStatus'), validFeeStatuses);
    const validFromRaw = value('validFrom');
    const validTillRaw = value('validTill');
    const validFrom = normalizeAllocationDate(validFromRaw);
    const validTill = normalizeAllocationDate(validTillRaw);
    const statusInput = normalizeStatus(value('status'), validStatuses);

    if (!studentName || !smartId || !seatNo || !shift || !validFrom || !validTill || validFrom > validTill || !feeStatus || !statusInput) {
      throw new Error(`invalid-row:${rowNumber}`);
    }
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const daysLeft = Math.round((Date.parse(`${validTill}T00:00:00Z`) - Date.parse(`${todayIso}T00:00:00Z`)) / 86400000);
    const status = statusInput === 'Suspended' ? 'Suspended' : (daysLeft < 0 ? 'Expired' : 'Active') as AdminAllocationsDemoAllocation['status'];

    return { studentName, smartId, phone, seatNo, shift, customSlots, lockerNo, feeStatus, validFrom, validTill, daysLeft, status };
  });
}

export function serializeAdminAllocationsCsv(rows: readonly AdminAllocationsDemoAllocation[]): string {
  const escapeCell = (value: string | number) => {
    const raw = String(value);
    const text = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? `'${raw}` : raw;
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const header = REQUIRED_HEADERS.join(',');
  return [header, ...rows.map((row) => REQUIRED_HEADERS.map((key) => escapeCell(row[key])).join(','))].join('\r\n');
}
