import type { AdminPlansFormValues,AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import type React from 'react';
import type { ReactNode } from 'react';

export type AdminMembersPlansScenario = 'ACTIVE' | 'EMPTY' | 'SERVER_500' | 'TIMEOUT' | 'UNAUTHORIZED';

export interface AdminPlansDeleteDialogProps {
  open: boolean;
  planName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export interface AdminPlansEmptyStateProps {
  title?: string;
  description?: string;
}

export interface AdminPlansErrorBoundaryProps { children: React.ReactNode; }

export interface AdminPlansErrorBoundaryState { hasError: boolean; }

export interface AdminPlansFormDialogProps {
  open: boolean;
  editingPlan: AdminPlansPlan | null;
  onClose: () => void;
  onValidated: (values: AdminPlansFormValues) => void;
}

export interface AdminMembersPlansHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersPlansScenario;
}

export type AdminPlansPlanAmountUnit = 'minor' | 'major';
