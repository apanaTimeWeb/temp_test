import { format, isBefore, isValid, parseISO, startOfDay } from 'date-fns';

export type AdminCommunicationNoticeStatus = 'Active' | 'Expired' | 'Unknown';

/**
 * Maps the date displayed in the notice form/table, not the current clock time.
 * Date-only notices remain active through their stated local calendar day.
 */
export function getAdminCommunicationNoticeStatus(validTill: string, now = new Date()): AdminCommunicationNoticeStatus {
  const datePart = validTill.slice(0, 10);
  const expiryDate = parseISO(datePart);
  if (datePart.length !== 10 || !isValid(expiryDate) || format(expiryDate, 'yyyy-MM-dd') !== datePart) {
    return 'Unknown';
  }

  return isBefore(expiryDate, startOfDay(now)) ? 'Expired' : 'Active';
}
