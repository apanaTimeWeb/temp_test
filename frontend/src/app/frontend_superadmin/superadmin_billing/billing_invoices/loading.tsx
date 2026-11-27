'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_billing/billing_invoices; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/components/ui/loader/SuperadminLoader';
import { useTranslations } from 'next-intl';
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminBillingInvoicesListSkeleton from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingInvoicesListSkeleton';

export default function ModuleLoading() {
  const t = useTranslations('SUPERADMIN_BILLING');
  return (
    <SuperadminPageLoader
      size="md"
      icon="receipt"
      variant="contra"
      label={t('COPY.LOADING_MODULE')}
    />
  );
}
