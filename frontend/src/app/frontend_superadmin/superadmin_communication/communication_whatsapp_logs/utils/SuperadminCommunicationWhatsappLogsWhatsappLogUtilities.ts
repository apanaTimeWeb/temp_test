// RESPONSIBILITY: Provide deterministic module-owned helper behavior for communication whatsapp logs; it does not own page routing or live backend persistence.
// FLOW: Feature caller -> superadmin_communication/communication_whatsapp_logs/utils/SuperadminCommunicationWhatsappLogsWhatsappLogUtilities.ts -> typed input/contract -> deterministic helper result.
import type { SuperadminCommunicationWhatsappLog, SuperadminCommunicationWhatsappLogFilters } from '@/app/frontend_superadmin/superadmin_communication/communication_whatsapp_logs/types/SuperadminCommunicationWhatsappLogsWhatsappTypes';

/** Pure filter for the sample view. Dates use YYYY-MM-DD local calendar labels in the source fixture. 
 * @param logs - Input supplied by the caller under the declared TypeScript contract.
 * @param filters - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function filterSuperadminCommunicationWhatsappLogs(
  logs: readonly SuperadminCommunicationWhatsappLog[],
  filters: SuperadminCommunicationWhatsappLogFilters,
): SuperadminCommunicationWhatsappLog[] {
  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) return [];
  const search = filters.search.trim().toLocaleLowerCase();
  return logs.filter((log) => {
    if (filters.type !== 'All' && log.type !== filters.type) return false;
    if (filters.status !== 'All' && log.status !== filters.status) return false;
    if (search && !log.student.toLocaleLowerCase().includes(search) && !log.phone.includes(filters.search.trim())) return false;
    const logDate = log.dateTime.slice(0, 10);
    if (filters.dateFrom && logDate < filters.dateFrom) return false;
    if (filters.dateTo && logDate > filters.dateTo) return false;
    return true;
  });
}

/** Masks phone numbers in list/table presentation; already-masked sample values are preserved. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function maskSensitiveData(value: string): string {
  if (value.includes('*')) return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return value;
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
