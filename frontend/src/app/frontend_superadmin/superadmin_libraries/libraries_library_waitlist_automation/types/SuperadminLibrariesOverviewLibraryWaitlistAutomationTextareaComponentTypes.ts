// RESPONSIBILITY: Define compile-time types for libraries library waitlist automation; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_waitlist_automation/types/SuperadminLibrariesOverviewLibraryWaitlistAutomationTextareaComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { TextareaHTMLAttributes } from 'react';

/** Textarea props are intentionally allowlisted; form registration handlers are forwarded explicitly. */
export interface SuperadminLibrariesOverviewLibraryWaitlistAutomationTextareaProps {
  className?: string;
  id?: string;
  name?: string;
  value?: TextareaHTMLAttributes<HTMLTextAreaElement>['value'];
  defaultValue?: TextareaHTMLAttributes<HTMLTextAreaElement>['defaultValue'];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  cols?: number;
  maxLength?: number;
  readOnly?: boolean;
  onChange?: TextareaHTMLAttributes<HTMLTextAreaElement>['onChange'];
  onBlur?: TextareaHTMLAttributes<HTMLTextAreaElement>['onBlur'];
  onFocus?: TextareaHTMLAttributes<HTMLTextAreaElement>['onFocus'];
  onKeyDown?: TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyDown'];
  title?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: TextareaHTMLAttributes<HTMLTextAreaElement>['aria-invalid'];
  'aria-label'?: string;
  'aria-required'?: TextareaHTMLAttributes<HTMLTextAreaElement>['aria-required'];
  'data-testid'?: string;
}
