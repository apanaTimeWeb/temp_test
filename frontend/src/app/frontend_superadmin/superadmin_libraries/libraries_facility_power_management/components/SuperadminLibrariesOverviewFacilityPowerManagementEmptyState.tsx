/** Responsibility: SuperadminLibrariesOverviewFacilityPowerManagementEmptyState; provides a localized, accessible empty-state message for facility_power_management lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateTypes';

/**
 * Renders the empty collection state for libraries overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateProps.
 */
export default function SuperadminLibrariesOverviewFacilityPowerManagementEmptyState({ filtered = false }: SuperadminLibrariesOverviewFacilityPowerManagementEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_facility_power_management-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" size={18} strokeWidth={2} className="shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
