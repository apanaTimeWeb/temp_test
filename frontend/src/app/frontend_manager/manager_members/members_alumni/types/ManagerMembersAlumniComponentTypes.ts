/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersAlumniSearchParams } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniMainTypes';
import type { ErrorInfo, ReactNode } from 'react';

export interface ManagerMembersAlumniErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerMembersAlumniErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersAlumniErrorBoundaryState {
  hasError: boolean;
}

export type MembersAlumniRow = { id: string; name: string; phone: string; leftDate: string; duration: string; exam: string; currentStatus: string };

export type ManagerMembersAlumniPageProps = {
  searchParams?: Promise<ManagerMembersAlumniSearchParams>;
};
