import type { Enquiry } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

export {
  buildAdminEnquiriesCsv,
  buildAdminEnquiriesExcel,
  downloadAdminEnquiriesExcel,
  printAdminEnquiriesRoster,
} from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesExportHelpers';

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  return digits.slice(0, 2) + '****' + digits.slice(-4);
}

export function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}

/** Tests an enquiry against free-text or phone search without treating a non-numeric query as an empty phone match. */
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
