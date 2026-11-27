import type {
  AdminCommunicationWhatsappLog,
  AdminCommunicationWhatsappLogStatus,
  AdminCommunicationWhatsappLogType,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

export interface AdminCommunicationWhatsappLogFilters {
  type: AdminCommunicationWhatsappLogType | 'All';
  status: AdminCommunicationWhatsappLogStatus | 'All';
  search: string;
  dateFrom: string;
  dateTo: string;
  dispatchMode?: 'All' | 'auto_api_single' | 'manual_free_web';
}

const VALID_TYPES: ReadonlySet<AdminCommunicationWhatsappLogType> = new Set([
  'welcome',
  'fee_reminder',
  'receipt',
  'notice',
  'renewal',
]);

const VALID_STATUSES: ReadonlySet<AdminCommunicationWhatsappLogStatus> = new Set([
  'Pending',
  'Sent',
  'Delivered',
  'Failed',
]);

export function parseWhatsappLogTypeFilter(value: string): AdminCommunicationWhatsappLogType | 'All' {
  return VALID_TYPES.has(value as AdminCommunicationWhatsappLogType)
    ? (value as AdminCommunicationWhatsappLogType)
    : 'All';
}

export function parseWhatsappLogStatusFilter(value: string): AdminCommunicationWhatsappLogStatus | 'All' {
  return VALID_STATUSES.has(value as AdminCommunicationWhatsappLogStatus)
    ? (value as AdminCommunicationWhatsappLogStatus)
    : 'All';
}

export function parseWhatsappLogDispatchModeFilter(
  value: string
): 'All' | 'auto_api_single' | 'manual_free_web' {
  if (value === 'auto_api_single' || value === 'manual_free_web') return value;
  return 'All';
}

/** Applies demo-table filters to the module-owned sample records without mutating the source array. */
export function filterAdminCommunicationWhatsappLogs(
  records: readonly AdminCommunicationWhatsappLog[],
  filters: AdminCommunicationWhatsappLogFilters,
): AdminCommunicationWhatsappLog[] {
  const query = filters.search.trim().toLocaleLowerCase();
  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) return [];

  return records.filter((record) => {
    if (filters.type !== 'All' && record.type !== filters.type) return false;
    if (filters.status !== 'All' && record.status !== filters.status) return false;
    if (filters.dispatchMode && filters.dispatchMode !== 'All' && record.dispatchMode !== filters.dispatchMode) return false;
    if (query && !record.student.toLocaleLowerCase().includes(query) && !record.phone.includes(filters.search.trim())) return false;

    const recordDate = record.dateTime.slice(0, 10);
    if (filters.dateFrom && recordDate < filters.dateFrom) return false;
    if (filters.dateTo && recordDate > filters.dateTo) return false;
    return true;
  });
}
