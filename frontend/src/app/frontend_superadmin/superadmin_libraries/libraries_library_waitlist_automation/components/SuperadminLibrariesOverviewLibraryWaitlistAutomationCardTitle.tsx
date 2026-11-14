/** Responsibility: SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitle; module-owned presentation component for library_waitlist_automation. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitle formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/utils/SuperadminLibrariesOverviewLibraryWaitlistAutomationClassNameUtilities';
import type { SuperadminSystemCardTitleProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_waitlist_automation/types/SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitleComponentTypes';

/**
 * Performs the superadmin libraries overview library waitlist automation card title operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardTitleProps.
 */
export function SuperadminLibrariesOverviewLibraryWaitlistAutomationCardTitle({ children, className }: SuperadminSystemCardTitleProps) {
  return <h3 className={cn('sys-card-title', className)}>{children}</h3>;
}
