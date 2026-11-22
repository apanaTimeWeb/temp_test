'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_features; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/app/frontend_superadmin/components/SuperadminLoader';

export default function ModuleLoading() {
  return (
    <SuperadminPageLoader
      size="md"
      icon="sparkles"
      variant="contra"
      label="Loading Feature Flags..."
    />
  );
}
