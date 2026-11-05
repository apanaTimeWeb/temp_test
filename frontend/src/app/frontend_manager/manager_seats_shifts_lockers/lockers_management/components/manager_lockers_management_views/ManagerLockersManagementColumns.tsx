'use client';

import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { UserPlus, Unlock, Wrench } from 'lucide-react';
import type {
  ManagerLockersManagementNativeColumn as ColDef,
  ManagerLockersManagementNativeCellParams as ICellRendererParams,
} from '../manager_lockers_management_table_parts/ManagerLockersManagementNativeTable';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';
import type { LockerStatus } from '../../types/ManagerLockersManagementComponentTypes';

const STATUS_CLASS: Record<LockerStatus, string> = {
  Free: 'ss-badge ss-badge--success',
  Occupied: 'ss-badge ss-badge--danger',
  Maintenance: 'ss-badge ss-badge--warning',
};

export function LockerIdCell(props: { value?: any }) {
  return <span className="ss-table__seat-no">{String(props.value ?? '')}</span>;
}

export function LockerStatusCell(props: { value?: any }) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  const status = props.value as LockerStatus;
  const label =
    status === 'Free'
      ? tManagerUi('free')
      : status === 'Occupied'
      ? tManagerUi('occupied')
      : status === 'Maintenance'
      ? tManagerUi('maintenance')
      : String(props.value ?? '');
  return (
    <span className={STATUS_CLASS[status] ?? 'ss-badge ss-badge--inactive'}>
      <span className="ss-badge__dot" />
      {label}
    </span>
  );
}

export function AssignedToCell(props: { data?: any }) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  if (!props.data || props.data.assignedTo === '—') {
    return <span className="ss-table__cell-muted">{tManagerUi('unassigned')}</span>;
  }
  return (
    <div className="ss-cell-stack">
      <p className="ss-cell-name">{props.data.assignedTo}</p>
      <p className="ss-table__cell-sub">{props.data.studentId}</p>
    </div>
  );
}

export function AssignedSinceCell(props: { value?: any }) {
  const locale = useLocale();
  const raw = String(props.value ?? '');
  if (raw === '—' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return <span className="ss-table__cell-muted">{raw}</span>;
  }
  const date = parseISO(raw);
  if (!isValid(date)) return <span className="ss-table__cell-muted">{raw}</span>;
  return <span>{format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enUS })}</span>;
}

interface GetLockerColumnsOptions {
  tManagerUi: (key: string, values?: any) => string;
  onShowAssign: (locker: Locker) => void;
  onSetFreeTarget: (locker: Locker) => void;
}

export function getLockerColumns({
  tManagerUi,
  onShowAssign,
  onSetFreeTarget,
}: GetLockerColumnsOptions): ColDef<Locker>[] {
  return [
    { field: 'lockerId', headerName: tManagerUi('locker'), flex: 1, cellRenderer: LockerIdCell },
    { field: 'status', headerName: tManagerUi('status_716883'), flex: 1.2, cellRenderer: LockerStatusCell },
    { field: 'assignedTo', headerName: tManagerUi('assigned_to'), flex: 2, cellRenderer: AssignedToCell },
    {
      field: 'assignedSince',
      headerName: tManagerUi('since'),
      flex: 1.3,
      cellClass: 'ss-cell-secondary',
      cellRenderer: AssignedSinceCell,
    },
    {
      headerName: tManagerUi('actions'),
      flex: 1.2,
      sortable: false,
      cellRenderer: (props: ICellRendererParams) => {
        const data = props.data as Locker;
        return (
          <div className="ss-cell-actions">
            {data.status === 'Free' && (
              <button
                type="button"
                className="ss-btn-icon"
                aria-label={tManagerUi('assign_student')}
                title={tManagerUi('assign_student')}
                onClick={() => onShowAssign(data)}
              >
                <UserPlus size={13} />
              </button>
            )}
            {data.status === 'Occupied' && (
              <button
                type="button"
                className="ss-btn-icon"
                aria-label={tManagerUi('free_locker')}
                title={tManagerUi('free_locker')}
                onClick={() => onSetFreeTarget(data)}
              >
                <Unlock size={13} />
              </button>
            )}
            {data.status !== 'Maintenance' && (
              <button
                type="button"
                className="ss-btn-icon cursor-not-allowed"
                aria-label={tManagerUi('maintenance_update_unavailable_host_mutation_contract_no_d2475a')}
                title={tManagerUi('maintenance_update_unavailable_host_mutation_contract_no_d2475a')}
                disabled
              >
                <Wrench size={13} />
              </button>
            )}
          </div>
        );
      },
    },
  ];
}

