/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersNewAdmissionAdmissionFormValues } from '@/app/frontend_manager/manager_members/members_new_admission/schemas/ManagerMembersNewAdmissionAdmissionSchema';
import type { ManagerMembersNewAdmissionSearchParams } from '@/app/frontend_manager/manager_members/members_new_admission/types/ManagerMembersNewAdmissionMainTypes';
import type { ErrorInfo, ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface ManagerMembersNewAdmissionErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerMembersNewAdmissionAdmissionEnrollmentSectionProps {
  register: UseFormRegister<ManagerMembersNewAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersNewAdmissionAdmissionFormValues>;
}

export interface ManagerMembersNewAdmissionAdmissionPaymentSectionProps {
  register: UseFormRegister<ManagerMembersNewAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersNewAdmissionAdmissionFormValues>;
}

export interface ManagerMembersNewAdmissionAdmissionPersonalSectionProps {
  register: UseFormRegister<ManagerMembersNewAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersNewAdmissionAdmissionFormValues>;
}

export interface ManagerMembersNewAdmissionAdmissionSummaryProps {
  smartIdPreview: string;
  plan: string;
  shift: string;
  seat: string;
  locker?: string;
  baseAmountMinor: number;
  discountMinor: number;
  totalPayableMinor: number;
  amountPaidMinor: number;
  currency: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  pricingAvailable?: boolean;
  hasUnsavedChanges?: boolean;
}

export interface ManagerMembersNewAdmissionErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersNewAdmissionErrorBoundaryState {
  hasError: boolean;
}

export type PendingConfirmation = {
  message: string;
  cancelLabel: string;
  continueLabel: string;
  resolve: (confirmed: boolean) => void;
};

export type ManagerMembersNewAdmissionPageProps = {
  searchParams?: Promise<ManagerMembersNewAdmissionSearchParams>;
};
