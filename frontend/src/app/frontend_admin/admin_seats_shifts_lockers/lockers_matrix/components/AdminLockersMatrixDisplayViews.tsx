'use client';

import { ADMIN_LOCKER_MATRIX_STATUS_CLASS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/components/AdminLockersMatrixDetailModal';
import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { KeyRound, Unlock, User, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminLockersMatrixDisplayViewsProps {
  viewMode: 'grid' | 'table';
  visibleLockers: readonly AdminLockersLockerMatrixViewModel[];
  selectedBranchName?: string;
  onSelectLocker: (locker: AdminLockersLockerMatrixViewModel) => void;
}

export function AdminLockersMatrixDisplayViews({
  viewMode,
  visibleLockers,
  selectedBranchName,
  onSelectLocker,
}: AdminLockersMatrixDisplayViewsProps) {
  const t = useTranslations('ADMIN_LOCKERS');

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visibleLockers.map((locker) => {
          const isFree = locker.status === 'free';
          const isOccupied = locker.status === 'occupied';
          const isMaintenance = locker.status === 'maintenance';
          const cardClasses = isFree
            ? 'border-success bg-success-bg text-success-text hover:border-border-focus motion-safe:hover:scale-[1.02]'
            : isOccupied
              ? 'border-danger bg-danger-bg text-danger-text hover:border-border-focus motion-safe:hover:scale-[1.02]'
              : 'border-warning bg-warning-bg text-warning-text hover:border-border-focus motion-safe:hover:scale-[1.02]';

          return (
            <button
              key={locker.uuid ?? locker.id}
              type="button"
              data-testid={`admin_lockers-locker-${locker.id}`}
              className={`group relative flex flex-col justify-between rounded-xl border p-3.5 text-left motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-card ${cardClasses}`}
              onClick={() => onSelectLocker(locker)}
              title={`Locker #${locker.id} — Click to inspect or manage allocation`}
              aria-label={`${t('locker')} ${locker.id}, ${t(
                isFree ? 'statusFree' : isOccupied ? 'statusOccupied' : isMaintenance ? 'statusMaintenance' : 'statusUnknown',
              )}`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <div className="flex items-center gap-1.5 font-bold font-mono text-sm text-text-primary">
                  <KeyRound size={13} className="shrink-0 opacity-80" aria-hidden="true" />
                  <span>#{locker.id}</span>
                </div>
                <span className={`h-2 w-2 rounded-full ${isFree ? 'bg-success-text' : isOccupied ? 'bg-danger-text' : 'bg-warning-text'}`} />
              </div>

              <div className="mt-3 min-w-0">
                {isOccupied ? (
                  <div>
                    <p className="text-xs font-bold text-text-primary truncate flex items-center gap-1">
                      <User size={11} className="text-primary shrink-0" aria-hidden="true" />
                      <span className="truncate">{locker.student}</span>
                    </p>
                    <p className="text-[10px] text-text-secondary font-mono mt-0.5 truncate">{locker.smartId ?? 'SL-DT'}</p>
                  </div>
                ) : isFree ? (
                  <div>
                    <p className="text-xs font-semibold text-success-text flex items-center gap-1">
                      <Unlock size={11} aria-hidden="true" />
                      <span>Vacant</span>
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Click to allocate</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-warning-text flex items-center gap-1">
                      <Wrench size={11} aria-hidden="true" />
                      <span>Maintenance</span>
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Service required</p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[10px] text-text-secondary font-mono">
                <span className="truncate">{locker.branchName?.split(' ')[0] ?? 'Branch'}</span>
                <span className="font-bold text-text-primary">
                  {isOccupied ? '🔒 In Use' : isFree ? '🔓 Ready' : '🛠️ Fix'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-x-auto bg-surface-highlight">
      <table className="w-full text-xs text-left">
        <thead className="bg-card border-b border-border font-bold text-text-secondary uppercase tracking-wider">
          <tr>
            <th className="p-3">Locker No</th>
            <th className="p-3">Branch</th>
            <th className="p-3">Status</th>
            <th className="p-3">Assigned Student</th>
            <th className="p-3">Contact Phone</th>
            <th className="p-3">Shift</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-text-primary">
          {visibleLockers.map((locker) => (
            <tr key={locker.uuid ?? locker.id} className="hover:bg-surface-hover motion-safe:transition-colors">
              <td className="p-3 font-mono font-bold text-text-primary flex items-center gap-1.5">
                <KeyRound size={13} className="text-primary" aria-hidden="true" /> #{locker.id}
              </td>
              <td className="p-3 text-text-secondary font-medium">{locker.branchName ?? selectedBranchName ?? 'Downtown Central'}</td>
              <td className="p-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${ADMIN_LOCKER_MATRIX_STATUS_CLASS[locker.status] ?? ''}`}>
                  {locker.status === 'free' ? 'Available Free' : locker.status === 'occupied' ? 'Occupied' : locker.status === 'maintenance' ? 'Maintenance' : 'Unknown'}
                </span>
              </td>
              <td className="p-3 font-semibold text-text-primary">
                {locker.student ?? <span className="text-text-secondary font-normal italic">— (Vacant)</span>}
              </td>
              <td className="p-3 text-text-secondary font-mono">{locker.phone ?? '—'}</td>
              <td className="p-3 text-text-secondary">{locker.shift ?? '—'}</td>
              <td className="p-3 text-right">
                <button
                  type="button"
                  onClick={() => onSelectLocker(locker)}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-border-focus bg-primary-subtle text-xs font-semibold text-primary hover:opacity-90 motion-safe:transition-opacity cursor-pointer"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
