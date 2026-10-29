import { ManagerLockersMatrixMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/components/ManagerLockersMatrixMain';
import { parseManagerLockerMatrixView, type ManagerLockersMatrixMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixMainTypes';
import type { ManagerLockersMatrixPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_matrix/types/ManagerLockersMatrixComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerLockersMatrixPage({ searchParams }: ManagerLockersMatrixPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerLockersMatrixMainProps = {
    view: parseManagerLockerMatrixView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerLockersMatrixMain {...mainProps} />;
}
