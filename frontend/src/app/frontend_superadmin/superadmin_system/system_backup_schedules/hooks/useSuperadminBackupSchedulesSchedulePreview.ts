// RESPONSIBILITY: Own module-local state or interaction logic for system backup schedules; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_system/system_backup_schedules/hooks/useSuperadminBackupSchedulesSchedulePreview.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

/** Owns local retention selection and preview feedback; it never persists a server schedule. 
 * @param onPreviewNotice - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminBackupSchedulesSchedulePreview(onPreviewNotice: (message: string) => void) {
  const tCopy = useTranslations('SUPERADMIN_BACKUP');
  const [retention, setRetention] = useState('30');
  const [preview, setPreview] = useState('');

  const previewSchedule = useCallback(() => {
    const message = tCopy('COPY.PREVIEW_ONLY_RETAIN_SAMPLE_BACKUPS_FOR_LAST_DAYS', { days: retention });
    setPreview(message);
    onPreviewNotice(message);
  }, [onPreviewNotice, retention, tCopy]);

  return { retention, setRetention, preview, previewSchedule };
}
