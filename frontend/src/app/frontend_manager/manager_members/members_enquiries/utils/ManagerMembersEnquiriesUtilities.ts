import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesApiEnquiry } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

const CRM_MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

/** Format only known calendar-date shapes; leave unknown labels and text untouched. */
export function formatManagerEnquiriesCalendarDate(value: string, locale: string): string {
  const raw = value.trim();
  if (!raw) return value;
  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(raw);
  const numeric = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(raw);
  const monthFirst = /^([A-Za-z]{3,9})\s+(\d{1,2}),?\s*(\d{4})$/.exec(raw);
  const dayFirst = /^(\d{1,2})\s+([A-Za-z]{3,9})(?:\s+(\d{4}))?$/.exec(raw);
  if (iso) { year = Number(iso[1]); month = Number(iso[2]); day = Number(iso[3]); }
  else if (numeric) { day = Number(numeric[1]); month = Number(numeric[2]); year = Number(numeric[3]); }
  else if (monthFirst) { month = CRM_MONTHS[monthFirst[1].toLowerCase()]; day = Number(monthFirst[2]); year = Number(monthFirst[3]); }
  else if (dayFirst) { day = Number(dayFirst[1]); month = CRM_MONTHS[dayFirst[2].toLowerCase()]; year = dayFirst[3] ? Number(dayFirst[3]) : 2000; }
  if (!month || !day || !year || month < 1 || month > 12 || day < 1 || day > 31) return value;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return value;
  const hasYear = Boolean(iso || (numeric && year) || (monthFirst && year) || (dayFirst && dayFirst[3]));
  const resolvedLocale = locale === 'hi' || locale === 'hi-IN' ? 'hi-IN' : 'en-IN';
  return new Intl.DateTimeFormat(resolvedLocale, { day: 'numeric', month: 'short', ...(hasYear ? { year: 'numeric' as const } : {}), timeZone: 'UTC' }).format(date);
}

/** Return an HTML date-input value for the local calendar day (never UTC-shifted). */
export function getManagerEnquiriesLocalDateInputMinimum(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Localize generated Today/Yesterday date labels and preserve any attached time suffix. */
export function formatManagerEnquiriesDisplayDate(
  value: string,
  locale: string,
  relativeLabels: { today: string; yesterday: string },
): string {
  const relative = /^(\s*)(Today|Yesterday)(.*)$/i.exec(value);
  if (relative) {
    const key = relative[2].toLowerCase() as 'today' | 'yesterday';
    return `${relative[1]}${relativeLabels[key]}${relative[3]}`;
  }
  return formatManagerEnquiriesCalendarDate(value, locale);
}

export function maskManagerEnquiriesPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '—';
  if (digits.length < 6) return '••••';
  return `${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

export function getManagerEnquiriesInitials(name: string): string {
  return name.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase().slice(0, 2);
}

/** Normalizes either an API-shaped enquiry or an already-normalized feature record into one UI contract. */
export function normalizeManagerEnquiriesEnquiry(raw: ManagerMembersEnquiriesApiEnquiry | ManagerMembersEnquiriesEnquiry): ManagerMembersEnquiriesEnquiry {
  const isApiRecord = 'createdAt' in raw;
  const createdAt = isApiRecord ? raw.createdAt : raw.enquiryDate;
  const apiRecord = raw as ManagerMembersEnquiriesApiEnquiry;
  const normalizedRecord = raw as ManagerMembersEnquiriesEnquiry;
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    shift: isApiRecord ? (apiRecord.preferredShift ?? 'Not specified') : normalizedRecord.shift,
    status: raw.status,
    source: raw.source ?? 'Not specified',
    handledBy: isApiRecord ? (apiRecord.handledBy?.name ?? 'Unassigned') : normalizedRecord.handledBy,
    addedDate: isApiRecord ? createdAt : normalizedRecord.addedDate,
    enquiryDate: isApiRecord ? createdAt : normalizedRecord.enquiryDate,
    preferredBranch: raw.preferredBranch ?? 'Not specified',
    avatar: isApiRecord ? getManagerEnquiriesInitials(raw.name) : normalizedRecord.avatar,
    followUps: raw.followUps ?? [],
    convertedDate: raw.convertedDate ?? undefined,
    isOverdue: raw.isOverdue,
    isToday: raw.isToday,
    isUpcoming: raw.isUpcoming,
  };
}
