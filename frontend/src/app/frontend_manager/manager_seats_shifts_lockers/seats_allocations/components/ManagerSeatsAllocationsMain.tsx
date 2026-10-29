'use client';
import { ManagerSeatsAllocationsClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/manager_seats_allocations_views/ManagerSeatsAllocationsClient.tsx';
import type { ManagerSeatsAllocationsMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager seats allocations feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerSeatsAllocationsMain(props: ManagerSeatsAllocationsMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerSeatsAllocationsClient />
    </div>
  );
}
