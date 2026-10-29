/** Module-local component props and UI/state types extracted from component files. */
import type { ErrorInfo, ReactNode } from 'react';

export interface ManagerMembersReferralBonusErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerMembersReferralBonusErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersReferralBonusErrorBoundaryState {
  hasError: boolean;
}

export type ReferralRow = { id: string; referrer: string; referred: string; date: string; status: string; bonus: string; method: string };
