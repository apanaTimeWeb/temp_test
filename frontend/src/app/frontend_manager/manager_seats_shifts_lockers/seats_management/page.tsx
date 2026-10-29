import { ManagerSeatsManagementMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/ManagerSeatsManagementMain';
import { parseManagerSeatsView, type ManagerSeatsManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementMainTypes';
import type { ManagerSeatsManagementPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerSeatsManagementPage({ searchParams }: ManagerSeatsManagementPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerSeatsManagementMainProps = {
    view: parseManagerSeatsView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
    seat: firstValue(params.seat),
  };
  return <ManagerSeatsManagementMain {...mainProps} />;
}
