import type { AdminCommunicationWhatsappLog, AdminCommunicationWhatsappLogStatus, AdminCommunicationWhatsappLogType } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';

export interface AdminCommunicationWhatsappLogFilters {
  type: AdminCommunicationWhatsappLogType | 'All';
  status: AdminCommunicationWhatsappLogStatus | 'All';
  search: string;
  dateFrom: string;
  dateTo: string;
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
    if (query && !record.student.toLocaleLowerCase().includes(query) && !record.phone.includes(filters.search.trim())) return false;

    const recordDate = record.dateTime.slice(0, 10);
    if (filters.dateFrom && recordDate < filters.dateFrom) return false;
    if (filters.dateTo && recordDate > filters.dateTo) return false;
    return true;
  });
}
