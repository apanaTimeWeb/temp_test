// RESPONSIBILITY: Define compile-time types for libraries facility power management; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementLabelComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { LabelHTMLAttributes, MouseEventHandler, ReactNode } from 'react';

/** Label props are intentionally allowlisted; arbitrary props are not forwarded. */
export interface SuperadminLibrariesOverviewFacilityPowerManagementLabelProps {
  className?: string;
  htmlFor?: string;
  id?: string;
  title?: string;
  onClick?: MouseEventHandler<HTMLLabelElement>;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  children?: ReactNode;
}
