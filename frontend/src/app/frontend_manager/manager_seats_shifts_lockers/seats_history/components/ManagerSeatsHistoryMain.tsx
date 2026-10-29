'use client';
import { ManagerSeatsHistoryClient } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_views/ManagerSeatsHistoryClient';
import type { ManagerSeatsHistoryMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryMainTypes';

// RESPONSIBILITY: Preserve route query context for the manager seats history feature.
// DATA FLOW: Next.js route page -> typed Main props -> feature client/view boundary.


export function ManagerSeatsHistoryMain(props: ManagerSeatsHistoryMainProps) {
  return (
    <div
      data-route-view={props.view}
      data-route-id={props.id}
      data-route-name={props.name}
      data-route-phone={props.phone}
      data-route-smart-id={props.smartId}
    >
      <ManagerSeatsHistoryClient />
    </div>
  );
}
