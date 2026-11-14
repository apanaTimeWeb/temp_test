/** Responsibility: SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState; provides a localized, accessible empty-state message for facility_asset_registry lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_asset_registry/types/SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateTypes';

/**
 * Renders the empty collection state for libraries overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateProps.
 */
export default function SuperadminLibrariesOverviewFacilityAssetRegistryEmptyState({ filtered = false }: SuperadminLibrariesOverviewFacilityAssetRegistryEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_facility_asset_registry-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
