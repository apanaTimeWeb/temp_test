export type ManagerLockersManagementQueryValue = string | string[] | undefined;

export interface ManagerLockersManagementSearchParams {
  view?: ManagerLockersManagementQueryValue;
  id?: ManagerLockersManagementQueryValue;
  name?: ManagerLockersManagementQueryValue;
  phone?: ManagerLockersManagementQueryValue;
  smartId?: ManagerLockersManagementQueryValue;
}

export const MANAGER_LOCKERS_MANAGEMENT_VIEW_KEYS = ['lockers'] as const;
export type ManagerLockersManagementViewKey = typeof MANAGER_LOCKERS_MANAGEMENT_VIEW_KEYS[number];
export type ManagerLockersManagementRequestedView = ManagerLockersManagementViewKey | '__invalid_view__';

export function parseManagerLockersView(value: string | undefined): ManagerLockersManagementRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_LOCKERS_MANAGEMENT_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerLockersManagementViewKey
    : '__invalid_view__';
}

export interface ManagerLockersManagementMainProps {
  view?: ManagerLockersManagementRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
