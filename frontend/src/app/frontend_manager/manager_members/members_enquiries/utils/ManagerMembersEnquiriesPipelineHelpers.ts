import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import { writeBrowserSessionStorageItem } from '@/lib/browserStorage';

export type ManagerCrmTimeHorizon = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

function parseEnquiryDateToMs(enquiry: ManagerMembersEnquiriesEnquiry): number | null {
  const candidates = [enquiry.enquiryDate, enquiry.addedDate];
  for (const raw of candidates) {
    if (!raw) continue;
    if (/^today/i.test(raw)) return Date.now();
    if (/^yesterday/i.test(raw)) return Date.now() - 86400000;
    const parsed = Date.parse(raw);
    if (!Number.isNaN(parsed)) return parsed;
    const dayMonth = /^(\d{1,2})\s+([A-Za-z]+)/.exec(raw) || /^([A-Za-z]+)\s+(\d{1,2})/.exec(raw);
    if (dayMonth) {
      const parsedWithYear = Date.parse(`${raw} ${new Date().getFullYear()}`);
      if (!Number.isNaN(parsedWithYear)) return parsedWithYear;
    }
  }
  return null;
}

export function filterManagerEnquiries(
  list: ManagerMembersEnquiriesEnquiry[],
  debouncedSearch: string,
  statusFilter: ManagerMembersEnquiriesEnquiryStatus | 'All',
  timeHorizon: ManagerCrmTimeHorizon,
  customStartDate: string,
  customEndDate: string,
): ManagerMembersEnquiriesEnquiry[] {
  const normalizedSearch = debouncedSearch.trim();
  const needle = normalizedSearch.toLowerCase();
  const digits = normalizedSearch.replace(/\D/g, '');
  const now = new Date();
  const startOfTodayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeekMs = startOfTodayMs - ((now.getDay() || 7) - 1) * 86400000;
  const endOfWeekMs = startOfWeekMs + 7 * 86400000 - 1;
  const startOfMonthMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const endOfMonthMs = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
  const customFromMs = customStartDate ? new Date(`${customStartDate}T00:00:00`).getTime() : null;
  const customToMs = customEndDate ? new Date(`${customEndDate}T23:59:59`).getTime() : null;

  return list.filter((enquiry) => {
    const matchSearch = !needle || enquiry.name.toLowerCase().includes(needle) || Boolean(digits && enquiry.phone.includes(digits));
    if (!matchSearch) return false;
    if (statusFilter !== 'All' && enquiry.status !== statusFilter) return false;
    if (timeHorizon === 'all') return true;
    if (timeHorizon === 'today') {
      if (enquiry.isToday) return true;
      const enqMs = parseEnquiryDateToMs(enquiry);
      return enqMs !== null && enqMs >= startOfTodayMs && enqMs < startOfTodayMs + 86400000;
    }
    if (timeHorizon === 'this_week') {
      if (enquiry.isToday || enquiry.isUpcoming || enquiry.isOverdue) return true;
      const enqMs = parseEnquiryDateToMs(enquiry);
      return enqMs !== null && enqMs >= startOfWeekMs && enqMs <= endOfWeekMs;
    }
    const enqMs = parseEnquiryDateToMs(enquiry);
    if (timeHorizon === 'this_month') return enqMs !== null ? enqMs >= startOfMonthMs && enqMs <= endOfMonthMs : true;
    if (enqMs === null) return true;
    if (customFromMs !== null && enqMs < customFromMs) return false;
    if (customToMs !== null && enqMs > customToMs) return false;
    return true;
  });
}

export function computeEnquiryStats(filtered: ManagerMembersEnquiriesEnquiry[]) {
  const total = filtered.length;
  const newLeads = filtered.filter((e) => e.status === 'New').length;
  const visited = filtered.filter((e) => e.status === 'Visited').length;
  const interested = filtered.filter((e) => e.status === 'Interested').length;
  const converted = filtered.filter((e) => e.status === 'Converted').length;
  const lost = filtered.filter((e) => e.status === 'Lost').length;
  const activePipeline = visited + interested;
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
  return { total, newLeads, visited, interested, converted, lost, activePipeline, conversionRate };
}

export function persistEnquiryLostState(id: string, reason: string, notes?: string): string {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    writeBrowserSessionStorageItem(`manager_crm_lost_${id}`, JSON.stringify({ reason, notes, date: todayStr }));
  } catch { /* Storage fallback */ }
  return todayStr;
}
