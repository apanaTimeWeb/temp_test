export type ManagerShiftsMigrationQueryValue = string | string[] | undefined;

export interface ManagerShiftsMigrationSearchParams {
  view?: ManagerShiftsMigrationQueryValue;
  id?: ManagerShiftsMigrationQueryValue;
  name?: ManagerShiftsMigrationQueryValue;
  phone?: ManagerShiftsMigrationQueryValue;
  smartId?: ManagerShiftsMigrationQueryValue;
}

export const MANAGER_SHIFTS_MIGRATION_VIEW_KEYS = ['shift_migration'] as const;
export type ManagerShiftsMigrationViewKey = typeof MANAGER_SHIFTS_MIGRATION_VIEW_KEYS[number];
export type ManagerShiftsMigrationRequestedView = ManagerShiftsMigrationViewKey | '__invalid_view__';

export function parseManagerShiftMigrationView(value: string | undefined): ManagerShiftsMigrationRequestedView | undefined {
  if (value === undefined) return undefined;
  return (MANAGER_SHIFTS_MIGRATION_VIEW_KEYS as readonly string[]).includes(value)
    ? value as ManagerShiftsMigrationViewKey
    : '__invalid_view__';
}

export interface ManagerShiftsMigrationMainProps {
  view?: ManagerShiftsMigrationRequestedView;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
