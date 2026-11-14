// FLOW: Feature component -> superadmin_subscriptions/subscriptions_overview/hooks/useSuperadminSubscriptionsOverviewSemanticTableState.ts -> local state/typed dependencies -> returned state and actions.
/** Responsibility: use Superadmin Subscriptions Semantic Table State; owns the named module state/data-flow behavior and its cleanup/recovery contract. */
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Owns the subscriptions overview semantic table state lifecycle for subscriptions overview, keeping feature state and side effects within this leaf.
 * @param args Input required by the declared feature contract. Declared type: { rowData?: readonly T[] | null; paginationPageSize: number; pageIndex?: number; onPageChange?: (pageIndex: number) => void; paginationEnabled?: boolean; }.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminSubscriptionsOverviewSemanticTableState<T extends object>(args: { rowData?: readonly T[] | null; paginationPageSize: number; pageIndex?: number; onPageChange?: (pageIndex: number) => void; paginationEnabled?: boolean }) {
  const { rowData, paginationPageSize, pageIndex, onPageChange, paginationEnabled = false } = args;
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const skipUrlWriteRef = useRef(false);
  const onPageChangeRef = useRef(onPageChange);
  onPageChangeRef.current = onPageChange;
  const controlledPageRef = useRef(false);
  controlledPageRef.current = pageIndex !== undefined && typeof onPageChange === 'function';
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
  const urlPage = controlledPageRef.current && pageIndex !== undefined ? pageIndex : page;
  const filterTextRef = useRef(filterText);
  const lastFilterTextRef = useRef(filterText);
  filterTextRef.current = filterText;
  const urlPageRef = useRef(urlPage);
  urlPageRef.current = urlPage;
  // Effect contract: hydrate only this leaf's search/page query keys on mount and browser navigation; preserve all unrelated query state.
  useEffect(() => {
    const readUrlState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextSearch = params.get('sa_subscriptions_overview_search') ?? '';
      const rawPage = params.get('sa_subscriptions_overview_page');
      const parsedPage = rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
      const nextPage = Number.isSafeInteger(parsedPage) ? Math.max(0, parsedPage) : 0;
      if (nextSearch !== filterTextRef.current || nextPage !== urlPageRef.current) skipUrlWriteRef.current = true;
      setFilterText(nextSearch);
      setPage(nextPage);
      if (controlledPageRef.current) onPageChangeRef.current?.(nextPage);
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
      if (filterText) params.set('sa_subscriptions_overview_search', filterText);
      else params.delete('sa_subscriptions_overview_search');
      if (urlPage > 0) params.set('sa_subscriptions_overview_page', String(urlPage));
      else params.delete('sa_subscriptions_overview_page');
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
  const activePage = pageIndex ?? page;
  // Effect contract: clamp the current page when filtering or data changes reduce the page count; dependency set [activePage, pageCount, onPageChange] is the deliberate re-run boundary.
  useEffect(() => { if (activePage >= pageCount) { const nextPage = Math.max(0, pageCount - 1); setPage(nextPage); onPageChange?.(nextPage); } }, [activePage, pageCount, onPageChange]);
  const visibleRows = paginationEnabled ? sortedRows.slice(activePage * paginationPageSize, (activePage + 1) * paginationPageSize) : sortedRows;
  return { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, activePage, visibleRows };
}
