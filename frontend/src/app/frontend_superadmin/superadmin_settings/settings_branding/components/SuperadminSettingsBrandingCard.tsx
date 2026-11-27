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
        'rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-5 sm:p-6 motion-safe:transition-all motion-safe:duration-200 hover:border-indigo-500/35 overflow-hidden relative',
        className
      )}
    >
      {children}
    </div>
  );
}
