import { ManagerShiftsMigrationMain } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/components/ManagerShiftsMigrationMain';
import { parseManagerShiftMigrationView, type ManagerShiftsMigrationMainProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationMainTypes';
import type { ManagerShiftsMigrationPageProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerShiftsMigrationPage({ searchParams }: ManagerShiftsMigrationPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerShiftsMigrationMainProps = {
    view: parseManagerShiftMigrationView(firstValue(params.view)),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerShiftsMigrationMain {...mainProps} />;
}
