'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { format, parseISO, isValid } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { ManagerLockersManagementNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_table_parts/ManagerLockersManagementNativeTable';
import { useLocale, useTranslations } from 'next-intl';

import { useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerSeatsLockerDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/schemas/ManagerLockersManagementDraftSchemas';
import { useManagerLockersDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/hooks/ManagerLockersManagementDialogFocus';
import { Plus, ChevronDown, Search, UserPlus, Unlock, Wrench } from 'lucide-react';
import type { ManagerLockersManagementNativeColumn as ColDef, ManagerLockersManagementNativeCellParams as ICellRendererParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/components/manager_lockers_management_table_parts/ManagerLockersManagementNativeTable';
import { MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS, type ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';
import type { LockerStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementComponentTypes';





const STATUS_CLASS: Record<LockerStatus, string> = {
  Free: 'ss-badge ss-badge--success',
  Occupied: 'ss-badge ss-badge--danger',
  Maintenance: 'ss-badge ss-badge--warning',
};

function LockerIdCell(props: { value?: any }) {
  return <span className="ss-table__seat-no">{String(props.value ?? '')}</span>;
}

function LockerStatusCell(props: { value?: any }) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  const status = props.value as LockerStatus;
  const label = status === 'Free' ? tManagerUi('free') : status === 'Occupied' ? tManagerUi('occupied') : status === 'Maintenance' ? tManagerUi('maintenance') : String(props.value ?? '');
  return (
    <span className={STATUS_CLASS[status] ?? 'ss-badge ss-badge--inactive'}>
      <span className="ss-badge__dot" />{label}
    </span>
  );
}

function AssignedToCell(props: { data?: any }) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  if (!props.data || props.data.assignedTo === '—') return <span className="ss-table__cell-muted">{tManagerUi('unassigned')}</span>;
  return (
    <div className="ss-cell-stack">
      <p className="ss-cell-name">{props.data.assignedTo}</p>
      <p className="ss-table__cell-sub">{props.data.studentId}</p>
    </div>
  );
}

function AssignedSinceCell(props: { value?: any }) {
  const locale = useLocale();
  const raw = String(props.value ?? '');
  if (raw === '—' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return <span className="ss-table__cell-muted">{raw}</span>;
  const date = parseISO(raw);
  if (!isValid(date)) return <span className="ss-table__cell-muted">{raw}</span>;
  return <span>{format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enUS })}</span>;
}

export function ManagerLockersManagementClient() {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  const lockers = MANAGER_SEATS_SHIFTS_LOCKERS_SAMPLE_LOCKERS;
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssign, setShowAssign] = useState<Locker | null>(null);
  const [assignSearch, setAssignSearch] = useState('');
  const [freeTarget, setFreeTarget] = useState<Locker | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeDialog = showAddModal ? 'add-locker' : showAssign ? 'assign-locker' : freeTarget ? 'free-locker' : false;
  useManagerLockersDialogFocus(dialogRef, () => { setShowAddModal(false); setShowAssign(null); setFreeTarget(null); }, activeDialog);
  const { watch, setValue, reset, clearErrors, formState } = useForm({ resolver: zodResolver(managerSeatsLockerDraftSchema), defaultValues: { lockerId: '' }, mode: 'onChange' });
  const newLockerId = watch('lockerId');
  const addError = formState.errors.lockerId?.message;

  const filtered = lockers.filter(l => statusFilter === 'all' || l.status === statusFilter);

  const colDefs: ColDef<Locker>[] = useMemo(() => [
    { field: 'lockerId', headerName: tManagerUi('locker'), flex: 1, cellRenderer: LockerIdCell },
    { field: 'status', headerName: tManagerUi('status_716883'), flex: 1.2, cellRenderer: LockerStatusCell },
    { field: 'assignedTo', headerName: tManagerUi('assigned_to'), flex: 2, cellRenderer: AssignedToCell },
    { field: 'assignedSince', headerName: tManagerUi('since'), flex: 1.3, cellClass: 'ss-cell-secondary', cellRenderer: AssignedSinceCell },
    {
      headerName: tManagerUi('actions'), flex: 1.2, sortable: false,
      cellRenderer: (props: ICellRendererParams) => {
        const data = props.data as Locker;
        return (
          <div className="ss-cell-actions">
            {data.status === 'Free' && (
              <button type="button" className="ss-btn-icon" aria-label={tManagerUi('assign_student')} title={tManagerUi('assign_student')} onClick={() => setShowAssign(data)}>
                <UserPlus size={13} />
              </button>
            )}
            {data.status === 'Occupied' && (
              <button type="button" className="ss-btn-icon" aria-label={tManagerUi('free_locker')} title={tManagerUi('free_locker')} onClick={() => setFreeTarget(data)}>
                <Unlock size={13} />
              </button>
            )}
            {data.status !== 'Maintenance' && (
              <button type="button" className="ss-btn-icon cursor-not-allowed" aria-label={tManagerUi('maintenance_update_unavailable_host_mutation_contract_no_d2475a')} title={tManagerUi('maintenance_update_unavailable_host_mutation_contract_no_d2475a')} disabled>
                <Wrench size={13} />
              </button>
            )}
          </div>
        );
      },
    },
  ], [tManagerUi]);

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('lockers')}</h1>
            <p className="ss-page-subtitle">{tManagerUi('manage_locker_assignments_and_availability')}</p>
            <p className="ss-page-subtitle" role="status" data-testid="manager-seats-contract-warning">{tManagerUi('sample_data_only_writes_are_disabled_until_the_verified_8ca5b6')}</p>
          </div>
          <button type="button" className="ss-btn-primary ss-btn-start" onClick={() => { reset({ lockerId: '' }); clearErrors(); setShowAddModal(true); }}>
            <Plus size={16} />{tManagerUi('add_locker')}
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__select-wrap">
            <select aria-label={tManagerUi('filter_by_status')} className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{tManagerUi('all_statuses')}</option>
              <option value="Free">{tManagerUi('free')}</option>
              <option value="Occupied">{tManagerUi('occupied')}</option>
              <option value="Maintenance">{tManagerUi('maintenance')}</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="ss-empty-state" role="status">
            <p className="ss-empty-state__icon">🔒</p>
            <p className="ss-empty-state__title">{statusFilter === 'all' ? tManagerUi('no_lockers_added_yet') : tManagerUi('no_lockers_match_current_filter')}</p>
            {statusFilter === 'all' && <button type="button" className="ss-btn-primary" onClick={() => { reset({ lockerId: '' }); clearErrors(); setShowAddModal(true); }}>
              <Plus size={15} />{tManagerUi('add_locker')}
            </button>}
          </div>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <ManagerLockersManagementNativeTable rows={filtered} columns={colDefs} label={tManagerUi('lockers')} getRowKey={(row) => String(row.lockerId)} />
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="ss-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-locker-add-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-locker-add-title" className="ss-modal-title">{tManagerUi('add_locker_e8e079')}</h2>
            <div className="ss-form-field">
              <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockerslockersclient-153">{tManagerUi('locker_id')} <span className="ss-text-danger">*</span></label>
              <input id="rbg4-managerseatsshiftslockerslockersclient-153"
                className={`ss-input ss-input--no-icon${addError ? ' ss-input--error' : ''}`}
                placeholder={tManagerUi('e_g_d01')}
                value={newLockerId}
                onChange={e => setValue('lockerId', e.target.value, { shouldDirty: true, shouldValidate: true })}
              />
              {addError && <p className="ss-error" role="alert">{tManagerUi(addError)}</p>}
            </div>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setShowAddModal(false)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('add_locker_unavailable_host_mutation_contract_not_suppli_0c4933')}>{tManagerUi('add_unavailable')}</button>
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <div className="ss-modal-overlay" onClick={() => setShowAssign(null)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-locker-assign-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-locker-assign-title" className="ss-modal-title">{tManagerUi('assign_locker_b581e8')} {showAssign.lockerId}</h2>
            <div className="ss-form-field">
              <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockerslockersclient-175">{tManagerUi('student')} <span className="ss-text-danger">*</span></label>
              <div className="ss-filter-bar__input-wrap">
                <Search size={14} className="ss-input-icon" />
                <input id="rbg4-managerseatsshiftslockerslockersclient-175" className="ss-input" placeholder={tManagerUi('search_by_name_or_smart_id')} value={assignSearch} onChange={e => setAssignSearch(e.target.value)} disabled title={tManagerUi('locker_assignment_unavailable_host_mutation_contract_not_e5fc07')} />
              </div>
            </div>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setShowAssign(null)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('locker_assignment_unavailable_host_mutation_contract_not_e5fc07')}>
                <UserPlus size={14} />{tManagerUi('assign_unavailable')}
              </button>
            </div>
          </div>
        </div>
      )}

      {freeTarget && (
        <div className="ss-modal-overlay" onClick={() => setFreeTarget(null)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-locker-free-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-locker-free-title" className="ss-modal-title">{tManagerUi('free_locker_2ef279')} {freeTarget.lockerId}</h2>
            <p className="ss-modal-desc">
              {tManagerUi('free_locker')} <strong>{freeTarget.lockerId}</strong> {tManagerUi('from')} <strong>{freeTarget.assignedTo}</strong>{tManagerUi('locker_becomes_available_immediately')}
            </p>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setFreeTarget(null)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-danger cursor-not-allowed" disabled title={tManagerUi('free_locker_unavailable_host_mutation_contract_not_suppl_f342cd')}>{tManagerUi('free_locker_unavailable')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
