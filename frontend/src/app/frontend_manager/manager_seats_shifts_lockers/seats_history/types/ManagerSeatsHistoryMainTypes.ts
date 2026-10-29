export type ManagerSeatsHistoryQueryValue = string | string[] | undefined;

export interface ManagerSeatsHistorySearchParams {
  view?: ManagerSeatsHistoryQueryValue;
  id?: ManagerSeatsHistoryQueryValue;
  name?: ManagerSeatsHistoryQueryValue;
  phone?: ManagerSeatsHistoryQueryValue;
  smartId?: ManagerSeatsHistoryQueryValue;
}

export const MANAGER_SEATS_HISTORY_VIEW_KEYS = ['seat_history'] as const;
export type ManagerSeatsHistoryViewKey = typeof MANAGER_SEATS_HISTORY_VIEW_KEYS[number];
export type ManagerSeatsHistoryRequestedView = ManagerSeatsHistoryViewKey | '__invalid_view__';

export function parseManagerSeatHistoryView(value: string | undefined): ManagerSeatsHistoryRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SEATS_HISTORY_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerSeatsHistoryViewKey
    : '__invalid_view__';
}

export interface ManagerSeatsHistoryMainProps {
  view?: ManagerSeatsHistoryRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
