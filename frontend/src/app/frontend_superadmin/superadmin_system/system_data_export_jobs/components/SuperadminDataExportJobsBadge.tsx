'use client';
/** Responsibility: SuperadminDataExportJobsBadge; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning export-job view -> typed status/variant props -> semantic badge presentation; status is not independently fetched or mutated by this primitive. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/utils/SuperadminDataExportJobsClassNameUtilities';
import { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/constants/SuperadminDataExportJobsStaticConstants';
import type { SuperadminDataExportJobsBadgeProps } from '@/app/frontend_superadmin/superadmin_system/system_data_export_jobs/types/SuperadminDataExportJobsBadgeComponentTypes';

/** Renders a semantic badge using only explicitly supported attributes. */
export function SuperadminDataExportJobsBadge({ className, variant = 'default', id, title, role, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'aria-live': ariaLive, 'data-testid': dataTestId, children }: SuperadminDataExportJobsBadgeProps) {
  return <span id={id} title={title} role={role} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} aria-live={ariaLive} data-testid={dataTestId} className={cn('sys-badge', SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS[variant] ?? 'sys-badge--outline', className)}>{children}</span>;
}
