'use client';
// RESPONSIBILITY: Own local date, shift, assignment, and analysis state for a future contract-backed capacity-gap workflow.
import { useState } from 'react';
import type { SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRange } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_gap_filling/utils/SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRangeUtilities';

/** Returns local UI state only; callers must not present these values as calculated or persisted capacity. */
export function useSuperadminLibrariesCapacityGapFillingState() {
  const [analyzed, setAnalyzed] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [defaultRange, setDefaultRange] = useState<SuperadminLibrariesOverviewLibraryCapacityGapFillingDateRange | null>(null);
  const [shift, setShift] = useState('all');
  const [assigned, setAssigned] = useState<string[]>([]);
  const [urlStateReady, setUrlStateReady] = useState(false);
  return { analyzed, setAnalyzed, fromDate, setFromDate, toDate, setToDate, defaultRange, setDefaultRange, shift, setShift, assigned, setAssigned, urlStateReady, setUrlStateReady };
}
