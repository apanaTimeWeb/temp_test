/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersGroupAdmissionAdmissionFormValues } from '@/app/frontend_manager/manager_members/members_group_admission/schemas/ManagerMembersGroupAdmissionAdmissionSchema';
import type { ManagerMembersGroupAdmissionSearchParams } from '@/app/frontend_manager/manager_members/members_group_admission/types/ManagerMembersGroupAdmissionMainTypes';
import type { ErrorInfo, ReactNode } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

export interface ManagerMembersGroupAdmissionErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerMembersGroupAdmissionAdmissionEnrollmentSectionProps {
  register: UseFormRegister<ManagerMembersGroupAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersGroupAdmissionAdmissionFormValues>;
}

export interface ManagerMembersGroupAdmissionAdmissionPaymentSectionProps {
  register: UseFormRegister<ManagerMembersGroupAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersGroupAdmissionAdmissionFormValues>;
}

export interface ManagerMembersGroupAdmissionAdmissionPersonalSectionProps {
  register: UseFormRegister<ManagerMembersGroupAdmissionAdmissionFormValues>;
  errors: FieldErrors<ManagerMembersGroupAdmissionAdmissionFormValues>;
}

export interface ManagerMembersGroupAdmissionAdmissionSummaryProps {
  smartIdPreview: string;
  plan: string;
  shift: string;
  seat: string;
  locker: string;
  baseAmountMinor: number;
  discountMinor: number;
  totalPayableMinor: number;
  amountPaidMinor: number;
  currency: string;
  isSubmitting: boolean;
  canSubmit: boolean;
  pricingAvailable?: boolean;
}

export interface ManagerMembersGroupAdmissionErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersGroupAdmissionErrorBoundaryState {
  hasError: boolean;
}

export type ManagerMembersGroupAdmissionGroupPageRouteProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type PendingConfirmation = {
  message: string;
  cancelLabel: string;
  continueLabel: string;
  resolve: (confirmed: boolean) => void;
};

export type ManagerMembersGroupAdmissionPageProps = {
  searchParams?: Promise<ManagerMembersGroupAdmissionSearchParams>;
};
