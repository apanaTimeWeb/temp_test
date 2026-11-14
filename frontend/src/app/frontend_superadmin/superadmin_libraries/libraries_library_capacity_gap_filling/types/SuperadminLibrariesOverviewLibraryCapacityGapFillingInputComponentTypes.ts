// RESPONSIBILITY: Define compile-time types for libraries library capacity gap filling; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_capacity_gap_filling/types/SuperadminLibrariesOverviewLibraryCapacityGapFillingInputComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { InputHTMLAttributes } from 'react';

/** Input props are intentionally allowlisted; form registration handlers are forwarded explicitly. */
export interface SuperadminLibrariesOverviewLibraryCapacityGapFillingInputProps {
  className?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  id?: string;
  name?: string;
  value?: InputHTMLAttributes<HTMLInputElement>['value'];
  defaultValue?: InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  min?: InputHTMLAttributes<HTMLInputElement>['min'];
  max?: InputHTMLAttributes<HTMLInputElement>['max'];
  step?: InputHTMLAttributes<HTMLInputElement>['step'];
  maxLength?: number;
  readOnly?: boolean;
  checked?: boolean;
  pattern?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange'];
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  onFocus?: InputHTMLAttributes<HTMLInputElement>['onFocus'];
  onKeyDown?: InputHTMLAttributes<HTMLInputElement>['onKeyDown'];
  onInput?: InputHTMLAttributes<HTMLInputElement>['onInput'];
  title?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: InputHTMLAttributes<HTMLInputElement>['aria-invalid'];
  'aria-label'?: string;
  'aria-required'?: InputHTMLAttributes<HTMLInputElement>['aria-required'];
  'data-testid'?: string;
}
