// DATA FLOW: seats_history route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import type { AdminSeatsHistoryFilterValue } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_history/types/AdminSeatsHistoryTypes';
const SEAT_FILTERS: readonly AdminSeatsHistoryFilterValue[] = ['all'];
/** URL-backed, shareable seat-history filters; preserves unrelated query parameters. */
export function useAdminSeatsHistoryFilters() {
  const [seatFilter, setSeatFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminSeatsHistoryFilterValue>('admin-seats-history-seat', 'all');
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('admin-seats-history-search', '');
  const [dateFrom, setDateFrom] = useAdminApplicationInfrastructureUrlQueryState<string>('admin-seats-history-from', '');
  const [dateTo, setDateTo] = useAdminApplicationInfrastructureUrlQueryState<string>('admin-seats-history-to', '');
  return { seatFilter, setSeatFilter, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo };
}
