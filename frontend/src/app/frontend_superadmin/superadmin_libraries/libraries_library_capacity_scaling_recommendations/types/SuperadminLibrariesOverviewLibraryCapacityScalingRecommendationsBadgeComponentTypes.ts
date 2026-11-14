// RESPONSIBILITY: Define compile-time types for libraries library capacity scaling recommendations; types alone do not validate runtime payloads.
// FLOW: Feature source -> superadmin_libraries/libraries_library_capacity_scaling_recommendations/types/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsBadgeComponentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Explicitly allowlisted native-element props for this feature-local primitive. */
import type { HTMLAttributes, ReactNode } from 'react';
import type { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/constants/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsStaticConstants';

/** Badge props are intentionally allowlisted; arbitrary props are not forwarded. */
export interface SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsBadgeProps {
  className?: string;
  variant?: keyof typeof SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS;
  id?: string;
  title?: string;
  role?: HTMLAttributes<HTMLSpanElement>['role'];
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-live'?: HTMLAttributes<HTMLSpanElement>['aria-live'];
  'data-testid'?: string;
  children?: ReactNode;
}
