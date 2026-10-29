'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MANAGER_SEATS_MANAGEMENT_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/config/manager_seats_management.url_config';
import type { Props } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementComponentTypes';



/** Seat-specific detail view kept inside the seat-management workflow.
 * No authoritative maintenance-history read contract is present in this ZIP, so this view must not invent records.
 */
export function ManagerSeatsManagementSeatMaintenanceView({ seat }: Props) {
  const tManagerUi = useTranslations('manager.manager_seats.ui');
  return (
    <section className="ss-page" data-testid="manager-seat-maintenance-view" aria-labelledby="manager-seat-maintenance-title">
      <div className="ss-page-header">
        <div>
          <h1 id="manager-seat-maintenance-title" className="ss-page-title">{tManagerUi('seat_maintenance_log')}</h1>
          {seat ? <p className="ss-page-subtitle">{tManagerUi('seat')} {seat}</p> : null}
        </div>
        <Link className="ss-btn-ghost" href={MANAGER_SEATS_MANAGEMENT_ROUTES.root}>{tManagerUi('back')}</Link>
      </div>
      <p className="ss-empty-state" role="status" data-testid="manager-seat-maintenance-contract-warning">
        {tManagerUi('maintenance_history_unavailable_read_contract_not_supplied')}
      </p>
      <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('maintenance_update_unavailable_host_mutation_contract_no_d2475a')}>
        {tManagerUi('add_maintenance_entry_unavailable_host_mutation_contract_93ff1c')}
      </button>
    </section>
  );
}
