'use client';
import { ManagerShiftsManagementShiftManagementClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/components/manager_shifts_management_views/ManagerShiftsManagementShiftManagementClient';
import type { ManagerShiftsManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementMainTypes';

// RESPONSIBILITY: Preserve route query context for the shifts management feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature component boundary.


export function ManagerShiftsManagementMain(props: ManagerShiftsManagementMainProps) {
  return (
    <div data-route-view={props.view} data-route-id={props.id} data-route-name={props.name} data-route-phone={props.phone} data-route-smart-id={props.smartId}>
      <ManagerShiftsManagementShiftManagementClient />
    </div>
  );
}
