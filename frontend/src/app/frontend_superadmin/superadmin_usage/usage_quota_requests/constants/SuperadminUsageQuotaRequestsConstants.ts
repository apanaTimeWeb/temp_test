// constants/SuperadminUsageQuotaRequestsConstants.ts
import type { QuotaRequestResourceType, QuotaRequestStatus } from '../types/SuperadminUsageQuotaRequestsTypes';

export const QUOTA_RESOURCE_TYPE_LABELS: Record<QuotaRequestResourceType, { label: string; badgeClass: string; icon: string }> = {
  BRANCH: {
    label: 'Branch Expansion (4th Branch)',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    icon: 'Building2',
  },
  STORAGE: {
    label: 'Cloud Storage (GB)',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: 'HardDrive',
  },
  ADMIN: {
    label: 'Admin Accounts',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: 'ShieldCheck',
  },
  STAFF: {
    label: 'Staff Accounts',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    icon: 'Users',
  },
  MEMBER: {
    label: 'Member Limit',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: 'Users',
  },
  SMS: {
    label: 'SMS Credits Pack',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: 'MessageSquare',
  },
  WHATSAPP: {
    label: 'WhatsApp Messages Pack',
    badgeClass: 'bg-green-500/20 text-green-300 border-green-500/40',
    icon: 'MessageSquare',
  },
  API: {
    label: 'API Request Rate Limit',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: 'Zap',
  },
};

export const QUOTA_STATUS_BADGES: Record<QuotaRequestStatus, { label: string; badgeClass: string }> = {
  PENDING: {
    label: 'Pending SuperAdmin Review',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  APPROVED: {
    label: 'Approved & Quota Expanded',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
};

export const QUOTA_FILTER_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
] as const;

export const QUOTA_FILTER_RESOURCE_OPTIONS = [
  { value: 'ALL', label: 'All Resources' },
  { value: 'BRANCH', label: 'Branch Expansions' },
  { value: 'STORAGE', label: 'Cloud Storage' },
  { value: 'SMS', label: 'SMS & WhatsApp' },
  { value: 'ADMIN', label: 'Admin & Staff' },
] as const;
