/** Module-local component props and UI/state types extracted from component files. */
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';
import type { ErrorInfo, ReactNode } from 'react';

// RESPONSIBILITY: Renders the seat detail modal popover. It does not own backend persistence or cross-feature business logic.
export interface ManagerSeatsMatrixModalProps {
  selectedSeat: SeatData | null;
  onClose: () => void;
}

export interface ManagerSeatsMatrixErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerSeatsMatrixErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerSeatsMatrixErrorBoundaryState {
  hasError: boolean;
}
