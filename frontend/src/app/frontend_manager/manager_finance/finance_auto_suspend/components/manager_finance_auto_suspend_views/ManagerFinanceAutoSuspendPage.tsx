'use client';

import ManagerFinanceAutoSuspendKioskModal from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendKioskModal';
import ManagerFinanceAutoSuspendKpiGrid from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendKpiGrid';
import ManagerFinanceAutoSuspendTable, {
  type SuspendSortField,
} from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendTable';
import {
  ManagerFinanceAutoSuspendFilterBar,
  ManagerFinanceAutoSuspendHeader,
} from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendToolbar';
import ManagerFinanceAutoSuspendWhatsAppModal from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendWhatsAppModal';
import {
  MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG,
  MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS,
} from '@/app/frontend_manager/manager_finance/finance_auto_suspend/hooks/ManagerFinanceAutoSuspendDemoRepository';
import type { ManagerFinanceAutoSuspendRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendComponentTypes';
import type {
  ManagerFinanceAutoSuspendConfig as Config,
  ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent,
} from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
import {
  dispatchBulkSuspendedWhatsApp,
  exportAutoSuspendCsv,
} from '@/app/frontend_manager/manager_finance/finance_auto_suspend/utils/ManagerFinanceAutoSuspendCsvAndWhatsapp';
import { Ban, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function ManagerFinanceAutoSuspendPage(_routeQuery: ManagerFinanceAutoSuspendRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_auto_suspend.ui');
  const config: Config = MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG;
  const [suspended, setSuspended] = useState<SuspendedStudent[]>([...MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS]);
  const [selectedWhatsAppStudent, setSelectedWhatsAppStudent] = useState<SuspendedStudent | null>(null);
  const [remindedStudents, setRemindedStudents] = useState<Record<number, string>>({});
  const [isKioskModalOpen, setIsKioskModalOpen] = useState(false);
  const [kioskInitialStudent, setKioskInitialStudent] = useState<SuspendedStudent | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [overdueFilter, setOverdueFilter] = useState('all');
  const [sortField, setSortField] = useState<SuspendSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleRestoreStudent = (student: SuspendedStudent) => {
    setSuspended((prev) => prev.filter((item) => item.id !== student.id));
    toast.success(`Student ${student.studentName} (${student.smartId}) restored and dues cleared!`, {
      id: 'autosuspend-restore-success',
    });
  };

  const shiftLabels: Record<string, string> = {
    Morning: tManagerUi('shift_morning'),
    Afternoon: tManagerUi('shift_afternoon'),
    Evening: tManagerUi('shift_evening'),
    Night: tManagerUi('shift_night'),
    'Full Day': tManagerUi('shift_full_day'),
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minDays = overdueFilter === 'all' ? 0 : Number(overdueFilter);
    return suspended.filter((s) => {
      const matchShift = shiftFilter === 'all' || s.shift.toLowerCase() === shiftFilter.toLowerCase();
      const matchOverdue = s.daysOverdue >= minDays;
      const matchSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.smartId.toLowerCase().includes(q) ||
        s.seat.toLowerCase().includes(q) ||
        s.shift.toLowerCase().includes(q);
      return matchShift && matchOverdue && matchSearch;
    });
  }, [suspended, searchQuery, shiftFilter, overdueFilter]);

  const sortedRows = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp =
        typeof aVal === 'number' && typeof bVal === 'number'
          ? aVal - bVal
          : String(aVal ?? '').localeCompare(String(bVal ?? ''), undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalRows = sortedRows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = sortedRows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);

  return (
    <div className="space-y-6" data-route-view={_routeQuery.view} data-route-id={_routeQuery.id}>
      <p className="fin-input-hint fin-text-warning hidden" role="status">
        {tManagerUi('configuration_and_suspended_student_records_are_sample_d_1f1c42')}
      </p>

      <ManagerFinanceAutoSuspendHeader
        title={tManagerUi('auto_suspend_policy')}
        subtitle={tManagerUi('manage_automatic_suspension_and_student_restoration')}
        onOpenKiosk={() => {
          setKioskInitialStudent(suspended[0] || null);
          setIsKioskModalOpen(true);
        }}
        onExportCsv={() => {
          exportAutoSuspendCsv(sortedRows);
          toast.success('Suspended students list exported to CSV successfully', { id: 'autosuspend-export-csv-success' });
        }}
        onPrint={() => {
          if (typeof window !== 'undefined') window.print();
          toast.success('Suspension policy report sent to printer / PDF', { id: 'autosuspend-print-success' });
        }}
      />

      <ManagerFinanceAutoSuspendKpiGrid
        config={config}
        labels={{
          daysBeforeSuspend: tManagerUi('days_before_suspend'),
          currentlySuspended: tManagerUi('currently_suspended'),
          autoRestoredMonth: tManagerUi('auto_restored_month'),
          manualRestores: tManagerUi('manual_restores'),
        }}
      />

      <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-primary">
            <ShieldAlert size={18} className="text-primary" />
            <span>{tManagerUi('policy_configuration')}</span>
          </div>
          <button
            type="button"
            className="fin-badge fin-badge--neutral cursor-not-allowed opacity-60"
            disabled
            title={tManagerUi('save_unavailable_verified_api_contract_not_supplied')}
          >
            {tManagerUi('edit')}
          </button>
        </div>
        <p className="text-sm text-secondary leading-relaxed">
          {tManagerUi('students_are_automatically_suspended_after')}{' '}
          <strong className="text-primary font-bold">{config?.daysBeforeSuspend}</strong>{' '}
          {tManagerUi('days_of_non_payment_past_due_date')}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <Ban size={18} className="text-rose-600" />
              <h2 className="text-xl font-bold text-primary tracking-tight">{tManagerUi('suspended_students')}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {filtered.length} Active Suspensions
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Active student accounts currently blocked due to overdue fee payment.
            </p>
          </div>
        </div>

        <ManagerFinanceAutoSuspendFilterBar
          searchQuery={searchQuery}
          shiftFilter={shiftFilter}
          overdueFilter={overdueFilter}
          hasActiveFilters={Boolean(searchQuery.trim() !== '' || shiftFilter !== 'all' || overdueFilter !== 'all')}
          filteredCount={filtered.length}
          totalCount={suspended.length}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setPage(0);
          }}
          onShiftChange={(val) => {
            setShiftFilter(val);
            setPage(0);
          }}
          onOverdueChange={(val) => {
            setOverdueFilter(val);
            setPage(0);
          }}
          onResetFilters={() => {
            setSearchQuery('');
            setShiftFilter('all');
            setOverdueFilter('all');
            setPage(0);
          }}
          onBulkWhatsApp={() => {
            if (filtered.length === 0) return;
            dispatchBulkSuspendedWhatsApp(filtered);
            toast.success(`Dispatched WhatsApp suspension notices to ${filtered.length} suspended students`, {
              id: 'autosuspend-bulk-wa-success',
            });
          }}
        />

        <div className="overflow-x-auto scrollbar-thin">
          <ManagerFinanceAutoSuspendTable
            filtered={filtered}
            paginated={paginated}
            searchQuery={searchQuery}
            totalRows={totalRows}
            startItem={totalRows === 0 ? 0 : effectivePage * pageSize + 1}
            endItem={Math.min((effectivePage + 1) * pageSize, totalRows)}
            pageSize={pageSize}
            effectivePage={effectivePage}
            pageCount={pageCount}
            sortField={sortField}
            sortDirection={sortDirection}
            onToggleSort={(field) => {
              setPage(0);
              setSortDirection((prev) => (sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc'));
              setSortField(field);
            }}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(0);
            }}
            onPrevPage={() => setPage((c) => Math.max(0, c - 1))}
            onNextPage={() => setPage((c) => Math.min(pageCount - 1, c + 1))}
            onSendReminder={setSelectedWhatsAppStudent}
            onRestoreStudent={handleRestoreStudent}
            onTestKioskScan={(s) => {
              setKioskInitialStudent(s);
              setIsKioskModalOpen(true);
            }}
            remindedStudents={remindedStudents}
            shiftLabels={shiftLabels}
            labels={{
              student: tManagerUi('student'),
              seat: tManagerUi('seat'),
              shift: tManagerUi('shift'),
              lastPaymentDate: tManagerUi('last_payment_date'),
              daysOverdue: tManagerUi('days_overdue'),
              suspendedSince: tManagerUi('suspended_since'),
              actions: tManagerUi('actions'),
              noStudents: tManagerUi('no_students_currently_suspended'),
              sendReminder: tManagerUi('send_reminder'),
              daysSuffix: tManagerUi('d'),
            }}
          />
        </div>
      </div>

      <ManagerFinanceAutoSuspendWhatsAppModal
        isOpen={Boolean(selectedWhatsAppStudent)}
        student={selectedWhatsAppStudent}
        onClose={() => setSelectedWhatsAppStudent(null)}
        onSentSuccess={(id) =>
          setRemindedStudents((prev) => ({
            ...prev,
            [id]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }))
        }
      />

      <ManagerFinanceAutoSuspendKioskModal
        isOpen={isKioskModalOpen}
        onClose={() => setIsKioskModalOpen(false)}
        suspendedStudents={suspended}
        initialStudent={kioskInitialStudent}
      />
    </div>
  );
}
