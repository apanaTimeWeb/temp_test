'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchManagerSeatsMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.api';
import { MANAGER_SEATS_MATRIX_QUERY_KEYS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/api/manager_seats_matrix.query_keys';
import type { SeatData, ShiftType } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns seat-matrix server reads plus UI-only tab/date/selection state. */
export function useManagerSeatsMatrix() {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Partial<SeatData>>>({});
  const [addedSeats, setAddedSeats] = useState<SeatData[]>([]);
  const query = useQuery({ queryKey: MANAGER_SEATS_MATRIX_QUERY_KEYS.seatMatrix, queryFn: fetchManagerSeatsMatrix });
  const rawSeats = query.data ?? [];
  const allSeats = useMemo(() => [...rawSeats, ...addedSeats], [rawSeats, addedSeats]);
  const seats = useMemo(() => allSeats.map((s) => ({ ...s, ...(overrides[s.id] ?? {}) })), [allSeats, overrides]);
  const visible = useMemo(() => {
    if (activeTab === 'All') return seats;
    return seats.map((seat) => {
      if (seat.status === 'maintenance' || seat.status === 'unknown') {
        return seat;
      }

      // Check per-shift allocation dictionary if provided
      const shiftAlloc = seat.shiftAllocations?.[activeTab as ShiftType];
      if (shiftAlloc) {
        return {
          ...seat,
          status: shiftAlloc.status || 'occupied',
          student: shiftAlloc.student,
          smartId: shiftAlloc.smartId,
          studentGender: shiftAlloc.studentGender,
          expiry: shiftAlloc.expiry,
          shift: activeTab,
        };
      }

      // If seat is explicitly booked for this shift or Full Day
      const isAllocatedInThisShift =
        seat.shift === activeTab ||
        seat.shift === 'Full Day' ||
        Boolean(seat.shift && seat.shift.includes(activeTab));

      if (isAllocatedInThisShift) {
        return {
          ...seat,
          shift: activeTab,
        };
      }

      // If seat is occupied in another shift (e.g. Evening), it is free/available in this shift!
      return {
        ...seat,
        status: 'free' as const,
        student: undefined,
        smartId: undefined,
        studentGender: undefined,
        expiry: undefined,
        shift: activeTab,
      };
    });
  }, [activeTab, seats]);
  const freeCount = useMemo(() => visible.filter((seat) => seat.status === 'free').length, [visible]);

  const addSeat = (newSeat: SeatData) => {
    setAddedSeats((prev) => [...prev, newSeat]);
  };

  const updateSeat = (seatId: string, updates: Partial<SeatData>) => {
    setOverrides((prev) => ({ ...prev, [seatId]: { ...(prev[seatId] ?? {}), ...updates } }));
    if (selectedSeat && selectedSeat.id === seatId) {
      setSelectedSeat((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  return { ...query, visible, freeCount, activeTab, setActiveTab, selectedSeat, setSelectedSeat, updateSeat, addSeat };
}
