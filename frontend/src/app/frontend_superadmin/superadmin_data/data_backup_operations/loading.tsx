'use client';

// RESPONSIBILITY: Render the route loading state for superadmin_data/data_backup_operations; it does not fetch or mutate business data.
// FLOW: App Router pending state -> loading.tsx -> loading UI -> route content when ready.
import { SuperadminPageLoader } from '@/app/frontend_superadmin/components/SuperadminLoader';

export default function ModuleLoading() {
  return (
    <SuperadminPageLoader
      size="md"
      icon="database"
      variant="contra"
      label="Loading Backup Operations..."
    />
  );
}
