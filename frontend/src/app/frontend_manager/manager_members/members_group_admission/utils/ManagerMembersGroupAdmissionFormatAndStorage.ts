import type { RecentGroupAdmission } from '@/app/frontend_manager/manager_members/members_group_admission/components/manager_members_group_admission_tables/ManagerMembersGroupAdmissionRecentGroupsTable';
import { readBrowserStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatGroupAdmissionInr(rupees: number): string {
  return INR_FORMATTER.format(Number.isFinite(rupees) ? rupees : 0);
}

export const GROUP_SHIFT_OPTIONS = [
  'Morning (06:00 AM – 02:00 PM)',
  'Evening (02:00 PM – 10:00 PM)',
  'Night (10:00 PM – 06:00 AM)',
  'Full Day (06:00 AM – 10:00 PM)',
  'Dual Shift (Morning + Evening)',
  'Dual Shift (Evening + Night)',
];

export function getGroupPlanOptions(): string[] {
  return [
    `Basic Monthly (${formatGroupAdmissionInr(1000)}/mo)`,
    `Pro Monthly (${formatGroupAdmissionInr(1500)}/mo)`,
    `Quarterly Standard (${formatGroupAdmissionInr(2700)}/qtr)`,
    `Half-Yearly Saver (${formatGroupAdmissionInr(5000)}/half-yr)`,
    `Annual Elite (${formatGroupAdmissionInr(9500)}/yr)`,
  ];
}

export const INITIAL_RECENT_GROUPS: RecentGroupAdmission[] = [
  { batchId: 'GRP-2026-001', batchName: 'UPSC Aspirants Study Circle', date: '2026-10-25', count: 6, shift: 'Morning', status: 'Active' },
  { batchId: 'GRP-2026-002', batchName: 'Engineering Batch Semester Prep', date: '2026-10-20', count: 4, shift: 'Evening', status: 'Processed' },
];

export function loadStoredGroupAdmissions(): RecentGroupAdmission[] {
  if (typeof window === 'undefined') return INITIAL_RECENT_GROUPS;
  try {
    const raw = readBrowserStorageItem('manager_group_admissions');
    if (raw.available && raw.value) {
      const parsed = JSON.parse(raw.value);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // storage fallback
  }
  return INITIAL_RECENT_GROUPS;
}

export function persistGroupAdmissions(updated: RecentGroupAdmission[], newBatch: RecentGroupAdmission): void {
  if (typeof window === 'undefined') return;
  try {
    writeBrowserStorageItem('manager_group_admissions', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('manager_group_batch_created', { detail: newBatch }));
  } catch {
    // storage fallback
  }
}
