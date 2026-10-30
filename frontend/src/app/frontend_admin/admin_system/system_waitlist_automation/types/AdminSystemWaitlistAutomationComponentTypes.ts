import type { AdminSystemWaitlistAutomationScenario } from '@/app/frontend_admin/admin_system/system_waitlist_automation/tests/harness/bootstrap';
import type { AdminSystemWaitlistPreviewFormValues } from '@/app/frontend_admin/admin_system/system_waitlist_automation/schemas/AdminSystemWaitlistAutomationWaitlistPreviewSchema';
import type { ReactNode, TextareaHTMLAttributes } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export interface AdminSystemTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface AdminSystemWaitlistConfigurationSectionProps {
  form: UseFormReturn<AdminSystemWaitlistPreviewFormValues>;
}

export interface AdminSystemWaitlistStatusSectionProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

export interface AdminSystemWaitlistAutomationHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemWaitlistAutomationScenario;
}
