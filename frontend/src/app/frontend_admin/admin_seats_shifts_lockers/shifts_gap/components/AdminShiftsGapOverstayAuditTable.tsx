'use client';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  DollarSign,
  TrendingDown,
  Building2,
} from 'lucide-react';
import type { AdminShiftOverstayIncident } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/types/AdminShiftsGapTypes';
import { ADMIN_SHIFTS_DEMO_OVERSTAY_INCIDENTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_gap/mocks/AdminShiftsGapShiftGapFixtures';

export function AdminShiftsGapOverstayAuditTable() {
  const t = useTranslations('ADMIN_SHIFTS');
  const [incidents, setIncidents] = useState<AdminShiftOverstayIncident[]>([
    ...ADMIN_SHIFTS_DEMO_OVERSTAY_INCIDENTS,
  ]);
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const branches = useMemo(() => {
    return Array.from(new Set(ADMIN_SHIFTS_DEMO_OVERSTAY_INCIDENTS.map((i) => i.branchName)));
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      const matchBranch = branchFilter === 'ALL' || i.branchName === branchFilter;
      const matchStatus = statusFilter === 'ALL' || i.status === statusFilter;
      return matchBranch && matchStatus;
    });
  }, [incidents, branchFilter, statusFilter]);

  const totalFinesRecovered = useMemo(() => {
    return incidents
      .filter((i) => i.status === 'RECOVERED')
      .reduce((sum, i) => sum + i.fineAmount, 0);
  }, [incidents]);

  const handleVerify = (id: string, studentName: string) => {
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'RECOVERED' as const } : i))
    );
    toast.success(t('incidentVerified'), {
      description: `${studentName} overstay clearance approved.`,
    });
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5" aria-labelledby="overstay-audit-heading">
      {/* ── Section Header ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-warning-text" />
            <h2 id="overstay-audit-heading" className="text-lg font-bold text-text-primary">
              {t('overstayAuditTitle')}
            </h2>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            {t('overstayAuditSubtitle')}
          </p>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-highlight p-3">
          <span className="text-xs text-text-secondary">{t('kpiTotalOverstays')}</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">{incidents.length}</p>
          <span className="text-xs text-text-secondary">Across 3 active branches</span>
        </div>
        <div className="rounded-lg border border-border bg-surface-highlight p-3">
          <span className="text-xs text-text-secondary">{t('kpiRevenueRecovered')}</span>
          <p className="mt-1 text-2xl font-bold text-success-text">₹{totalFinesRecovered}</p>
          <span className="text-xs text-text-secondary">Recovered penalty dues</span>
        </div>
        <div className="rounded-lg border border-border bg-surface-highlight p-3">
          <span className="text-xs text-text-secondary">{t('kpiAvgOverstayMins')}</span>
          <p className="mt-1 text-2xl font-bold text-text-primary">32m</p>
          <span className="text-xs text-text-secondary">Per detected incident</span>
        </div>
        <div className="rounded-lg border border-border bg-surface-highlight p-3">
          <span className="text-xs text-text-secondary">{t('kpiGhostRate')}</span>
          <p className="mt-1 text-2xl font-bold text-warning-text">4.8%</p>
          <span className="text-xs text-text-secondary">Shift transition leak</span>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-text-secondary" />
          <select
            aria-label={t('tableBranchSeat')}
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="min-h-10 rounded-md border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">{t('filterAllBranches')}</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-secondary" />
          <select
            aria-label={t('tableStatus')}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-h-10 rounded-md border border-border bg-input px-3 py-1.5 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="ALL">All Audit Statuses</option>
            <option value="RECOVERED">{t('statusRecovered')}</option>
            <option value="PENDING_CLEARANCE">{t('statusPendingClearance')}</option>
            <option value="WAIVED">{t('statusWaived')}</option>
          </select>
        </div>
      </div>

      {/* ── Incidents Table ── */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface-highlight text-text-secondary font-semibold uppercase">
              <th scope="col" className="p-3">{t('tableBranchSeat')}</th>
              <th scope="col" className="p-3">{t('tableStudent')}</th>
              <th scope="col" className="p-3">{t('tableShiftScheduled')}</th>
              <th scope="col" className="p-3">{t('tableOverstayTime')}</th>
              <th scope="col" className="p-3">{t('tableActionFine')}</th>
              <th scope="col" className="p-3">{t('tableStatus')}</th>
              <th scope="col" className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-text-secondary">
                  No overstay incidents match the selected filter.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="p-3">
                    <span className="font-semibold text-text-primary">{inc.branchName}</span>
                    <span className="block text-text-secondary font-medium">{inc.seatNumber}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-text-primary">{inc.studentName}</span>
                    <span className="block text-text-secondary">{inc.smartId}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-text-primary">{inc.bookedShift}</span>
                    <span className="block text-text-secondary">Scheduled End: {inc.scheduledEndTime}</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded bg-danger-subtle px-2 py-0.5 font-bold text-danger-text">
                      <Clock className="h-3 w-3" />
                      +{inc.overstayMinutes}m ({inc.actualDepartureTime})
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-text-primary">
                      {inc.managerAction === 'FINED'
                        ? t('actionFined')
                        : inc.managerAction === 'SHIFT_UPGRADED'
                        ? t('actionUpgraded')
                        : t('actionWarned')}
                    </span>
                    <span className="block text-text-secondary font-medium">
                      {inc.fineAmount > 0 ? `₹${inc.fineAmount}` : 'No fine (Waived)'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                        inc.status === 'RECOVERED'
                          ? 'bg-success-bg text-success-text'
                          : inc.status === 'PENDING_CLEARANCE'
                          ? 'bg-warning-bg text-warning-text'
                          : 'bg-muted text-text-secondary'
                      }`}
                    >
                      {inc.status === 'RECOVERED' && <CheckCircle2 className="h-3 w-3" />}
                      {inc.status === 'PENDING_CLEARANCE' && <AlertTriangle className="h-3 w-3" />}
                      {inc.status === 'RECOVERED'
                        ? t('statusRecovered')
                        : inc.status === 'PENDING_CLEARANCE'
                        ? t('statusPendingClearance')
                        : t('statusWaived')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {inc.status === 'PENDING_CLEARANCE' ? (
                      <button
                        type="button"
                        onClick={() => handleVerify(inc.id, inc.studentName)}
                        className="inline-flex min-h-8 items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-on-primary hover:bg-primary-hover"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t('verifyIncident')}
                      </button>
                    ) : (
                      <span className="text-xs text-text-secondary italic">Audited</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminShiftsGapOverstayAuditTable;

