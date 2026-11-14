import type { SuperadminAccountingSeatGapStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_analysis/types/SuperadminLibrariesOverviewLibraryCapacityAnalysisSeatGapTypes';

/** Maps every declared seat-gap status to its user-facing localized label key. */
export function getSuperadminLibraryCapacityAnalysisStatusCopyKey(
  status: SuperadminAccountingSeatGapStatus,
): 'COPY.VACANT' | 'COPY.MAINTENANCE' {
  switch (status) {
    case 'vacant': return 'COPY.VACANT';
    case 'maintenance': return 'COPY.MAINTENANCE';
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
