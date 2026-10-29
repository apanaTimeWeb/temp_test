/** Module-local component props and UI/state types extracted from component files. */
import type { ReactNode } from 'react';

export type ManagerSettingsHelpSupportEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerSettingsHelpSupportTicketFormProps {
  onCancel: () => void;
}

export type PendingConfirmation = { message: string; cancelLabel: string; continueLabel: string; resolve: (confirmed: boolean) => void };
