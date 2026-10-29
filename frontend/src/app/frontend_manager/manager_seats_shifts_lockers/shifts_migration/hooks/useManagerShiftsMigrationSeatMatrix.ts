'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerShiftMigrationSeatMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/api/manager_shifts_migration.api';
import { MANAGER_SHIFTS_MIGRATION_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/api/manager_shifts_migration.query_keys';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns seat-matrix server reads plus UI-only tab/date/selection state. */
export function useManagerShiftMigrationSeatMatrix() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const query = useQuery({ queryKey: MANAGER_SHIFTS_MIGRATION_QUERY_KEYS.seatMatrix, queryFn: fetchManagerShiftMigrationSeatMatrix });
  const seats = query.data ?? [];
  const visible = useMemo(() => activeTab === 'All' ? seats : seats.filter((seat) => seat.shift === activeTab || seat.status === 'free' || seat.status === 'maintenance' || seat.status === 'unknown'), [activeTab, seats]);
  const freeCount = useMemo(() => visible.filter((seat) => seat.status === 'free').length, [visible]);
  return { ...query, visible, freeCount, activeTab, setActiveTab, selectedSeat, setSelectedSeat };
}
