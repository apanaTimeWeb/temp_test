import { ManagerLockersManagementMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/ManagerLockersManagementMain';
import { parseManagerLockersView, type ManagerLockersManagementMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementMainTypes';
import type { ManagerLockersManagementPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerLockersManagementPage({ searchParams }: ManagerLockersManagementPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerLockersManagementMainProps = {
    view: parseManagerLockersView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerLockersManagementMain {...mainProps} />;
}
