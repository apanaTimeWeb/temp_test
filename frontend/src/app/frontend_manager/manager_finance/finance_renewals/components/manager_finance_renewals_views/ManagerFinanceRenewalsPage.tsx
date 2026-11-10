'use client';

import { useState, useRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsDemoRepository';
import { useManagerRenewalsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsUrlFilters';
import ManagerFinanceRenewalsNativeTable from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_table_parts/ManagerFinanceRenewalsNativeTable';
import { exportManagerRenewalsCsv } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsCsv';
import { useManagerRenewalsFormatting } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsFormattingHook';
import { useManagerFinanceRenewalsConfirm } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsConfirm';
import { CheckCircle } from 'lucide-react';
import { MANAGER_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_manager/manager_finance/finance_renewals/constants/ManagerFinanceRenewalsRenewalConstants';
import type { FilterType, ManagerFinanceRenewalsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';
import ManagerFinanceRenewalsAlertBanner from './ManagerFinanceRenewalsAlertBanner';
import ManagerFinanceRenewalsHeader from './ManagerFinanceRenewalsHeader';
import ManagerFinanceRenewalsFilterBar from './ManagerFinanceRenewalsFilterBar';
import ManagerFinanceRenewalsTimeHorizonBar, { type ManagerRenewalsTimeHorizon } from './ManagerFinanceRenewalsTimeHorizonBar';
import { buildRenewalColumns } from './ManagerFinanceRenewalsTableColumns';
import { ManagerFinanceRenewalsBulkWhatsAppModal } from './ManagerFinanceRenewalsBulkWhatsAppModal';

const URL_FILTERS = { filter: { defaultValue: 'expiring_7', allowedValues: ['expired', 'expiring_7', 'expiring_15'] } } as const;

export default function ManagerFinanceRenewalsPage(_routeQuery: ManagerFinanceRenewalsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_renewals.ui');
  const { confirm, dialog: renewalsConfirmDialog } = useManagerFinanceRenewalsConfirm();
  const { formatCurrency, formatDate } = useManagerRenewalsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerRenewalsUrlFilters(URL_FILTERS);
  const filter = urlFilters.filter as FilterType;

  const [renewalsList, setRenewalsList] = useState(MANAGER_FINANCE_SAMPLE_RENEWALS);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isBulkWhatsAppOpen, setIsBulkWhatsAppOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all');
  const [timeHorizon, setTimeHorizon] = useState<ManagerRenewalsTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const horizonFiltered = useMemo(() => {
    return renewalsList.filter((r) => {
      if (timeHorizon === 'today') return r.daysLeft <= 0;
      if (timeHorizon === 'this_week') return r.daysLeft <= 7;
      if (timeHorizon === 'this_month') return r.daysLeft <= 30;
      return true;
    });
  }, [renewalsList, timeHorizon]);

  const expiringCritical = useMemo(() => horizonFiltered.filter((r) => r.daysLeft <= 3 && r.daysLeft >= 0), [horizonFiltered]);
  const expiredCount = useMemo(() => horizonFiltered.filter((r) => r.daysLeft < 0).length, [horizonFiltered]);

  const visible = horizonFiltered.filter((r) => {
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

  const translateShift = (v: string) => v === 'Morning' ? tManagerUi('morning') : v === 'Evening' ? tManagerUi('evening') : v === 'Full Day' ? tManagerUi('full_day') : v;
  const translatePlanTier = (v: string) => v === 'Basic' ? tManagerUi('basic_tier') : v === 'Premium' ? tManagerUi('premium_tier') : v === 'Elite' ? tManagerUi('elite_tier') : v;

  const handleExportCsv = () => {
    exportManagerRenewalsCsv(visible, filter);
    setFeedbackMsg(`Exported ${visible.length} renewal records to CSV successfully.`);
  };

  const handlePrint = () => window.print();

  const handleWhatsAppAll = () => {
    setIsBulkWhatsAppOpen(true);
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

  const handleRenewStudent = async (id: number | string, studentName: string) => {
    const confirmed = await confirm(
      `Confirm subscription renewal: Extend subscription for ${studentName} by 30 days?`,
      tManagerUi('cancel') || 'Cancel',
      'Renew (+30 Days)'
    );
    if (!confirmed) return;
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
    const student = renewalsList.find((r) => r.studentName === studentName);
    if (student) {
      const cleanPhone = `98765432${String(student.id).padStart(2, '0')}`;
      const text = encodeURIComponent(
        `Hello ${student.studentName}, your Library subscription (${student.smartId} • ${student.plan}) ${
          student.daysLeft < 0 ? `expired ${Math.abs(student.daysLeft)} days ago` : `expires in ${student.daysLeft} days`
        }. Amount due: ₹${Math.round(student.due / 100)}. Please renew to maintain your seat access. — Library Administration`
      );
      const rawPhone = (student as { phone?: string }).phone || cleanPhone;
      let digits = rawPhone.replace(/\D/g, '');
      if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
      const targetPhone = digits.length === 10 ? `91${digits}` : digits;
      const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
      if (popup) popup.opener = null;
    }
    setFeedbackMsg(`Renewal WhatsApp message opened for ${studentName}.`);
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
    <>
      {renewalsConfirmDialog}
      <div
        className="space-y-6"
        data-route-view={_routeQuery.view}
        data-route-id={_routeQuery.id}
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

      <ManagerFinanceRenewalsTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={visible.length}
      />

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

      <ManagerFinanceRenewalsBulkWhatsAppModal
        isOpen={isBulkWhatsAppOpen}
        onClose={() => setIsBulkWhatsAppOpen(false)}
        renewals={searchedRenewals}
        onComplete={() => setIsBulkWhatsAppOpen(false)}
      />
    </div>
    </>
  );
}
