'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_security/security_ip_firewall; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityIpFirewallListSkeleton from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/components/SuperadminSecurityIpFirewallListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  return (
    <SuperadminPageLoader
      size="md"
      icon="shield-alert"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
