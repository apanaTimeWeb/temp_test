export type ManagerSeatsMatrixQueryValue = string | string[] | undefined;

export interface ManagerSeatsMatrixSearchParams {
  view?: ManagerSeatsMatrixQueryValue;
  id?: ManagerSeatsMatrixQueryValue;
  name?: ManagerSeatsMatrixQueryValue;
  phone?: ManagerSeatsMatrixQueryValue;
  smartId?: ManagerSeatsMatrixQueryValue;
}

export const MANAGER_SEATS_MATRIX_VIEW_KEYS = ['seat_matrix'] as const;
export type ManagerSeatsMatrixViewKey = typeof MANAGER_SEATS_MATRIX_VIEW_KEYS[number];
export type ManagerSeatsMatrixRequestedView = ManagerSeatsMatrixViewKey | '__invalid_view__';

export function parseManagerSeatMatrixView(value: string | undefined): ManagerSeatsMatrixRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SEATS_MATRIX_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerSeatsMatrixViewKey
    : '__invalid_view__';
}

export interface ManagerSeatsMatrixMainProps {
  view?: ManagerSeatsMatrixRequestedView;
  id?: string;
}
