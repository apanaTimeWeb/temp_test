// RESPONSIBILITY: Own module-local state or interaction logic for libraries overview; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_libraries/libraries_overview/hooks/useSuperadminLibrariesOverview.ts -> local state/typed dependencies -> returned state and actions.
'use client';

import { useCallback, useState } from 'react';
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import { SUPERADMIN_LIBRARIES_INITIAL_FIXTURES } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/mocks/fixtures/SuperadminLibrariesOverviewMockFixtures';

/** Local preview state for synthetic fixtures; intentionally does not impersonate a server-backed query. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminLibrariesOverview() {
  const [libraries, setLibraries] = useState<SuperadminLibrariesLibrary[]>(SUPERADMIN_LIBRARIES_INITIAL_FIXTURES);

  const refetch = useCallback(async () => {
    setLibraries(SUPERADMIN_LIBRARIES_INITIAL_FIXTURES.map((library) => ({ ...library })));
  }, []);

  const updateLibrary = useCallback(async (id: string, updates: Partial<SuperadminLibrariesLibrary>) => {
    if (!libraries.some((library) => library.id === id)) {
      throw new Error('The sample library is no longer available in this preview.');
    }
    setLibraries((current) => current.map((library) => library.id === id ? { ...library, ...updates } : library));
  }, [libraries]);

  const toggleStatus = useCallback(async (id: string) => {
    const library = libraries.find((candidate) => candidate.id === id);
    if (!library) throw new Error('The sample library is no longer available in this preview.');
    const nextStatus = library.status === 'Active' ? 'Maintenance' : 'Active';
    setLibraries((current) => current.map((candidate) => candidate.id === id ? { ...candidate, status: nextStatus } : candidate));
  }, [libraries]);

  return { libraries, loading: false, error: null as string | null, updateLibrary, toggleStatus, refetch };
}
