'use client';
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Orchestrate the client-side view and local interactions for components. It does not own backend persistence or cross-feature business logic.
import { ManagerSeatsManagementNativeTable } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_table_parts/ManagerSeatsManagementNativeTable';
import { useLocale, useTranslations } from 'next-intl';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useManagerSeatsDialogFocus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/hooks/ManagerSeatsManagementDialogFocus';
import { Plus, Search, ChevronDown, Wrench, Edit, AlertTriangle } from 'lucide-react';
import type { ManagerSeatsManagementNativeColumn as ColDef, ManagerSeatsManagementNativeCellParams as ICellRendererParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_table_parts/ManagerSeatsManagementNativeTable';
import { useRouter } from 'next/navigation';
import { MANAGER_SEATS_MANAGEMENT_ROUTES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/config/manager_seats_management.url_config';
import { useManagerSeatsSeatMatrix } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/hooks/useManagerSeatsManagementSeatMatrix';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementTypes';
import { managerSeatsSeatDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/schemas/ManagerSeatsManagementDraftSchemas';
import { displayValue } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/utils/ManagerSeatsManagementDisplayValue';
import { ManagerSeatsManagementEmptyState } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/components/manager_seats_management_empty_states/ManagerSeatsManagementEmptyState';
import type { ManagerSeatsManagementSeatManagementClientSeatStatus, SeatDraft, SeatManagementRow, SeatStatusTranslationKey } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementComponentTypes';
import { MANAGER_SEATS_MANAGEMENT_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/constants/ManagerSeatsManagementConstants';







const STATUS_CLASS: Record<SeatData['status'], string> = {
  free: 'ss-badge ss-badge--success',
  occupied: 'ss-badge ss-badge--danger',
  expiring: 'ss-badge ss-badge--warning',
  maintenance: 'ss-badge ss-badge--warning',
  unknown: 'ss-badge ss-badge--inactive',
};

const EMPTY_FORM: SeatDraft = { seatNo: '', branch: '', status: 'Working' };

function SeatNoCell(props: { value?: any }) {
  return <span className="ss-table__seat-no">{String(props.value ?? '')}</span>;
}

function BranchCell(props: { data?: any }) {
  return <span className="ss-cell-primary">{displayValue(props.data?.branch)}</span>;
}

function seatStatusTranslationKey(status: SeatData['status']): SeatStatusTranslationKey {
  const key: Record<SeatData['status'], SeatStatusTranslationKey> = { free: 'free', occupied: 'occupied', expiring: 'expiring_soon', maintenance: 'maintenance', unknown: 'unknown_status' };
  return key[status];
}

function SeatStatusCell(props: { value?: any }) {
  const tManagerUi = useTranslations('manager.manager_seats.ui');
  const val = String(props.value ?? '');
  const status = (['free', 'occupied', 'expiring', 'maintenance', 'unknown'].includes(val) ? val : 'unknown') as SeatData['status'];
  return (
    <span className={STATUS_CLASS[status]}>
      <span className="ss-badge__dot" />{tManagerUi(seatStatusTranslationKey(status))}
    </span>
  );
}

export function ManagerSeatsManagementSeatManagementClient() {
  const tManagerUi = useTranslations('manager.manager_seats.ui');
  const locale = useLocale();
  const formatLastMaintenance = (value: unknown) => {
    const raw = String(value ?? '');
    if (raw === 'Today') return tManagerUi('today');
    if (raw === 'Pending') return tManagerUi('pending');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const [year, month, day] = raw.split('-').map(Number);
    return new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day));
  };
  const router = useRouter();
  const seatMatrixQuery = useManagerSeatsSeatMatrix();
  const seats: SeatManagementRow[] = useMemo(() => (seatMatrixQuery.data ?? []).map((seat) => ({
    uuid: seat.uuid, seatNo: seat.id, branch: '—', status: seat.status, assignedTo: displayValue(seat.student), lastMaintenance: '—', smartId: seat.smartId, shift: seat.shift, expiry: seat.expiry, student: seat.student,
  })), [seatMatrixQuery.data]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // Dependency rationale: debounce seat search input (300ms) and clear the timer when the query changes or the component unmounts.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editSeat, setEditSeat] = useState<SeatManagementRow | null>(null);
  const { watch, setValue, reset, clearErrors, formState } = useForm<SeatDraft>({ resolver: zodResolver(managerSeatsSeatDraftSchema), defaultValues: EMPTY_FORM, mode: 'onChange' });
  const form = watch();
  const errors = formState.errors;
  const [confirmBroken, setConfirmBroken] = useState<SeatManagementRow | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeDialog = showModal ? 'edit-seat' : confirmBroken ? 'confirm-broken-seat' : false;
  useManagerSeatsDialogFocus(dialogRef, () => { setShowModal(false); setConfirmBroken(null); }, activeDialog);

  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const hasActiveFilters = normalizedSearch.length > 0 || statusFilter !== 'all';
  const filtered = seats.filter(s => {
    const matchSearch = s.seatNo.toLowerCase().includes(normalizedSearch) ||
      s.branch.toLowerCase().includes(normalizedSearch) ||
      s.assignedTo.toLowerCase().includes(normalizedSearch);
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setEditSeat(null);
    reset(EMPTY_FORM);
    clearErrors();
    setShowModal(true);
  }

  function openEdit(seat: SeatManagementRow) {
    setEditSeat(seat);
    reset({ seatNo: seat.seatNo, branch: '', status: 'Working' });
    clearErrors();
    setShowModal(true);
  }



  const colDefs: ColDef<SeatManagementRow>[] = useMemo(() => [
    { field: 'seatNo', headerName: tManagerUi('seat'), flex: 1, cellRenderer: SeatNoCell },
    { field: 'branch', headerName: tManagerUi('branch_64c87b'), flex: 2, cellRenderer: BranchCell },
    { field: 'status', headerName: tManagerUi('status_716883'), flex: 1.2, cellRenderer: SeatStatusCell },
    { field: 'assignedTo', headerName: tManagerUi('assigned_to'), flex: 2, cellClass: 'ss-cell-secondary' },
    { field: 'lastMaintenance', headerName: tManagerUi('last_maintenance'), flex: 1.5, cellClass: 'ss-cell-secondary', valueFormatter: (params) => formatLastMaintenance(params.value) },
    {
      headerName: tManagerUi('actions'), flex: 1.5, sortable: false,
      cellRenderer: (props: ICellRendererParams) => {
        const data = props.data as SeatManagementRow;
        return (
          <div className="ss-cell-actions">
            <button type="button" className="ss-btn-icon" aria-label={tManagerUi('view_maintenance_log')} title={tManagerUi('view_maintenance_log')} onClick={() => router.push(MANAGER_SEATS_MANAGEMENT_ROUTES.seatMaintenance(data.seatNo))}>
              <Wrench size={13} />
            </button>
            <button type="button" className="ss-btn-icon" aria-label={tManagerUi('edit')} title={tManagerUi('edit')} onClick={() => openEdit(data)}>
              <Edit size={13} />
            </button>
            <button type="button" className="ss-btn-icon cursor-not-allowed" aria-label={tManagerUi('status_update_unavailable_host_mutation_contract_not_sup_953486')} title={tManagerUi('status_update_unavailable_host_mutation_contract_not_sup_953486')} disabled>
              <AlertTriangle size={13} />
            </button>
          </div>
        );
      },
    },
  ], [locale, tManagerUi]);

  return (
    <>
      <div className="ss-page">
        <div className="ss-page-header">
          <div>
            <h1 className="ss-page-title">{tManagerUi('seats')}</h1>
            <p className="ss-page-subtitle">{tManagerUi('manage_all_library_seats')}</p>
            <p className="ss-page-subtitle" role="status" data-testid="manager-seats-contract-warning">{tManagerUi('save_unavailable_host_mutation_contract_not_supplied')}</p>
          </div>
          <button type="button" className="ss-btn-primary ss-btn-start" onClick={openAdd}>
            <Plus size={16} />{tManagerUi('add_seat')}
          </button>
        </div>

        <div className="ss-filter-bar">
          <div className="ss-filter-bar__input-wrap">
            <Search size={14} className="ss-input-icon" />
            <input type="text" aria-label={tManagerUi('search_by_seat_branch_or_student')} placeholder={tManagerUi('search_by_seat_branch_or_student')} className="ss-input" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ss-filter-bar__select-wrap">
            <select aria-label={tManagerUi('filter_by_status')} className="ss-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">{tManagerUi('all_statuses')}</option>
              <option value="free">{tManagerUi('free')}</option>
              <option value="occupied">{tManagerUi('occupied')}</option>
              <option value="expiring">{tManagerUi('expiring_soon')}</option>
              <option value="maintenance">{tManagerUi('maintenance')}</option>
              <option value="unknown">{tManagerUi('unknown_status')}</option>
            </select>
            <ChevronDown size={14} className="ss-select-icon" />
          </div>
        </div>

        {seatMatrixQuery.isPending ? (
          <div className="ss-table-wrapper ss-grid-h-400" aria-busy="true" aria-label={tManagerUi('loading_seat_matrix')} data-testid="manager-seats-loading">
            <div className="min-h-64 animate-pulse rounded-lg bg-skeleton-base" />
          </div>
        ) : seatMatrixQuery.isError ? (
          <div className="ss-empty-state" role="alert" data-testid="manager-seats-error">
            <p className="ss-empty-state__title">{tManagerUi('unable_to_load_the_seat_matrix')}</p>
            <button type="button" className="ss-btn-primary" onClick={() => { void seatMatrixQuery.refetch(); }}>{tManagerUi('retry')}</button>
          </div>
        ) : filtered.length === 0 ? (
          <ManagerSeatsManagementEmptyState className="ss-empty-state">
            <p className="ss-empty-state__icon">🪑</p>
            <p className="ss-empty-state__title">{hasActiveFilters ? tManagerUi('no_seats_match_current_filters') : tManagerUi('no_seats_found')}</p>
            <p className="ss-empty-state__sub">{hasActiveFilters ? tManagerUi('adjust_or_clear_seat_filters') : tManagerUi('add_your_first_seat_to_get_started')}</p>
            {!hasActiveFilters && <button type="button" className="ss-btn-primary" onClick={openAdd}><Plus size={15} />{tManagerUi('add_seat')}</button>}
          </ManagerSeatsManagementEmptyState>
        ) : (
          <div className="ss-table-wrapper ss-grid-h-400">
            <ManagerSeatsManagementNativeTable rows={filtered} columns={colDefs} label={tManagerUi('seats')} getRowKey={(row) => String(row.seatNo)} />
          </div>
        )}
      </div>

      {showModal && (
        <div className="ss-modal-overlay" onClick={() => setShowModal(false)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-seat-edit-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-seat-edit-title" className="ss-modal-title">{editSeat ? tManagerUi('edit_seat') : tManagerUi('add_seat_1717a2')}</h2>
            <div className="ss-form-grid">
              <div className="ss-form-field">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersseatmanagementclient-176">{tManagerUi('seat_number')} <span className="ss-text-danger">*</span></label>
                <input id="rbg4-managerseatsshiftslockersseatmanagementclient-176" className={`ss-input ss-input--no-icon${errors.seatNo ? ' ss-input--error' : ''}`} placeholder={tManagerUi('e_g_a_01')} value={form.seatNo} readOnly={Boolean(editSeat)} onChange={e => setValue('seatNo', e.target.value, { shouldDirty: true, shouldValidate: true })} />
                {errors.seatNo && <p className="ss-error">{errors.seatNo?.message ? tManagerUi(errors.seatNo.message) : null}</p>}
              </div>
              <div className="ss-form-field">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersseatmanagementclient-181">{tManagerUi('branch')} <span className="ss-text-danger">*</span></label>
                {editSeat ? <p className="ss-cell-secondary" aria-label={tManagerUi('branch_64c87b')}>{displayValue(editSeat.branch)}</p> : <>
                  <input id="rbg4-managerseatsshiftslockersseatmanagementclient-181" className={`ss-input ss-input--no-icon${errors.branch ? ' ss-input--error' : ''}`} placeholder={tManagerUi('e_g_north_wing')} value={form.branch} onChange={e => setValue('branch', e.target.value, { shouldDirty: true, shouldValidate: true })} />
                  {errors.branch && <p className="ss-error">{errors.branch?.message ? tManagerUi(errors.branch.message) : null}</p>}
                </>}
              </div>
              <div className="ss-form-field ss-form-field--full">
                <label className="ss-label" htmlFor="rbg4-managerseatsshiftslockersseatmanagementclient-186">{tManagerUi('status')}</label>
                {editSeat ? <p className="ss-cell-secondary" aria-label={tManagerUi('status')}>{tManagerUi(seatStatusTranslationKey(editSeat.status))}</p> : <div className="ss-select-wrap">
                  <select id="rbg4-managerseatsshiftslockersseatmanagementclient-186" aria-label={tManagerUi('status')} className="ss-select" value={form.status} onChange={e => setValue('status', e.target.value as ManagerSeatsManagementSeatManagementClientSeatStatus, { shouldDirty: true, shouldValidate: true })}>
                    <option value="Working">{tManagerUi('working')}</option>
                    <option value="Maintenance">{tManagerUi('maintenance')}</option>
                    <option value="Broken">{tManagerUi('broken')}</option>
                  </select>
                  <ChevronDown size={14} className="ss-select-icon" />
                </div>}
              </div>
            </div>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setShowModal(false)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-primary cursor-not-allowed" disabled title={tManagerUi('save_unavailable_host_mutation_contract_not_supplied')}>{tManagerUi('save_unavailable')}</button>
            </div>
          </div>
        </div>
      )}

      {confirmBroken && (
        <div className="ss-modal-overlay" onClick={() => setConfirmBroken(null)}>
          <div ref={dialogRef} tabIndex={-1} className="ss-modal" role="dialog" aria-modal="true" aria-labelledby="ss-seat-broken-title" onClick={e => e.stopPropagation()}>
            <h2 id="ss-seat-broken-title" className="ss-modal-title">{tManagerUi('mark_seat_as_broken')}</h2>
            <p className="ss-modal-desc">{tManagerUi('mark_seat')} <strong>{confirmBroken.seatNo}</strong> {tManagerUi('as_broken_it_will_be_unavailable_for_assignment')}</p>
            <div className="ss-modal-footer">
              <button type="button" className="ss-btn-ghost" onClick={() => setConfirmBroken(null)}>{tManagerUi('cancel')}</button>
              <button type="button" className="ss-btn-danger cursor-not-allowed" disabled title={tManagerUi('status_update_unavailable_host_mutation_contract_not_sup_953486')}>{tManagerUi('confirm_unavailable')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
