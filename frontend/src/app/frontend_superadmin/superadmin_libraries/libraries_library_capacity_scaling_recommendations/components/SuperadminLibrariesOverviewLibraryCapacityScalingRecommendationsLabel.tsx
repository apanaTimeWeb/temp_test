'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/utils/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsClassNameUtilities';
import type { SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabelProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/types/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabelComponentTypes';

export const SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel = forwardRef<HTMLLabelElement, SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabelProps>(
  ({ className, htmlFor, id, title, onClick, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'data-testid': dataTestId, children }, ref) => (
    <label ref={ref} htmlFor={htmlFor} id={id} title={title} onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} data-testid={dataTestId} className={cn('sys-label', className)}>{children}</label>
  ),
);
SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel.displayName = 'SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsLabel';
