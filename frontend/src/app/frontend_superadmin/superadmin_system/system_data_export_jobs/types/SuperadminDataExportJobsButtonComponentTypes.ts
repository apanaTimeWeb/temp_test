// RESPONSIBILITY: Define compile-time types for system data export jobs; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsButtonComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { ButtonHTMLAttributes, FocusEventHandler, KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import type { SUPERADMIN_SYSTEM_BUTTON_SIZE, SUPERADMIN_SYSTEM_BUTTON_VARIANT } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';

/** Button props are intentionally allowlisted; arbitrary props are not forwarded. */
export interface SuperadminDataExportJobsButtonProps {
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  variant?: keyof typeof SUPERADMIN_SYSTEM_BUTTON_VARIANT;
  size?: keyof typeof SUPERADMIN_SYSTEM_BUTTON_SIZE;
  id?: string;
  name?: string;
  value?: ButtonHTMLAttributes<HTMLButtonElement>['value'];
  form?: string;
  title?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-pressed'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-pressed'];
  'aria-expanded'?: ButtonHTMLAttributes<HTMLButtonElement>['aria-expanded'];
  'aria-controls'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  children?: ReactNode;
}
