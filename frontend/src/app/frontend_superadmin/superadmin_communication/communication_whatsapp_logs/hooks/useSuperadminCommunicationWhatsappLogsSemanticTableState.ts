// FLOW: Feature component -> superadmin_communication/communication_whatsapp_logs/hooks/useSuperadminCommunicationWhatsappLogsSemanticTableState.ts -> local state/typed dependencies -> returned state and actions.
/** Responsibility: use Superadmin Communication Semantic Table State; owns the named module state/data-flow behavior and its cleanup/recovery contract. */
import { useEffect, useMemo, useState } from 'react';

/**
 * Owns the communication whatsapp logs semantic table state lifecycle for communication whatsapp logs, keeping feature state and side effects within this leaf.
 * @param args Input required by the declared feature contract. Declared type: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean; }.
 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminCommunicationWhatsappLogsSemanticTableState<T extends object>(args: { rowData?: readonly T[] | null; paginationPageSize: number; paginationEnabled?: boolean }) {
  const { rowData, paginationPageSize, paginationEnabled = false } = args;
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [urlStateReady, setUrlStateReady] = useState(false);
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
  // Free-text filters can contain phone numbers or message fragments and must remain local-only.
  // Remove the legacy search key during hydration; preserve safe pagination and unrelated query parameters.
  useEffect(() => {
    const readSafePage = () => {
      const params = new URLSearchParams(window.location.search);
      const rawPage = params.get('sa_communication_whatsapp_logs_page');
      const parsedPage = rawPage !== null && /^\d+$/.test(rawPage) ? Number(rawPage) : 0;
      setPage(Number.isSafeInteger(parsedPage) ? Math.max(0, parsedPage) : 0);
      if (params.has('sa_communication_whatsapp_logs_search')) {
        params.delete('sa_communication_whatsapp_logs_search');
        const query = params.toString();
        const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
        window.history.replaceState(window.history.state, '', nextUrl);
      }
    };
    readSafePage();
    setUrlStateReady(true);
    window.addEventListener('popstate', readSafePage);
    return () => window.removeEventListener('popstate', readSafePage);
  }, []);

  // Only the non-sensitive page index may be reflected in the URL. Never serialize filterText.
  useEffect(() => {
    if (!urlStateReady) return;
    const params = new URLSearchParams(window.location.search);
    if (page > 0) params.set('sa_communication_whatsapp_logs_page', String(page));
    else params.delete('sa_communication_whatsapp_logs_page');
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextUrl !== currentUrl) window.history.replaceState(window.history.state, '', nextUrl);
  }, [page, urlStateReady]);
  // Keep the current page valid when filtering or data changes reduce the available page count.
  // Effect contract: clamp the current page to the valid range whenever pageCount changes; [pageCount] is the deliberate dependency boundary.
  useEffect(() => { setPage((current) => Math.max(0, Math.min(current, pageCount - 1))); }, [pageCount]);
  const visibleRows = paginationEnabled ? sortedRows.slice(page * paginationPageSize, (page + 1) * paginationPageSize) : sortedRows;
  return { sort, setSort, page, setPage, filterText, setFilterText, sortedRows, pageCount, visibleRows };
}
