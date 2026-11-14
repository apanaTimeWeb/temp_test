'use client';
/** Responsibility: SuperadminLibrariesOverviewLibraryWaitlistAutomationBadge; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryWaitlistAutomationBadge formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/utils/SuperadminLibrariesOverviewLibraryWaitlistAutomationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/constants/SuperadminLibrariesOverviewLibraryWaitlistAutomationStaticConstants';
import type { SuperadminLibrariesOverviewLibraryWaitlistAutomationBadgeProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/types/SuperadminLibrariesOverviewLibraryWaitlistAutomationBadgeComponentTypes';

/** Renders a semantic badge using only explicitly supported attributes. */
export function SuperadminLibrariesOverviewLibraryWaitlistAutomationBadge({ className, variant = 'default', id, title, role, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'aria-live': ariaLive, 'data-testid': dataTestId, children }: SuperadminLibrariesOverviewLibraryWaitlistAutomationBadgeProps) {
  return <span id={id} title={title} role={role} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} aria-live={ariaLive} data-testid={dataTestId} className={cn('sys-badge', SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS[variant] ?? 'sys-badge--outline', className)}>{children}</span>;
}
