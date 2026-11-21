/** Responsibility: SuperadminSettingsBrandingCardHeader; module-owned presentation component for settings_branding. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsBrandingCardHeader formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/utils/SuperadminSettingsBrandingClassNameUtilities';
import type { SuperadminSystemCardHeaderProps } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/types/SuperadminSettingsBrandingCardHeaderComponentTypes';

/**
 * Performs the superadmin settings branding card header operation within settings branding; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardHeaderProps.
 */
export function SuperadminSettingsBrandingCardHeader({ children, className }: SuperadminSystemCardHeaderProps) {
  return (
    <div className={cn('sys-card-header flex flex-col gap-1.5 pb-4 border-b border-border/60 mb-5', className)}>
      {children}
    </div>
  );
}
