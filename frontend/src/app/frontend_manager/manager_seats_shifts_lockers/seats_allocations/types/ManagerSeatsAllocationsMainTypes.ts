export type ManagerSeatsAllocationsQueryValue = string | string[] | undefined;

export interface ManagerSeatsAllocationsSearchParams {
  view?: ManagerSeatsAllocationsQueryValue;
  id?: ManagerSeatsAllocationsQueryValue;
  name?: ManagerSeatsAllocationsQueryValue;
  phone?: ManagerSeatsAllocationsQueryValue;
  smartId?: ManagerSeatsAllocationsQueryValue;
}

export const MANAGER_SEATS_ALLOCATIONS_VIEW_KEYS = ['allocations'] as const;
export type ManagerSeatsAllocationsViewKey = typeof MANAGER_SEATS_ALLOCATIONS_VIEW_KEYS[number];
export type ManagerSeatsAllocationsRequestedView = ManagerSeatsAllocationsViewKey | '__invalid_view__';

export function parseManagerAllocationsView(value: string | undefined): ManagerSeatsAllocationsRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SEATS_ALLOCATIONS_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerSeatsAllocationsViewKey
    : '__invalid_view__';
}

export interface ManagerSeatsAllocationsMainProps {
  view?: ManagerSeatsAllocationsRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
