'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.api';
import { MANAGER_SEATS_MATRIX_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.query_keys';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns seat-matrix server reads plus UI-only tab/date/selection state. */
export function useManagerSeatsMatrix() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Partial<SeatData>>>({});
  const query = useQuery({ queryKey: MANAGER_SEATS_MATRIX_QUERY_KEYS.seatMatrix, queryFn: fetchManagerSeatsMatrix });
  const rawSeats = query.data ?? [];
  const seats = useMemo(() => rawSeats.map((s) => ({ ...s, ...(overrides[s.id] ?? {}) })), [rawSeats, overrides]);
  const visible = useMemo(() => activeTab === 'All' ? seats : seats.filter((seat) => seat.shift === activeTab || seat.status === 'free' || seat.status === 'maintenance' || seat.status === 'unknown'), [activeTab, seats]);
  const freeCount = useMemo(() => visible.filter((seat) => seat.status === 'free').length, [visible]);

  const updateSeat = (seatId: string, updates: Partial<SeatData>) => {
    setOverrides((prev) => ({ ...prev, [seatId]: { ...(prev[seatId] ?? {}), ...updates } }));
    if (selectedSeat && selectedSeat.id === seatId) {
      setSelectedSeat((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  return { ...query, visible, freeCount, activeTab, setActiveTab, selectedSeat, setSelectedSeat, updateSeat };
}
