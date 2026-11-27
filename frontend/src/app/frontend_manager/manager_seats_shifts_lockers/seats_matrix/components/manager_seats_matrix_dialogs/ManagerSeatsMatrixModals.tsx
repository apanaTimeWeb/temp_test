'use client';

import { ManagerSeatsMatrixAddModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixAddModal';
import { ManagerSeatsMatrixModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixModal';
import { ManagerSeatsMatrixStudentProfileModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixStudentProfileModal';
import { ManagerSeatsMatrixSwapModal } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_dialogs/ManagerSeatsMatrixSwapModal';
import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

export interface ManagerSeatsMatrixModalsProps {
  visible: SeatData[];
  selectedSeat: SeatData | null;
  setSelectedSeat: (seat: SeatData | null) => void;
  updateSeat: (seatId: string, patch: Partial<SeatData>) => void;
  addSeat: (seat: SeatData) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isSwapModalOpen: boolean;
  setIsSwapModalOpen: (open: boolean) => void;
  swapSourceSeat: SeatData | null;
  setSwapSourceSeat: (seat: SeatData | null) => void;
  onConfirmSwap: (sourceSeatId: string, targetSeatId: string, reason?: string) => void;
  profileSeat: SeatData | null;
  setProfileSeat: (seat: SeatData | null) => void;
  onNavigateToDirectory: (url: string) => void;
}

/** Modal cluster for Seat Matrix: add seat, seat manage dialog, swap dialog, and student profile preview. */
export function ManagerSeatsMatrixModals({
  visible,
  selectedSeat,
  setSelectedSeat,
  updateSeat,
  addSeat,
  isAddModalOpen,
  setIsAddModalOpen,
  isSwapModalOpen,
  setIsSwapModalOpen,
  swapSourceSeat,
  setSwapSourceSeat,
  onConfirmSwap,
  profileSeat,
  setProfileSeat,
  onNavigateToDirectory,
}: ManagerSeatsMatrixModalsProps) {
  return (
    <>
      <ManagerSeatsMatrixAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSeat={addSeat}
      />

      <ManagerSeatsMatrixModal
        selectedSeat={selectedSeat}
        onClose={() => setSelectedSeat(null)}
        onUpdateSeat={updateSeat}
        onOpenStudentProfile={(seat) => {
          setSelectedSeat(null);
          setProfileSeat(seat);
        }}
        onOpenSwapModal={(seat) => {
          setSelectedSeat(null);
          setSwapSourceSeat(seat);
          setIsSwapModalOpen(true);
        }}
      />

      <ManagerSeatsMatrixSwapModal
        isOpen={isSwapModalOpen}
        sourceSeat={swapSourceSeat}
        allSeats={visible}
        onClose={() => {
          setIsSwapModalOpen(false);
          setSwapSourceSeat(null);
        }}
        onConfirmSwap={onConfirmSwap}
      />

      <ManagerSeatsMatrixStudentProfileModal
        isOpen={Boolean(profileSeat)}
        seat={profileSeat}
        onClose={() => setProfileSeat(null)}
        onNavigateToDirectory={(smartId) => {
          setProfileSeat(null);
          onNavigateToDirectory(MANAGER_SEATS_MATRIX_ROUTES.STUDENTS_FILTER_BY_SMART_ID(smartId));
        }}
      />
    </>
  );
}
