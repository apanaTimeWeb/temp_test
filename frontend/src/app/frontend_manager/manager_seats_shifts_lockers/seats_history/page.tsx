import { ManagerSeatsHistoryMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/ManagerSeatsHistoryMain';
import type { ManagerSeatsHistoryPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryComponentTypes';
import { parseManagerSeatHistoryView,type ManagerSeatsHistoryMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryMainTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerSeatsHistoryPage({ searchParams }: ManagerSeatsHistoryPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerSeatsHistoryMainProps = {
    view: parseManagerSeatHistoryView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerSeatsHistoryMain {...mainProps} />;
}
