/** Responsibility: SuperadminSettingsBrandingCard; module-owned presentation component for settings_branding. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSettingsBrandingCard formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/utils/SuperadminSettingsBrandingClassNameUtilities';
import type { SuperadminSystemCardProps } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/types/SuperadminSettingsBrandingCardComponentTypes';

/**
 * Performs the superadmin settings branding card operation within settings branding; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardProps.
 */
export function SuperadminSettingsBrandingCard({ children, className }: SuperadminSystemCardProps) {
  return (
    <div
      className={cn(
        'sys-card rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md shadow-xl shadow-black/20 p-5 sm:p-6 transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}
