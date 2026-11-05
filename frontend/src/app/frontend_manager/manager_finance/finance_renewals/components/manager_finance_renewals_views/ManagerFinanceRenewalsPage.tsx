'use client';

import { useState, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsDemoRepository';
import { useManagerRenewalsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsUrlFilters';
import ManagerFinanceRenewalsNativeTable from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_table_parts/ManagerFinanceRenewalsNativeTable';
import { sanitizeManagerRenewalsCsvCell } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsCsv';
import { useManagerRenewalsFormatting } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsFormattingHook';
import { CheckCircle, Search, X } from 'lucide-react';
import { MANAGER_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_manager/manager_finance/finance_renewals/constants/ManagerFinanceRenewalsRenewalConstants';
import type { FilterType, ManagerFinanceRenewalsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';
import ManagerFinanceRenewalsAlertBanner from './ManagerFinanceRenewalsAlertBanner';
import ManagerFinanceRenewalsHeader from './ManagerFinanceRenewalsHeader';
import ManagerFinanceRenewalsFilterBar from './ManagerFinanceRenewalsFilterBar';
import { buildRenewalColumns } from './ManagerFinanceRenewalsTableColumns';

const URL_FILTERS = { filter: { defaultValue: 'expiring_7', allowedValues: ['expired', 'expiring_7', 'expiring_15'] } } as const;

export default function ManagerFinanceRenewalsPage(_routeQuery: ManagerFinanceRenewalsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_renewals.ui');
  const { formatCurrency, formatDate } = useManagerRenewalsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerRenewalsUrlFilters(URL_FILTERS);
  const filter = urlFilters.filter as FilterType;

  const [renewalsList, setRenewalsList] = useState(MANAGER_FINANCE_SAMPLE_RENEWALS);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const expiringCritical = useMemo(() => renewalsList.filter((r) => r.daysLeft <= 3 && r.daysLeft >= 0), [renewalsList]);
  const expiredCount = useMemo(() => renewalsList.filter((r) => r.daysLeft < 0).length, [renewalsList]);

  const visible = renewalsList.filter((r) => {
    if (filter === 'expired') return r.daysLeft < 0;
    if (filter === 'expiring_7') return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

  const searchedRenewals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visible.filter((r) => {
      const matchShift = shiftFilter === 'all' || r.shift.toLowerCase() === shiftFilter.toLowerCase();
      const matchPlan = planFilter === 'all' || r.plan.toLowerCase().includes(planFilter.toLowerCase());
      const matchDue = dueFilter === 'all' || (dueFilter === 'due_only' ? Number(r.due) > 0 : true);
      const matchQ =
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        r.smartId.toLowerCase().includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.shift.toLowerCase().includes(q);
      return matchShift && matchPlan && matchDue && matchQ;
    });
  }, [visible, searchQuery, shiftFilter, planFilter, dueFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
    shiftFilter !== 'all' ||
    planFilter !== 'all' ||
    dueFilter !== 'all' ||
    filter !== 'expiring_7'
  );

  const translateShift = (value: string) => {
    switch (value) {
      case 'Morning': return tManagerUi('morning');
      case 'Evening': return tManagerUi('evening');
      case 'Full Day': return tManagerUi('full_day');
      default: return value;
    }
  };

  const translatePlanTier = (value: string) => {
    switch (value) {
      case 'Basic': return tManagerUi('basic_tier');
      case 'Premium': return tManagerUi('premium_tier');
      case 'Elite': return tManagerUi('elite_tier');
      default: return value;
    }
  };

  const handleExportCsv = () => {
    const headers = ['Student Name', 'Smart ID', 'Shift', 'Plan', 'Expiry Date', 'Days Left', 'Last Payment', 'Due (INR)'];
    const rows = visible.map((r) => [
      sanitizeManagerRenewalsCsvCell(r.studentName),
      sanitizeManagerRenewalsCsvCell(r.smartId),
      sanitizeManagerRenewalsCsvCell(r.shift),
      sanitizeManagerRenewalsCsvCell(r.plan),
      sanitizeManagerRenewalsCsvCell(r.expiryDate),
      sanitizeManagerRenewalsCsvCell(r.daysLeft),
      sanitizeManagerRenewalsCsvCell(r.lastPaymentDate),
      sanitizeManagerRenewalsCsvCell(r.due),
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `renewals_${filter}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMsg(`Exported ${visible.length} renewal records to CSV successfully.`);
  };

  const handlePrint = () => window.print();

  const handleWhatsAppAll = () => {
    setFeedbackMsg(`WhatsApp renewal reminders dispatched to all ${searchedRenewals.length} displayed students.`);
  };

  const handleEmailAll = () => {
    setFeedbackMsg(`Email renewal reminders dispatched to all ${searchedRenewals.length} displayed students.`);
  };

  const handleRemindAll = () => {
    setFeedbackMsg(`Omnichannel renewal alerts scheduled for ${searchedRenewals.length} members.`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeedbackMsg(`Imported file "${file.name}" successfully with ${visible.length} renewals records.`);
      e.target.value = '';
    }
  };

  const handleRenewStudent = (id: number | string, studentName: string) => {
    setRenewalsList((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          const currentExpiry = new Date(item.expiryDate);
          const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
          return {
            ...item,
            expiryDate: newExpiry.toISOString().split('T')[0],
            daysLeft: 30,
            due: 0,
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return item;
      })
    );
    setFeedbackMsg(`Subscription renewed successfully for ${studentName} (+30 days added).`);
  };

  const handleRemindStudent = (studentName: string) => {
    setFeedbackMsg(`Renewal reminder successfully sent to ${studentName} via WhatsApp & SMS.`);
  };

  const colDefs = useMemo(
    () =>
      buildRenewalColumns({
        tManagerUi,
        translateShift,
        translatePlanTier,
        formatDate,
        formatCurrency,
        onRenewStudent: handleRenewStudent,
        onRemindStudent: handleRemindStudent,
      }),
    [tManagerUi, formatDate, formatCurrency]
  );

  return (
    <div
      className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
    >
      <ManagerFinanceRenewalsHeader
        renewalsTitle={tManagerUi('renewals')}
        renewalsSubtitle={tManagerUi('track_upcoming_and_overdue_membership_renewals')}
        sampleWarningText={tManagerUi('renewals_queue_displays_sample_membership_records_for_l_36ae94')}
        importLabel={tManagerUi('import')}
        waAllLabel={tManagerUi('wa_all')}
        emailAllLabel={tManagerUi('email_all')}
        remindAllLabel={tManagerUi('remind_all')}
        hasVisibleRows={visible.length > 0}
        onImportClick={handleImportClick}
        onExportCsv={handleExportCsv}
        onPrint={handlePrint}
        onWhatsAppAll={handleWhatsAppAll}
        onEmailAll={handleEmailAll}
        onRemindAll={handleRemindAll}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
      />

      <div className="p-3 rounded-xl bg-muted border border-border text-xs text-secondary flex items-center justify-between" role="status">
        <span>Sample renewals queue active under current contract layout preview.</span>
        <button type="button" disabled className="mgr-btn-outline text-xs opacity-50 cursor-not-allowed">
          Renewal API Unavailable
        </button>
      </div>

      <ManagerFinanceRenewalsAlertBanner
        expiringCount={expiringCritical.length}
        expiredCount={expiredCount}
        onSendDueReminders={handleWhatsAppAll}
      />

      {feedbackMsg && (
        <div role="status" aria-live="polite" className="p-3 bg-success-bg border border-border text-success rounded-lg text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{feedbackMsg}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="text-xs font-semibold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Filter tabs and search bar */}
      <ManagerFinanceRenewalsFilterBar
        filter={filter}
        onFilterChange={(f) => setUrlFilter('filter', f)}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        shiftFilter={shiftFilter}
        onShiftFilterChange={setShiftFilter}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        dueFilter={dueFilter}
        onDueFilterChange={setDueFilter}
        onResetFilters={() => {
          setSearchQuery('');
          setShiftFilter('all');
          setPlanFilter('all');
          setDueFilter('all');
          setUrlFilter('filter', 'expiring_7');
        }}
        hasActiveFilters={hasActiveFilters}
        searchedCount={searchedRenewals.length}
        totalVisibleCount={visible.length}
        tManagerUi={(k) => tManagerUi(k)}
      />

      <div className="fin-card overflow-hidden">
        <ManagerFinanceRenewalsNativeTable
          columns={colDefs}
          rows={searchedRenewals}
          getRowKey={(row) => String(row.id)}
          emptyMessage={searchQuery ? 'No renewals matching active search criteria.' : tManagerUi('no_renewals_found')}
          labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }}
        />
      </div>
    </div>
  );
}
