import { ManagerShiftsManagementMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/components/ManagerShiftsManagementMain';
import { parseManagerShiftsView, type ManagerShiftsManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementMainTypes';
import type { ManagerShiftsManagementPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerShiftsManagementPage({ searchParams }: ManagerShiftsManagementPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerShiftsManagementMainProps = {
    view: parseManagerShiftsView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerShiftsManagementMain {...mainProps} />;
}
