export type ManagerLockersMatrixQueryValue = string | string[] | undefined;

export interface ManagerLockersMatrixSearchParams {
  view?: ManagerLockersMatrixQueryValue;
  id?: ManagerLockersMatrixQueryValue;
  name?: ManagerLockersMatrixQueryValue;
  phone?: ManagerLockersMatrixQueryValue;
  smartId?: ManagerLockersMatrixQueryValue;
}

export const MANAGER_LOCKERS_MATRIX_VIEW_KEYS = ['locker_matrix'] as const;
export type ManagerLockersMatrixViewKey = typeof MANAGER_LOCKERS_MATRIX_VIEW_KEYS[number];
export type ManagerLockersMatrixRequestedView = ManagerLockersMatrixViewKey | '__invalid_view__';

export function parseManagerLockerMatrixView(value: string | undefined): ManagerLockersMatrixRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_LOCKERS_MATRIX_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerLockersMatrixViewKey
    : '__invalid_view__';
}

export interface ManagerLockersMatrixMainProps {
  view?: ManagerLockersMatrixRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
