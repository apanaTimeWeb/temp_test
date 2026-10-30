import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  return digits.slice(0, 2) + '****' + digits.slice(-4);
}

export function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * @description Tests an enquiry against free-text or phone search without treating a non-numeric query as an empty phone match.
 * @dependencies Consumes only the owning module's enquiry type.
 * @edge-case Empty/whitespace queries match all records; punctuation-only phone queries do not match every record.
 */
export function matchesAdminEnquiriesEnquirySearch(enquiry: Enquiry, rawSearch: string): boolean {
  const query = rawSearch.trim().toLocaleLowerCase();
  if (!query) return true;

  const nameMatches = enquiry.name.toLocaleLowerCase().includes(query);
  if (nameMatches) return true;

  const normalizedPhoneQuery = rawSearch.replace(/\D/g, '');
  if (!normalizedPhoneQuery) return false;

  const normalizedPhone = enquiry.phone.replace(/\D/g, '');
  return normalizedPhone.includes(normalizedPhoneQuery);
}

/** Locale-aware display for ISO calendar-day strings; invalid dates are neutralized. */
export function formatAdminEnquiriesDate(value: string | undefined, locale: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '—';
  const date = parseISO(value);
  if (!isValid(date) || format(date, 'yyyy-MM-dd') !== value) return '—';
  return format(date, 'd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}


// CSV export is a text serialization concern; formula-safe quoting is retained in the same utility.

const ADMIN_ENQUIRIES_EXPORT_COLUMNS = [
  { header: 'Enquiry ID', value: (row: Enquiry) => row.id },
  { header: 'Name', value: (row: Enquiry) => row.name },
  { header: 'Phone', value: (row: Enquiry) => row.phone },
  { header: 'Shift', value: (row: Enquiry) => row.shift },
  { header: 'Status', value: (row: Enquiry) => row.status },
  { header: 'Source', value: (row: Enquiry) => row.source ?? '' },
  { header: 'Enquiry Date', value: (row: Enquiry) => row.enquiryDate ?? row.addedDate },
] as const;

function escapeAdminEnquiriesCsvCell(value: unknown): string {
  const text = String(value ?? '');
  // Neutralize spreadsheet formula starters before quoting untrusted record text.
  const safeText = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

/** Creates CSV only from the records passed by the owning view. It does not fetch or infer live CRM data. */
export function buildAdminEnquiriesCsv(records: readonly Enquiry[]): string {
  const header = ADMIN_ENQUIRIES_EXPORT_COLUMNS.map((column) => escapeAdminEnquiriesCsvCell(column.header)).join(',');
  const rows = records.map((record) => ADMIN_ENQUIRIES_EXPORT_COLUMNS.map((column) => escapeAdminEnquiriesCsvCell(column.value(record))).join(','));
  return [header, ...rows].join('\r\n');
}

