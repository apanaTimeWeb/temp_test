// RESPONSIBILITY: Render the dashboard overview loading state component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import { LibraryLoader } from '@/app/frontend_manager/components/ManagerLoader';

export function ManagerDashboardOverviewLoadingState() {
  return (
    <div className="mgr-page flex items-center justify-center min-h-[50vh]" role="status" aria-live="polite">
      <LibraryLoader size="lg" icon="layout-dashboard" variant="contra" />
    </div>
  );
}
