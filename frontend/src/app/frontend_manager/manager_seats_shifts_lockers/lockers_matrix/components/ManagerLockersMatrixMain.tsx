'use client';
import { ManagerLockersMatrixClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/components/manager_lockers_matrix_views/ManagerLockersMatrixClient.tsx';
import type { ManagerLockersMatrixMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager lockers matrix feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerLockersMatrixMain(props: ManagerLockersMatrixMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerLockersMatrixClient />
    </div>
  );
}
