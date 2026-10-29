'use client';
import { ManagerSeatsManagementSeatManagementClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_views/ManagerSeatsManagementSeatManagementClient';
import { ManagerSeatsManagementSeatMaintenanceView } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_views/ManagerSeatsManagementSeatMaintenanceView';
import type { ManagerSeatsManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementMainTypes';

// RESPONSIBILITY: Preserve route query context for the seats management feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature component boundary.


export function ManagerSeatsManagementMain(props: ManagerSeatsManagementMainProps) {
  return (
    <div data-route-view={props.view} data-route-id={props.id} data-route-name={props.name} data-route-phone={props.phone} data-route-smart-id={props.smartId}>
      {props.view === 'seat_maintenance'
        ? <ManagerSeatsManagementSeatMaintenanceView seat={props.seat} />
        : props.view === '__invalid_view__'
          ? <p className="ss-empty-state" role="alert" data-testid="manager-seats-invalid-view">Unsupported seat-management view.</p>
          : <ManagerSeatsManagementSeatManagementClient />}
    </div>
  );
}
