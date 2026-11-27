'use client';

import type {
  ManagerSeatsHistoryNativeColumn as ColDef,
  ManagerSeatsHistoryNativeCellParams as ICellRendererParams,
} from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/components/manager_seats_history_table_parts/ManagerSeatsHistoryNativeTable';
import { MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/constants/ManagerSeatsHistoryConstants';
import type { ManagerSeatsHistoryRow } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryTypes';
import { format, isValid, parseISO } from 'date-fns';
import { enUS, hi } from 'date-fns/locale';

/** Builds native table column definitions for seat occupancy history. */
export function buildManagerSeatsHistoryColumns(
  locale: string,
  tManagerUi: (key: string) => string
): ColDef<ManagerSeatsHistoryRow>[] {
  const formatHistoryDate = (value: string) => {
    const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
    if (!match) return value;
    const date = parseISO(match[1]);
    if (!isValid(date)) return value;
    return format(date, 'dd MMM yyyy', { locale: locale === 'hi' ? hi : enUS });
  };

  const formatShift = (value: string) =>
    ({
      Morning: tManagerUi('morning'),
      Afternoon: tManagerUi('afternoon'),
      Evening: tManagerUi('evening'),
      Night: tManagerUi('night'),
      'Full Day': tManagerUi('full_day'),
    }[value] ?? value);

  const formatReason = (value: string) => {
    if (value === 'Admission') return tManagerUi('history_reason_admission');
    if (value === 'Shift Change') return tManagerUi('history_reason_shift_change');
    if (value === 'Seat Change') return tManagerUi('history_reason_seat_change');
    return value;
  };

  return [
    {
      field: 'seatNo',
      headerName: tManagerUi('seat'),
      flex: 0.9,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
        <span className="font-mono font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded text-xs">
          {String(params.value ?? '')}
        </span>
      ),
    },
    {
      field: 'studentName',
      headerName: tManagerUi('student_71ad6e'),
      flex: 1.6,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
        <span className="font-semibold text-primary block leading-tight">{String(params.value ?? '')}</span>
      ),
    },
    {
      field: 'smartId',
      headerName: tManagerUi('smart_id'),
      flex: 1.1,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
        <span className="font-mono text-xs text-secondary">{String(params.value ?? '—')}</span>
      ),
    },
    {
      field: 'shift',
      headerName: tManagerUi('shift_149b8d'),
      flex: 1.1,
      valueFormatter: (params: { value?: unknown }) => formatShift(String(params.value ?? '')),
    },
    {
      field: 'occupiedFrom',
      headerName: tManagerUi('from_8e7f00'),
      flex: 1.3,
      valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')),
    },
    {
      field: 'occupiedTill',
      headerName: tManagerUi('till'),
      flex: 1.3,
      valueFormatter: (params: { value?: unknown }) => formatHistoryDate(String(params.value ?? '')),
    },
    {
      field: 'duration',
      headerName: tManagerUi('duration'),
      flex: 1,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => (
        <span className="text-secondary font-mono text-xs">{String(params.value ?? '—')}</span>
      ),
    },
    {
      field: 'reason',
      headerName: tManagerUi('reason'),
      flex: 1.2,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => {
        const reason = String(params.value ?? '');
        return (
          <span className={MANAGER_SEATS_HISTORY_HISTORY_REASON_CLASSES[reason] ?? 'ss-badge ss-badge--inactive'}>
            {formatReason(reason)}
          </span>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      cellRenderer: (params: ICellRendererParams<ManagerSeatsHistoryRow>) => {
        const status = String(params.value ?? 'Active');
        const isActive = status.toLowerCase() === 'active';
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isActive
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-surface text-secondary border border-border'
            }`}
          >
            {status}
          </span>
        );
      },
    },
  ];
}
