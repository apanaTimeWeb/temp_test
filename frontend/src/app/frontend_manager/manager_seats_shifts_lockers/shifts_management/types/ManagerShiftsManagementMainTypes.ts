export type ManagerShiftsManagementQueryValue = string | string[] | undefined;

export interface ManagerShiftsManagementSearchParams {
  view?: ManagerShiftsManagementQueryValue;
  id?: ManagerShiftsManagementQueryValue;
  name?: ManagerShiftsManagementQueryValue;
  phone?: ManagerShiftsManagementQueryValue;
  smartId?: ManagerShiftsManagementQueryValue;
}

export const MANAGER_SHIFTS_MANAGEMENT_VIEW_KEYS = ['shift_management'] as const;
export type ManagerShiftsManagementViewKey = typeof MANAGER_SHIFTS_MANAGEMENT_VIEW_KEYS[number];
export type ManagerShiftsManagementRequestedView = ManagerShiftsManagementViewKey | '__invalid_view__';

export function parseManagerShiftsView(value: string | undefined): ManagerShiftsManagementRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SHIFTS_MANAGEMENT_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerShiftsManagementViewKey
    : '__invalid_view__';
}

export interface ManagerShiftsManagementMainProps {
  view?: ManagerShiftsManagementRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
