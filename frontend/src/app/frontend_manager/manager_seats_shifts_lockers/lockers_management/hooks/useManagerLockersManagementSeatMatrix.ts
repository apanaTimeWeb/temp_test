'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerLockersSeatMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/api/manager_lockers_management.api';
import { MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/api/manager_lockers_management.query_keys';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns seat-matrix server reads plus UI-only tab/date/selection state. */
export function useManagerLockersSeatMatrix() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const query = useQuery({ queryKey: MANAGER_LOCKERS_MANAGEMENT_QUERY_KEYS.seatMatrix, queryFn: fetchManagerLockersSeatMatrix });
  const seats = query.data ?? [];
  const visible = useMemo(() => activeTab === 'All' ? seats : seats.filter((seat) => seat.shift === activeTab || seat.status === 'free' || seat.status === 'maintenance' || seat.status === 'unknown'), [activeTab, seats]);
  const freeCount = useMemo(() => visible.filter((seat) => seat.status === 'free').length, [visible]);
  return { ...query, visible, freeCount, activeTab, setActiveTab, selectedSeat, setSelectedSeat };
}
