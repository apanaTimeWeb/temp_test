// FLOW: Feature component -> superadmin_dashboard/dashboard_overview/hooks/useSuperadminDashboardOverviewSemanticTableState.ts -> local state/typed dependencies -> returned state and actions.
/** Responsibility: use Superadmin Dashboard Semantic Table State; owns the named module state/data-flow behavior and its cleanup/recovery contract. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Owns the dashboard overview semantic table state lifecycle for dashboard overview, keeping feature state and side effects within this leaf.
 * @param args Input required by the declared feature contract. Declared type: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean; }.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminDashboardOverviewSemanticTableState<T extends object>(args: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean }) {
  const { rowData, paginationPageSize, paginationEnabled = false } = args;
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const lastWrittenQueryRef = useRef<string | null>(null);
  const skipNextWriteRef = useRef(false);
  const lastFilterTextRef = useRef('');

  // Hydrate from Next App Router search params so refresh and browser back/forward use the canonical route state.
  useEffect(() => {
    if (lastWrittenQueryRef.current === queryString) {
      lastWrittenQueryRef.current = null;
      setUrlStateReady(true);
      return;
    }
    const params = new URLSearchParams(queryString);
    const nextSearch = params.get('sa_dashboard_overview_search') ?? '';
    const rawPage = params.get('sa_dashboard_overview_page');
    const parsedPage = rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
    const nextPage = Number.isSafeInteger(parsedPage) ? Math.max(0, parsedPage) : 0;
    skipNextWriteRef.current = true;
    lastFilterTextRef.current = nextSearch;
    setFilterText(nextSearch);
    setPage(nextPage);
    setUrlStateReady(true);
  }, [queryString]);

  // Synchronize only this leaf's search/page keys through the App Router, preserving every unrelated query parameter.
  useEffect(() => {
    if (!urlStateReady) return;
    if (skipNextWriteRef.current) { skipNextWriteRef.current = false; return; }
    const params = new URLSearchParams(queryString);
    if (filterText) params.set('sa_dashboard_overview_search', filterText);
    else params.delete('sa_dashboard_overview_search');
    if (page > 0) params.set('sa_dashboard_overview_page', String(page));
    else params.delete('sa_dashboard_overview_page');
    const nextQuery = params.toString();
    if (nextQuery === queryString) { lastFilterTextRef.current = filterText; return; }
    const replaceRoute = () => {
      lastWrittenQueryRef.current = nextQuery;
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
      lastFilterTextRef.current = filterText;
    };
    const filterChanged = lastFilterTextRef.current !== filterText;
    if (filterChanged) {
      const timeoutId = window.setTimeout(replaceRoute, 300);
      return () => window.clearTimeout(timeoutId);
    }
    replaceRoute();
  }, [filterText, page, urlStateReady, queryString, pathname, router]);
  // Keep the current page valid when filtering or data changes reduce the available page count.
  // Effect contract: clamp the current page to the valid range whenever pageCount changes; [pageCount] is the deliberate dependency boundary.
  useEffect(() => { setPage((current) => Math.max(0, Math.min(current, pageCount - 1))); }, [pageCount]);
  const visibleRows = paginationEnabled ? sortedRows.slice(page * paginationPageSize, (page + 1) * paginationPageSize) : sortedRows;
  return { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows };
}
