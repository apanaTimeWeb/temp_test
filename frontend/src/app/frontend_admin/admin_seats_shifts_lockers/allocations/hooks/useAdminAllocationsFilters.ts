// DATA FLOW: allocations route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AdminAllocationsFilterValue } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/types/AdminAllocationsTypes';
import { ADMIN_ALLOCATIONS_ALLOCATION_STATUS_OPTIONS, ADMIN_ALLOCATIONS_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';
import { isValidAdminAllocationsIsoDate } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsFilterUtils';

const SHIFT_VALUES = ['all', ...ADMIN_ALLOCATIONS_SHIFTS.filter((shift) => shift !== 'All')] as const;
const STATUS_VALUES = ['all', ...ADMIN_ALLOCATIONS_ALLOCATION_STATUS_OPTIONS.map((option) => option.value)] as const;

/** Owns canonical filter state in the URL so refresh, share, back and forward preserve the active view. */
export function useAdminAllocationsFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const updateParam = useCallback((key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(query);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    const nextQuery = next.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, query, router]);

  const rawShift = searchParams.get('shift') ?? 'all';
  const shiftFilter: AdminAllocationsFilterValue = SHIFT_VALUES.includes(rawShift as (typeof SHIFT_VALUES)[number]) ? rawShift : 'all';
  const rawStatus = searchParams.get('status') ?? 'all';
  const statusFilter: AdminAllocationsFilterValue = STATUS_VALUES.includes(rawStatus as (typeof STATUS_VALUES)[number]) ? rawStatus : 'all';
  const rawDateFrom = searchParams.get('from') ?? '';
  const rawDateTo = searchParams.get('to') ?? '';
  const dateFrom = isValidAdminAllocationsIsoDate(rawDateFrom) ? rawDateFrom : '';
  const dateTo = isValidAdminAllocationsIsoDate(rawDateTo) ? rawDateTo : '';

  const setShiftFilter = useCallback((value: string) => updateParam('shift', SHIFT_VALUES.includes(value as (typeof SHIFT_VALUES)[number]) ? value : 'all', 'all'), [updateParam]);
  const setStatusFilter = useCallback((value: string) => updateParam('status', STATUS_VALUES.includes(value as (typeof STATUS_VALUES)[number]) ? value : 'all', 'all'), [updateParam]);
  const setDateFrom = useCallback((value: string) => updateParam('from', isValidAdminAllocationsIsoDate(value) ? value : '', ''), [updateParam]);
  const setDateTo = useCallback((value: string) => updateParam('to', isValidAdminAllocationsIsoDate(value) ? value : '', ''), [updateParam]);

  return { shiftFilter, setShiftFilter, statusFilter, setStatusFilter, dateFrom, setDateFrom, dateTo, setDateTo } as const;
}
