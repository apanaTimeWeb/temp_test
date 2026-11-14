'use client';
/** Responsibility: Superadmin System Switch; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsSwitch formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/utils/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsClassNameUtilities';
import type { SuperadminSystemSwitchProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/types/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsSwitchComponentTypes';

/**
 * Performs the superadmin libraries overview library capacity scaling recommendations switch operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemSwitchProps.
 */
export function SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsSwitch({ checked, onCheckedChange, disabled, id, className, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, 'aria-describedby': ariaDescribedBy, title, 'data-testid': dataTestId }: SuperadminSystemSwitchProps) {
  return <button type="button" role="switch" id={id} aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)} className={cn('sys-switch', className)} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy} title={title} data-testid={dataTestId}><span className="sys-switch-thumb" aria-hidden="true" /></button>;
}
