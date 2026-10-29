'use client';
import { ManagerShiftsMigrationClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/manager_shifts_migration_views/ManagerShiftsMigrationClient.tsx';
import type { ManagerShiftsMigrationMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationMainTypes';

// RESPONSIBILITY: Preserve route query context for the shifts migration feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature component boundary.


export function ManagerShiftsMigrationMain(props: ManagerShiftsMigrationMainProps) {
  return (
    <div data-route-view={props.view} data-route-id={props.id} data-route-name={props.name} data-route-phone={props.phone} data-route-smart-id={props.smartId}>
      <ManagerShiftsMigrationClient />
    </div>
  );
}
