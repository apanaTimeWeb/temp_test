/** Responsibility: SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState; provides a localized, accessible empty-state message for library_capacity_analysis lists. */
/** Data-Flow: owning feature collection/filter -> zero-result decision -> localized accessible empty state; no server write is inferred. */
'use client';

import { Inbox } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/types/SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateTypes';

/**
 * Renders the empty collection state for libraries overview; it does not imply that a backend operation succeeded.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateProps.
 */
export default function SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyState({ filtered = false }: SuperadminLibrariesOverviewLibraryCapacityAnalysisEmptyStateProps) {
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  return (
    <span role="status" aria-live="polite" data-testid="superadmin_library_capacity_analysis-empty-state" className="inline-flex items-center justify-center gap-2 text-sm text-secondary">
      <Inbox aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span>{tCopy(filtered ? 'COPY.TABLE_EMPTY_FILTERED' : 'COPY.TABLE_EMPTY')}</span>
    </span>
  );
}
