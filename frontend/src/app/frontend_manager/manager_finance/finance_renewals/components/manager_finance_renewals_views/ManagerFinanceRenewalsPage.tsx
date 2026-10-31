'use client';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsDemoRepository';
import { useManagerRenewalsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/useManagerFinanceRenewalsUrlFilters';
import ManagerFinanceRenewalsNativeTable, { type NativeCellParams } from '@/app/frontend_manager/manager_finance/finance_renewals/components/manager_finance_renewals_table_parts/ManagerFinanceRenewalsNativeTable';
import { sanitizeManagerRenewalsCsvCell } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsCsv';

import { useManagerRenewalsFormatting } from '@/app/frontend_manager/manager_finance/finance_renewals/hooks/ManagerFinanceRenewalsFormattingHook';

// RESPONSIBILITY: Entry page for the manager_renewals module.
// DATA FLOW: Next.js Router -> Page -> Components
import { Send, MessageSquare, Upload, Mail, Download, Printer, RotateCcw, CheckCircle } from 'lucide-react';
import { MANAGER_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_manager/manager_finance/finance_renewals/constants/ManagerFinanceRenewalsRenewalConstants';
import type { FilterType, ManagerFinanceRenewalsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsComponentTypes';

const URL_FILTERS = { filter: { defaultValue: 'expiring_7', allowedValues: ['expired', 'expiring_7', 'expiring_15'] } } as const;

export default function ManagerFinanceRenewalsPage(_routeQuery: ManagerFinanceRenewalsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_renewals.ui');
  const { formatCurrency, formatDate } = useManagerRenewalsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerRenewalsUrlFilters(URL_FILTERS);
  const filter = urlFilters.filter as FilterType;
  
  const [renewalsList, setRenewalsList] = useState(MANAGER_FINANCE_SAMPLE_RENEWALS);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visible = renewalsList.filter((r) => {
    if (filter === 'expired')     return r.daysLeft < 0;
    if (filter === 'expiring_7')  return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

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
    link.setAttribute('download', `subscription_renewals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedbackMsg(`Exported ${visible.length} renewal records to CSV successfully.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppAll = () => {
    setFeedbackMsg(`WhatsApp renewal reminders dispatched to all ${visible.length} members.`);
  };

  const handleEmailAll = () => {
    setFeedbackMsg(`Email renewal reminders dispatched to all ${visible.length} members.`);
  };

  const handleRemindAll = () => {
    setFeedbackMsg(`Dispatched multi-channel renewal reminders to all ${visible.length} members.`);
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

  const colDefs = [
    { field: 'studentName', headerName: tManagerUi('student'), flex: 1, minWidth: 150, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { field: 'smartId', headerName: tManagerUi('smart_id'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-mono text-sm">{p.value}</span> },
    { field: 'shift', headerName: tManagerUi('shift'), width: 110, cellRenderer: (p: NativeCellParams) => <div className="h-full flex items-center"><span className="fin-badge fin-badge--neutral">{typeof p.value === 'string' ? translateShift(p.value) : '—'}</span></div> },
    { field: 'plan', headerName: tManagerUi('plan'), width: 110, cellRenderer: (p: NativeCellParams) => <span className="fin-text-body">{typeof p.value === 'string' ? translatePlanTier(p.value) : '—'}</span> },
    { field: 'expiryDate', headerName: tManagerUi('expiry_date'), width: 120, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    { 
      field: 'daysLeft', 
      headerName: tManagerUi('days_left'), 
      width: 120,
      cellRenderer: (p: NativeCellParams) => {
        const daysLeft = typeof p.value === 'number' ? p.value : 0;
        return <span className={daysLeft < 0 ? 'fin-text-danger font-semibold' : daysLeft <= 7 ? 'fin-text-warning font-semibold' : 'fin-text-body'}>
          {daysLeft < 0 ? tManagerUi('days_ago_count', { count: Math.abs(daysLeft) }) : tManagerUi('days_count', { count: daysLeft })}
        </span>;
      }
    },
    { field: 'lastPaymentDate', headerName: tManagerUi('last_payment'), width: 130, cellRenderer: (p: NativeCellParams) => <span className="fin-cell-subtext">{typeof p.value === 'string' ? formatDate(p.value) : p.value}</span> },
    { 
      field: 'due', 
      headerName: tManagerUi('due_inr'), 
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: NativeCellParams) => {
        const due = typeof p.value === 'number' ? p.value : 0;
        return <span className={due > 0 ? 'fin-text-danger' : 'fin-text-body'}>{formatCurrency(due)}</span>;
      }
    },
    {
      headerName: tManagerUi('actions'),
      width: 200,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as { id: number | string; studentName: string };
        return (
          <div className="flex items-center gap-2 h-full">
            <button
              type="button"
              onClick={() => handleRenewStudent(row.id, row.studentName)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
              title={`Renew subscription for ${row.studentName}`}
            >
              <RotateCcw size={12} /> Renew
            </button>
            <button
              type="button"
              onClick={() => handleRemindStudent(row.studentName)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border border-border bg-card hover:bg-surface-hover text-secondary transition-colors cursor-pointer"
              title={`Send reminder to ${row.studentName}`}
            >
              <Send size={12} className="text-amber-500" /> Remind
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.xlsx" className="hidden" />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('renewal_records_are_sample_data_reminder_sending_and_sub_1a7d9e')}</p>
          <h1 className="fin-page-title">{tManagerUi('subscription_renewals')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('subscriptions_needing_renewal_attention')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={handleImportClick} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover" title={tManagerUi('import')}>
            <Upload size={14} className="mr-1" /> {tManagerUi('import')}
          </button>
          <button type="button" onClick={handleExportCsv} disabled={visible.length === 0} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title="Export CSV" data-testid="manager-finance-renewals-export">
            <Download size={14} className="mr-1" /> CSV
          </button>
          <button type="button" onClick={handlePrint} disabled={visible.length === 0} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title="Print Renewals" data-testid="manager-finance-renewals-print">
            <Printer size={14} className="mr-1" /> Print
          </button>
          <button type="button" onClick={handleWhatsAppAll} disabled={visible.length === 0} className="fin-btn fin-btn-secondary text-success cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={tManagerUi('wa_all')}>
            <MessageSquare size={14} className="mr-1" /> {tManagerUi('wa_all')}
          </button>
          <button type="button" onClick={handleEmailAll} disabled={visible.length === 0} className="fin-btn fin-btn-secondary text-purple cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={tManagerUi('email_all')}>
            <Mail size={14} className="mr-1" /> {tManagerUi('email_all')}
          </button>
          <button type="button" onClick={handleRemindAll} disabled={visible.length === 0} className="fin-btn fin-btn-secondary cursor-pointer hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed" title={tManagerUi('remind_all')}>
            <Send size={14} className="mr-1 text-amber-500" /> {tManagerUi('remind_all')}
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div role="status" aria-live="polite" className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>{feedbackMsg}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="text-xs font-semibold hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {MANAGER_FINANCE_RENEWAL_FILTERS.map((f) => (
          <button type="button"
            key={f.value}
            onClick={() => setUrlFilter('filter', f.value)}
            className={filter === f.value ? 'fin-badge fin-badge--info cursor-pointer' : 'fin-badge fin-badge--neutral cursor-pointer'}
          >
            {f.emoji} {tManagerUi(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="fin-card p-4">
        <div className="mgr-table-wrapper h-112">
          <ManagerFinanceRenewalsNativeTable getRowKey={(row) => String(row.id)} emptyMessage={tManagerUi('no_subscriptions_found')} rows={visible} columns={colDefs} labels={{ previous: tManagerUi('previous_page'), next: tManagerUi('next_page') }} />
        </div>
      </div>

    </div>
  );
}
