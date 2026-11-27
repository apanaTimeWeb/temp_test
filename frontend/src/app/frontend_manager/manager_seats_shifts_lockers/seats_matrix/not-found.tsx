import { MANAGER_SEATS_MATRIX_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/config/manager_seats_matrix.url_config';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function NotFound() {
  const tManagerUi = await getTranslations('manager.manager_seat_matrix.ui');
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center" role="status">
      <h2 className="text-xl font-semibold text-foreground">{tManagerUi('a_wing_floor_plan')}</h2>
      <p className="text-sm text-muted-foreground">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
      <Link
        href={MANAGER_SEATS_MATRIX_ROUTES.seatMatrix}
        className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {tManagerUi('a_wing_floor_plan')}
      </Link>
    </div>
  );
}
