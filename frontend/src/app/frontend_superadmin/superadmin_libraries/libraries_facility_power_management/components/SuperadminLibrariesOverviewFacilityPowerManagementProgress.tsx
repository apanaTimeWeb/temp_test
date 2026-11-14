'use client';
/** Responsibility: Superadmin System Progress; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewFacilityPowerManagementProgress formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { useMemo } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/utils/SuperadminLibrariesOverviewFacilityPowerManagementClassNameUtilities';
import type { SuperadminSystemProgressProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_power_management/types/SuperadminLibrariesOverviewFacilityPowerManagementProgressComponentTypes';

/**
 * Performs the superadmin libraries overview facility power management progress operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemProgressProps.
 */
export function SuperadminLibrariesOverviewFacilityPowerManagementProgress({ value, max = 100, className, barClassName, ariaLabel }: SuperadminSystemProgressProps) {
  const percentage = useMemo(() => max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0, [value, max]);
  return <div className="sys-progress-track"><progress className={cn('sa-semantic-progress', className, barClassName)} max={100} value={percentage} aria-label={ariaLabel} /></div>;
}
