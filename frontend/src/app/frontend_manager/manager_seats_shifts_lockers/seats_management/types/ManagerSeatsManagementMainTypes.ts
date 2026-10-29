export type ManagerSeatsManagementQueryValue = string | string[] | undefined;

export interface ManagerSeatsManagementSearchParams {
  view?: ManagerSeatsManagementQueryValue;
  id?: ManagerSeatsManagementQueryValue;
  name?: ManagerSeatsManagementQueryValue;
  phone?: ManagerSeatsManagementQueryValue;
  smartId?: ManagerSeatsManagementQueryValue;
  seat?: ManagerSeatsManagementQueryValue;
}

export const MANAGER_SEATS_MANAGEMENT_VIEW_KEYS = ['seat_management', 'seat_maintenance'] as const;
export type ManagerSeatsManagementViewKey = typeof MANAGER_SEATS_MANAGEMENT_VIEW_KEYS[number];
export type ManagerSeatsManagementRequestedView = ManagerSeatsManagementViewKey | '__invalid_view__';

export function parseManagerSeatsView(value: string | undefined): ManagerSeatsManagementRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SEATS_MANAGEMENT_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerSeatsManagementViewKey
    : '__invalid_view__';
}

export interface ManagerSeatsManagementMainProps {
  view?: ManagerSeatsManagementRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
  seat?: string;
}
