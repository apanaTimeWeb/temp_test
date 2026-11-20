// RESPONSIBILITY: Route-level error boundary for features overview.
'use client';

import React from 'react';
import SuperadminFeaturesOverviewErrorFallback from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewErrorFallback';

export default function SuperadminFeaturesOverviewError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <SuperadminFeaturesOverviewErrorFallback error={error} resetErrorBoundary={reset} />;
}
