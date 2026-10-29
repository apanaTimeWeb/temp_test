'use client';
// RESPONSIBILITY: Provide the page/orchestration entry component for the seats matrix feature. It does not own backend persistence or cross-feature business logic.
import { ManagerSeatsMatrixClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_views/ManagerSeatsMatrixClient';
import { ManagerSeatsMatrixErrorBoundary } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/components/manager_seats_matrix_states/ManagerSeatsMatrixErrorBoundary';
import type { ManagerSeatsMatrixMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixMainTypes';

export function ManagerSeatsMatrixMain(_props: ManagerSeatsMatrixMainProps) {
  return (
        <ManagerSeatsMatrixErrorBoundary>
          <ManagerSeatsMatrixClient />
        </ManagerSeatsMatrixErrorBoundary>
      );
}
