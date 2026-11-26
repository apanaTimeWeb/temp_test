// src/app/frontend_superadmin/superadmin_integrations/integrations_overview/error.tsx
// RESPONSIBILITY: Next.js App Router route-level error boundary.
'use client';

import { SuperadminIntegrationsOverviewErrorFallback } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewErrorFallback';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SuperadminIntegrationsOverviewErrorFallback error={error} reset={reset} />;
}
