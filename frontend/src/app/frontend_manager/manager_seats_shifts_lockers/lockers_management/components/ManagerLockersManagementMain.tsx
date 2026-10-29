'use client';
import { ManagerLockersManagementClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_views/ManagerLockersManagementClient.tsx';
import type { ManagerLockersManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager lockers management feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerLockersManagementMain(props: ManagerLockersManagementMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerLockersManagementClient />
    </div>
  );
}
