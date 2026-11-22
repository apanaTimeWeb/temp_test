'use client';
/** Responsibility: SuperadminBackupConfigurationBadge; provide a feature-local, explicitly typed UI primitive and avoid hidden business, persistence, or network behavior. */
/** Data-Flow: owning backup configuration panel -> status/variant props -> semantic badge presentation; no backup status is fetched or changed here. */
import { forwardRef } from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/utils/SuperadminBackupConfigurationClassNameUtilities';
import { SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants';
import type { SuperadminBackupConfigurationBadgeProps } from '@/app/frontend_superadmin/superadmin_system/system_backup_configuration/types/SuperadminBackupConfigurationBadgeComponentTypes';

/** Renders a semantic badge using only explicitly supported attributes. */
export function SuperadminBackupConfigurationBadge({ className, variant = 'default', id, title, role, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy, 'aria-live': ariaLive, 'data-testid': dataTestId, children }: SuperadminBackupConfigurationBadgeProps) {
  return <span id={id} title={title} role={role} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} aria-live={ariaLive} data-testid={dataTestId} className={cn('sys-badge', SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS[variant] ?? 'sys-badge--outline', className)}>{children}</span>;
}
