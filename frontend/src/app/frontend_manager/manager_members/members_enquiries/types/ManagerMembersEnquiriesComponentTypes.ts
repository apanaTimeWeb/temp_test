/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerMembersEnquiriesFollowUpFormData } from '@/app/frontend_manager/manager_members/members_enquiries/schemas/ManagerMembersEnquiriesSchema';
import type { ManagerMembersEnquiriesSearchParams } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesMainTypes';
import type { ManagerMembersEnquiriesEnquiry, ManagerMembersEnquiriesEnquiryStatus, ManagerMembersEnquiriesFollowUp } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';
import type { ErrorInfo, ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type ManagerMembersEnquiriesEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerMembersEnquiriesErrorFallbackProps {
  onRetry: () => void;
}

export interface ManagerMembersEnquiriesFollowUpFormPanelProps {
  form: UseFormReturn<ManagerMembersEnquiriesFollowUpFormData>;
  minimumDate: string;
  title: string;
  dateLabel: string;
  remarkLabel: string;
  unavailableTitle: string;
  submitLabel: string;
  nextFollowUpLabel: string;
  nextFollowUpStatus: string;
  nextFollowUpStatusClassName: string;
  editFollowUpLabel: string;
  onDirtyChange?: (dirty: boolean) => void;
}

export interface ManagerMembersEnquiriesActivityTimelineProps {
  followUps: ManagerMembersEnquiriesFollowUp[];
  locale: string;
  title: string;
  emptyLabel: string;
  byLabel: string;
  todayLabel: string;
  yesterdayLabel: string;
}

export interface ManagerMembersEnquiriesEnquiryProfileCardProps {
  enquiry: ManagerMembersEnquiriesEnquiry;
  locale: string;
  statusLabel: string;
  sourceFieldLabel: string;
  sourceLabel: string;
  shiftFieldLabel: string;
  shiftLabel: string;
  handledByFieldLabel: string;
  handledByLabel: string;
  branchFieldLabel: string;
  branchLabel: string;
  enquiryDateLabel: string;
  phoneMaskedLabel: string;
  todayLabel: string;
  yesterdayLabel: string;
}

// RESPONSIBILITY: Renders an individual Kanban card. No API calls.
export interface ManagerMembersEnquiriesKanbanCardProps {
  enq: ManagerMembersEnquiriesEnquiry;
  colClass: string;
  onClick: () => void;
}

export interface ManagerMembersEnquiriesErrorBoundaryProps {
  children: ReactNode;
  /** Optional host-provided, privacy-reviewed error reporting adapter. No telemetry is invented here. */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ManagerMembersEnquiriesErrorBoundaryState {
  hasError: boolean;
}

// RESPONSIBILITY: Renders the Table view for CRM Enquiries. It does not own backend persistence or cross-feature business logic.
export interface ManagerMembersEnquiriesTableProps {
  filtered: ManagerMembersEnquiriesEnquiry[];
}

export type ManagerMembersEnquiriesAddPageRouteProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export interface ManagerMembersEnquiriesDetailPageProps { id: string; }

export interface ManagerMembersEnquiriesEnquiryActionsPanelProps {
  status: ManagerMembersEnquiriesEnquiryStatus;
  statusOptions: readonly ManagerMembersEnquiriesEnquiryStatus[];
  statusLabels: Record<ManagerMembersEnquiriesEnquiryStatus, string>;
  unavailableMessage: string;
  currentStatusLabel: string;
  updateUnavailableLabel: string;
  actionsLabel: string;
  onConvert: () => void;
  alreadyConvertedLabel: string;
  convertLabel: string;
  alreadyLostLabel: string;
  markLostUnavailableLabel: string;
}

export interface ManagerMembersEnquiriesInfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

// RESPONSIBILITY: Renders the entire Kanban board for CRM Enquiries. It does not own backend persistence or cross-feature business logic.
export interface ManagerMembersEnquiriesKanbanProps {
  isEmpty: boolean;
  getCardsByStatus: (status: ManagerMembersEnquiriesEnquiryStatus) => ManagerMembersEnquiriesEnquiry[];
}

export type PendingConfirmation = {
  message: string;
  cancelLabel: string;
  continueLabel: string;
  resolve: (confirmed: boolean) => void;
};

export type ManagerMembersEnquiriesPageProps = {
  searchParams?: Promise<ManagerMembersEnquiriesSearchParams>;
};

export type ManagerMembersEnquiriesBoardViewMode = 'kanban' | 'table';
