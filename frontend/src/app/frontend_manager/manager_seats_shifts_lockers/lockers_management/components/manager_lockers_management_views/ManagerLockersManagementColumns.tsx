'use client';

import { format,isValid,parseISO } from 'date-fns';
import { enUS,hi } from 'date-fns/locale';
import { Key,KeyRound,Unlock,UserPlus } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';
import type { LockerStatus } from '../../types/ManagerLockersManagementComponentTypes';
import type {
ManagerLockersManagementNativeColumn as ColDef,
ManagerLockersManagementNativeCellParams as ICellRendererParams,
} from '../manager_lockers_management_table_parts/ManagerLockersManagementNativeTable';

const STATUS_CLASS: Record<LockerStatus, string> = {
  Free: 'ss-badge ss-badge--success',
  Occupied: 'ss-badge ss-badge--danger',
  Maintenance: 'ss-badge ss-badge--warning',
  Expired: 'ss-badge bg-amber-500/15 text-amber-400 border border-amber-500/30',
};

export function LockerIdCell(props: { value?: any }) {
  return (
    <span className="font-mono font-bold text-xs text-primary bg-surface px-2 py-0.5 rounded-md border border-border">
      {String(props.value ?? '')}
    </span>
  );
}

export function LockerStatusCell(props: { value?: any; data?: any }) {
  const tManagerUi = useTranslations('manager.manager_lockers.ui');
  const status = props.value as LockerStatus;
  const locker = props.data as Locker;
  const isOverdue =
    (status === 'Occupied' || status === 'Expired') &&
    locker?.expiryDate &&
    new Date(locker.expiryDate) < new Date();

  const label = isOverdue
    ? 'Expired / Overdue'
    : status === 'Free'
    ? tManagerUi('free')
    : status === 'Occupied'
    ? tManagerUi('occupied')
    : status === 'Maintenance'
    ? tManagerUi('maintenance')
    : String(props.value ?? '');

  return (
    <span
      className={
        isOverdue
          ? 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30'
          : STATUS_CLASS[status] ?? 'ss-badge ss-badge--inactive'
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isOverdue ? 'bg-amber-400 animate-pulse' : 'bg-current'}`} />
      {label}
    </span>
  );
}

export function KeyNumberCell(props: { data?: any }) {
  const data = props.data as Locker;
  if (!data) return null;
  const keyTag = data.keyNumber || `KEY-${data.lockerId}`;
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono">
      <span className="font-bold text-primary flex items-center gap-1">
        <Key size={12} className="text-secondary" />
        {keyTag}
      </span>
      {data.lostKeyReported && (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-500 border border-rose-500/30">
          Lost (-₹{data.lostKeyFine || 150})
        </span>
      )}
    </div>
  );
}

export function ExpiryCell(props: { data?: any }) {
  const data = props.data as Locker;
  if (!data || !data.expiryDate || data.expiryDate === '—') {
    return <span className="text-secondary text-xs">—</span>;
  }
  const isPast = new Date(data.expiryDate) < new Date();
  return (
    <div className="text-xs space-y-0.5">
      <span className={isPast && data.status !== 'Free' ? 'font-bold text-amber-400' : 'text-primary'}>
        {data.expiryDate}
      </span>
      {isPast && data.status !== 'Free' && (
        <span className="block text-[10px] text-amber-500 font-semibold">Plan Ended</span>
      )}
    </div>
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
  onSelectLocker?: (locker: Locker) => void;
  onReportLostKey?: (locker: Locker) => void;
}

export function getLockerColumns({
  tManagerUi,
  onShowAssign,
  onSetFreeTarget,
  onSelectLocker,
  onReportLostKey,
}: GetLockerColumnsOptions): ColDef<Locker>[] {
  return [
    { field: 'lockerId', headerName: tManagerUi('locker'), flex: 0.9, cellRenderer: LockerIdCell },
    { field: 'keyNumber', headerName: 'Key Tag', flex: 1.1, cellRenderer: KeyNumberCell },
    { field: 'status', headerName: tManagerUi('status_716883'), flex: 1.3, cellRenderer: LockerStatusCell },
    { field: 'assignedTo', headerName: tManagerUi('assigned_to'), flex: 1.8, cellRenderer: AssignedToCell },
    {
      field: 'expiryDate',
      headerName: 'Plan Expiry',
      flex: 1.2,
      cellRenderer: ExpiryCell,
    },
    {
      field: 'assignedSince',
      headerName: tManagerUi('since'),
      flex: 1.1,
      cellClass: 'ss-cell-secondary',
      cellRenderer: AssignedSinceCell,
    },
    {
      headerName: tManagerUi('actions'),
      flex: 2,
      sortable: false,
      cellRenderer: (props: ICellRendererParams) => {
        const data = props.data as Locker;
        const isOccupiedOrExpired = data.status === 'Occupied' || data.status === 'Expired';
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            {data.status === 'Free' && (
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
                aria-label={tManagerUi('assign_student')}
                title="Allot Locker to Student"
                onClick={() => onShowAssign(data)}
              >
                <UserPlus size={13} />
                <span>Allot</span>
              </button>
            )}
            {isOccupiedOrExpired && (
              <div className="flex items-center gap-1.5">
                {onSelectLocker && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-border text-primary hover:bg-surface-hover transition-colors cursor-pointer"
                    title="View Student Details"
                    onClick={() => onSelectLocker(data)}
                  >
                    <span>Details</span>
                  </button>
                )}
                {onReportLostKey && (
                  <button
                    type="button"
                    data-testid="manager-locker-table-lost-key-btn"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Report Lost Key and Impose Fine"
                    onClick={() => onReportLostKey(data)}
                  >
                    <KeyRound size={12} />
                    <span>Fine</span>
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger-subtle text-danger hover:bg-danger hover:text-white transition-colors cursor-pointer"
                  aria-label={tManagerUi('free_locker')}
                  title="Vacate and Refund Locker"
                  onClick={() => onSetFreeTarget(data)}
                >
                  <Unlock size={13} />
                  <span>Vacate</span>
                </button>
              </div>
            )}
            {data.status === 'Maintenance' && (
              <span className="text-[11px] font-medium text-warning px-2 py-0.5 rounded-full bg-warning-subtle">
                In Service
              </span>
            )}
          </div>
        );
      },
    },
  ];
}

