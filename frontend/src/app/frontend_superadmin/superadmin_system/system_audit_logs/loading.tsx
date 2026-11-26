'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_system/system_audit_logs; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminAuditLogsListSkeleton from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_AUDIT_LOGS');
  return (
    <SuperadminPageLoader
      size="md"
      icon="file-text"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
