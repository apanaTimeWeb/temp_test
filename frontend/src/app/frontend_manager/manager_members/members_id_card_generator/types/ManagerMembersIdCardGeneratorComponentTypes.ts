/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersIdCardGeneratorSearchParams } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorMainTypes';
import type { ErrorInfo,ReactNode } from 'react';

export type ManagerMembersIdCardGeneratorEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerMembersIdCardGeneratorErrorFallbackProps {
  onRetry: () => void;
}

export type IdCardSide = 'front' | 'back' | 'both';
export type IdCardPrintLayout = 'pvc_single' | 'a4_sheet_8' | 'a4_sheet_10';

export interface IdCardData {
  name: string;
  smartId: string;
  phone: string;
  shift: string;
  seat: string;
  locker: string;
  plan: string;
  status?: string;
  joinDate?: string;
  expiryDate?: string;
  branch?: string;
  college?: string;
  wifiSsid?: string;
  wifiPassword?: string;
  emergencyPhone?: string;
  helpdeskPhone?: string;
  rules?: string[];
}

export interface ManagerMembersIdCardGeneratorStudentIdCardProps {
  data: IdCardData;
  side?: IdCardSide;
  printLayout?: IdCardPrintLayout;
  onSideChange?: (side: IdCardSide) => void;
  scale?: '100' | '133' | '150';
}

export interface ManagerMembersIdCardGeneratorErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersIdCardGeneratorErrorBoundaryState {
  hasError: boolean;
}

export type ManagerMembersIdCardGeneratorPageProps = {
  searchParams?: Promise<ManagerMembersIdCardGeneratorSearchParams>;
};
