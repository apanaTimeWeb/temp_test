'use client';
// FLOW: Feature component -> security_user_sessions table state -> local filtering/sorting/pagination + Next App Router URL state.
/** Responsibility: keep the session table's local state and shareable search/page query values in sync. */
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const SEARCH_QUERY_KEY = 'sa_security_user_sessions_search';
const PAGE_QUERY_KEY = 'sa_security_user_sessions_page';

export function useSuperadminSecurityUserSessionsSemanticTableState<T extends object>(args: {
  rowData?: readonly T[] | null;
  paginationPageSize: number;
  paginationEnabled?: boolean;
}) {
  const { rowData, paginationPageSize, paginationEnabled = false } = args;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [urlStateReady, setUrlStateReady] = useState(false);
  const skipUrlWriteRef = useRef(false);
  const lastFilterTextRef = useRef(filterText);
  const filterTextRef = useRef(filterText);
  const pageRef = useRef(page);
  filterTextRef.current = filterText;
  pageRef.current = page;

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
  const visibleRows = paginationEnabled ? sortedRows.slice(page * paginationPageSize, (page + 1) * paginationPageSize) : sortedRows;

  // Hydrate only this leaf's keys when Next reports an initial or navigated query string.
  useEffect(() => {
    const params = new URLSearchParams(queryString);
    const nextSearch = params.get(SEARCH_QUERY_KEY) ?? '';
    const rawPage = params.get(PAGE_QUERY_KEY);
    const parsedPage = rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
    const nextPage = Number.isSafeInteger(parsedPage) ? Math.max(0, parsedPage) : 0;
    skipUrlWriteRef.current = nextSearch !== filterTextRef.current || nextPage !== pageRef.current;
    setFilterText(nextSearch);
    setPage(nextPage);
    setUrlStateReady(true);
  }, [queryString]); // queryString is the navigation snapshot from useSearchParams.

  // Preserve unrelated query keys and update this feature's search/page keys using the App Router.
  useEffect(() => {
    if (!urlStateReady) return;
    if (skipUrlWriteRef.current) {
      lastFilterTextRef.current = filterText;
      skipUrlWriteRef.current = false;
      return;
    }

    const filterChanged = lastFilterTextRef.current !== filterText;
    lastFilterTextRef.current = filterText;
    const syncUrl = () => {
      const params = new URLSearchParams(queryString);
      if (filterText) params.set(SEARCH_QUERY_KEY, filterText);
      else params.delete(SEARCH_QUERY_KEY);
      if (page > 0) params.set(PAGE_QUERY_KEY, String(page));
      else params.delete(PAGE_QUERY_KEY);
      const nextQuery = params.toString();
      const currentQuery = queryString;
      if (nextQuery === currentQuery) return;
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ''}`, { scroll: false });
    };

    if (filterChanged) {
      const timeoutId = setTimeout(syncUrl, 300);
      return () => clearTimeout(timeoutId);
    }
    syncUrl();
  }, [filterText, page, queryString, pathname, router, urlStateReady]);

  useEffect(() => {
    setPage((current) => Math.max(0, Math.min(current, pageCount - 1)));
  }, [pageCount]);

  return { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows };
}
