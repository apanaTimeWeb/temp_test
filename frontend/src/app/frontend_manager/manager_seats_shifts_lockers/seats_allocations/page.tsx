import { ManagerSeatsAllocationsMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/components/ManagerSeatsAllocationsMain';
import { parseManagerAllocationsView, type ManagerSeatsAllocationsMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsMainTypes';
import type { ManagerSeatsAllocationsPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerSeatsAllocationsPage({ searchParams }: ManagerSeatsAllocationsPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerSeatsAllocationsMainProps = {
    view: parseManagerAllocationsView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerSeatsAllocationsMain {...mainProps} />;
}
