// FLOW: Feature component -> superadmin_settings/settings_profile_overview/hooks/useSuperadminProfileOverviewEditSemanticTableState.ts -> local state/typed dependencies -> returned state and actions.
/** Responsibility: use Superadmin Profile Semantic Table State; owns the named module state/data-flow behavior and its cleanup/recovery contract. */
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Owns the profile overview edit semantic table state lifecycle for profile overview, keeping feature state and side effects within this leaf.
 * @param args Input required by the declared feature contract. Declared type: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean; }.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminProfileOverviewEditSemanticTableState<T extends object>(args: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean }) {
  const { rowData, paginationPageSize, paginationEnabled = false } = args;
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const skipUrlWriteRef = useRef(false);
  const sortedRows = useMemo(() => {
    const needle = filterText.trim().toLocaleLowerCase();
    const rows = [...(rowData ?? [])].filter((row) => !needle || Object.values(row as unknown as Record<string, unknown>).some((value) => String(value ?? '').toLocaleLowerCase().includes(needle)));
    if (!sort) return rows;
    return rows.sort((left, right) => {
      const a = (left as unknown as Record<string, unknown>)[sort.field];
      const b = (right as unknown as Record<string, unknown>)[sort.field];
      const comparison = typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [rowData, sort, filterText]);
  const pageCount = Math.max(1, Math.ceil(sortedRows.length / Math.max(1, paginationPageSize)));
  const urlPage = page;
  const filterTextRef = useRef(filterText);
  const lastFilterTextRef = useRef(filterText);
  filterTextRef.current = filterText;
  const urlPageRef = useRef(urlPage);
  urlPageRef.current = urlPage;
  // Effect contract: hydrate only this leaf's search/page query keys on mount and browser navigation; preserve all unrelated query state.
  useEffect(() => {
    const readUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextSearch = params.get('sa_profile_overview_edit_search') ?? '';
      const rawPage = params.get('sa_profile_overview_edit_page');
      const parsedPage = rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
      const nextPage = Number.isSafeInteger(parsedPage) ? Math.max(0, parsedPage) : 0;
      if (nextSearch !== filterTextRef.current || nextPage !== urlPageRef.current) skipUrlWriteRef.current = true;
      setFilterText(nextSearch);
      setPage(nextPage);
    };
    readUrlState();
    setUrlStateReady(true);
    window.addEventListener('popstate', readUrlState);
    return () => window.removeEventListener('popstate', readUrlState);
  }, []);

  // Effect contract: keep this leaf's search and pagination reflected in the URL without creating a history entry per keystroke.
  useEffect(() => {
    if (!urlStateReady) return;
    if (skipUrlWriteRef.current) { lastFilterTextRef.current = filterText; skipUrlWriteRef.current = false; return; }
    const filterChanged = lastFilterTextRef.current !== filterText;
    lastFilterTextRef.current = filterText;
    const syncUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (filterText) params.set('sa_profile_overview_edit_search', filterText);
      else params.delete('sa_profile_overview_edit_search');
      if (urlPage > 0) params.set('sa_profile_overview_edit_page', String(urlPage));
      else params.delete('sa_profile_overview_edit_page');
      const query = params.toString();
      const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) window.history.replaceState(window.history.state, '', nextUrl);
    };
    if (filterChanged) {
      const timeoutId = window.setTimeout(syncUrl, 300);
      return () => window.clearTimeout(timeoutId);
    }
    syncUrl();
  }, [filterText, urlPage, urlStateReady]);
  // Keep the current page valid when filtering or data changes reduce the available page count.
  // Effect contract: clamp the current page to the valid range whenever pageCount changes; [pageCount] is the deliberate dependency boundary.
  useEffect(() => { setPage((current) => Math.max(0, Math.min(current, pageCount - 1))); }, [pageCount]);
  const visibleRows = paginationEnabled ? sortedRows.slice(page * paginationPageSize, (page + 1) * paginationPageSize) : sortedRows;
  return { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows };
}
