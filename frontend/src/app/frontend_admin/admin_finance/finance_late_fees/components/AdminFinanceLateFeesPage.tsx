// Responsibility: AdminFinanceLateFeesPage component owned by admin_finance; responsibility folder: admin_finance_components_views.
'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import toast from 'sonner';
import { formatAdminFinanceCurrency, majorToMinor, minorToMajor } from '@/app/frontend_admin/admin_finance/finance_late_fees/utils/AdminFinanceLateFeesFormat';
import { Settings, AlertTriangle, Save, MessageSquare } from 'lucide-react';
import { openAdminFinanceWhatsApp } from '@/app/frontend_admin/admin_finance/finance_late_fees/utils/AdminFinanceLateFeesWhatsApp';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { ADMIN_FINANCE_URLS } from '@/app/frontend_admin/admin_finance/finance_late_fees/config/admin_finance_late_fees_finance_url_config_source_routes';
import { ADMIN_FINANCE_DEMO_LATE_FEE_CONFIG, ADMIN_FINANCE_DEMO_OVERDUE_STUDENTS } from '@/app/frontend_admin/admin_finance/finance_late_fees/mocks/AdminFinanceLateFeesDemoFixtures';
import type { AdminFinanceLateFeeConfig, AdminFinanceDemoOverdueStudent } from '@/app/frontend_admin/admin_finance/finance_late_fees/types/AdminFinanceLateFeesTypes';


export function AdminFinanceLateFeesPage() {
  const t = useTranslations('ADMIN_FINANCE_LATE_FEES');
  const router = useRouter();
  const [config, setConfig] = useState<AdminFinanceLateFeeConfig | null>(null);
  const [overdue, setOverdue] = useState<AdminFinanceDemoOverdueStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [graceDays, setGraceDays] = useState('');
  const [penaltyRate, setPenaltyRate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(isFrontendDemoModeEnabled() ? ADMIN_FINANCE_DEMO_LATE_FEE_CONFIG : null);
    setOverdue(isFrontendDemoModeEnabled() ? ADMIN_FINANCE_DEMO_OVERDUE_STUDENTS : []);
    setIsLoading(false);
  }, []);

  const startEdit = () => {
    if (config) { setGraceDays(String(config.gracePeriodDays)); setPenaltyRate(String(minorToMajor(config.penaltyPerDay, 'INR', 'en-IN'))); }
    setEditing(true);
  };

  const handleSave = () => {
    if (!graceDays.trim() || !penaltyRate.trim()) {
      toast.error(t('VALIDATION'), { id: 'admin_finance-finance_late_fees-components-AdminFinanceLateFeesPage-toast-45-1' });
      return;
    }
    const parsedGraceDays = Number(graceDays);
    const parsedPenaltyRate = Number(penaltyRate);
    if (!Number.isInteger(parsedGraceDays) || parsedGraceDays < 0 || !Number.isFinite(parsedPenaltyRate) || parsedPenaltyRate < 0) {
      toast.error(t('VALIDATION'), { id: 'admin_finance-finance_late_fees-components-AdminFinanceLateFeesPage-toast-51-2' });
      return;
    }
    if (!isFrontendDemoModeEnabled()) { toast.error(t('POLICY_BLOCKED'), { id: 'admin_finance-finance_late_fees-components-AdminFinanceLateFeesPage-toast-54-3' }); return; }
    setIsSaving(true);
    setTimeout(() => {
      setConfig({ gracePeriodDays: parsedGraceDays, penaltyPerDay: majorToMinor(parsedPenaltyRate, 'INR', 'en-IN') });
      toast.info(t('DEMO_SAVED'), { id: 'admin_finance-finance_late_fees-components-AdminFinanceLateFeesPage-toast-58-4' });
      setEditing(false); setIsSaving(false);
    }, 600);
  };

  const sendWhatsAppReminder = (s: AdminFinanceDemoOverdueStudent) => {
    const lines = [
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `📚 *${t('REMINDER_BRAND')}*`,
      `📍 ${t('REMINDER_BRANCH')}`,
      `━━━━ ${t('REMINDER_HEADING')} ━━━━`,
      ``,
      `👤 *${t('REMINDER_NAME')}:* ${s.studentName}`,
      `🆔 *${t('REMINDER_SMART_ID')}:* ${s.smartId}`,
      ``,
      `⚠️ *${t('REMINDER_OVERDUE', { days: s.daysOverdue })}*`,
      `📅 *${t('REMINDER_DUE_DATE')}:* ${s.dueDate}`,
      ``,
      `💰 *${t('REMINDER_LATE_FEE')}:* ${formatAdminFinanceCurrency(s.accruedFee)}`,
      `🔴 *${t('REMINDER_TOTAL_DUE')}:* ${formatAdminFinanceCurrency(s.totalDue)}`,
      ``,
      t('REMINDER_BODY'),
      ``,
      `━━━━━━━━━━━━━━━━━━━━━━`,
      `🎓 ${t('REMINDER_CLOSING')}`,
      `📚 ${t('REMINDER_BRAND')}`
    ];
    const message = lines.join('\n');
    if (!isFrontendDemoModeEnabled()) { toast.error(t('REMINDER_BLOCKED'), { id: 'admin_finance-finance_late_fees-components-AdminFinanceLateFeesPage-toast-86-5' }); return; }
    openAdminFinanceWhatsApp(s.phone, message);
  };

  return (
    <div className="space-y-6">
      {!isFrontendDemoModeEnabled() && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>

      {/* Config Card */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-body text-text-primary font-semibold">
            <Settings size={18} strokeWidth={2} className="text-text-secondary" />
            {t('SETTINGS')}
          </div>
          {!editing && (
            <button data-testid="admin_finance-page-control-001" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={startEdit} disabled={!isFrontendDemoModeEnabled()} aria-disabled={!isFrontendDemoModeEnabled()}>{t('EDIT')}</button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-10 w-full" />
            <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-10 w-full" />
          </div>
        ) : editing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-late-fee-grace-days">{t('GRACE_PERIOD_DAYS')}</label>
              <input id="admin-finance-late-fee-grace-days" type="number" min="0" step="1" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={graceDays} onChange={(e) => setGraceDays(e.target.value)} />
              <p className="mt-1 text-caption text-text-secondary">{t('GRACE_HINT')}</p>
            </div>
            <div>
              <label className="mb-1.5 block text-body font-medium text-text-primary" htmlFor="admin-finance-late-fee-penalty">{t('PENALTY_PER_DAY_INR')}</label>
              <input id="admin-finance-late-fee-penalty" type="number" min="0" step="0.01" className="min-h-11 w-full min-w-0 rounded-md border border-border bg-input px-3 py-2 text-body text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" value={penaltyRate} onChange={(e) => setPenaltyRate(e.target.value)} />
              <p className="mt-1 text-caption text-text-secondary">{t('PENALTY_HINT')}</p>
            </div>
            <div className="flex gap-2">
              <button data-testid="admin_finance-page-control-002" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer" onClick={handleSave} disabled={isSaving}>
                <Save size={18}  strokeWidth={2}/> {isSaving ? t('SAVING') : `💾 ${t('SAVE_RULES')}`}
              </button>
              <button data-testid="admin_finance-page-control-003" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-card text-text-secondary cursor-pointer" onClick={() => setEditing(false)}>{t('CANCEL')}</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-text-secondary text-sm">{t('GRACE_PERIOD')}</p>
              <p className="mt-2 text-kpi font-bold text-text-primary">{t('DAYS', { count: config?.gracePeriodDays ?? 0 })}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm">{t('PENALTY_PER_DAY')}</p>
              <p className="mt-2 text-kpi font-bold text-text-primary">{formatAdminFinanceCurrency(config?.penaltyPerDay || 0)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Table */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 border-b border-border pb-4">
          <AlertTriangle size={18} className="text-warning-text"  strokeWidth={2}/>
          <span className="text-body text-text-primary font-semibold">{t('OVERDUE_STUDENTS')}</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-surface-highlight text-caption text-text-secondary">
              <th className="text-left py-3 px-4">{t('STUDENT')}</th>
              <th className="text-left py-3 px-4">{t('DUE_DATE')}</th>
              <th className="text-left py-3 px-4">{t('DAYS_OVERDUE')}</th>
              <th className="text-right py-3 px-4">{t('LATE_FEE_ACCRUED')}</th>
              <th className="text-right py-3 px-4">{t('TOTAL_DUE')}</th>
              <th className="text-right py-3 px-4">{t('ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={`skeleton-${i + 1}`} className="border-b border-border text-text-primary">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={`skeleton-cell-${j + 1}`} className="py-3 px-4">
                      <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16" />
                    </td>
                  ))}
                </tr>
              ))
            ) : overdue.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div data-testid="admin_finance-page-state-004" className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-6 text-center">
                    <div data-testid="admin_finance-page-state-005" className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-subtle text-primary">✅</div>
                    <p data-testid="admin_finance-page-state-006" className="text-section-title font-semibold text-text-primary">{t('EMPTY')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              overdue.map((s) => (
                <tr key={s.studentId} className="motion-safe:transition-colors hover:bg-primary-subtle border-b border-border text-text-primary">
                  <td className="py-3 px-4">
                    <div className="text-body font-semibold text-text-primary">{s.studentName}</div>
                    <div className="text-caption text-text-secondary">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-caption text-text-secondary">{s.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className="text-danger-text font-semibold">{s.daysOverdue}d</span>
                  </td>
                  <td className="py-3 px-4 text-right text-warning-text">{formatAdminFinanceCurrency(s.accruedFee)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-danger-text">{formatAdminFinanceCurrency(s.totalDue)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button data-testid="admin_finance-page-control-007"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-info-bg text-info-text border-info-bg cursor-pointer"
                        onClick={() => router.push(ADMIN_FINANCE_URLS.ROUTE_COLLECT_FEE_FOR_STUDENT(s.studentId))}
                      >
                        💰 {t('COLLECT_NOW')}
                      </button>
                      <button data-testid="admin_finance-page-control-008"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-body font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 bg-success-bg text-success-text border-success-bg cursor-pointer"
                        onClick={() => sendWhatsAppReminder(s)} disabled={!isFrontendDemoModeEnabled()} title={!isFrontendDemoModeEnabled() ? t('REMINDER_BLOCKED') : t('SEND_WHATSAPP')} aria-label={t('SEND_WHATSAPP')}
                      >
                        <MessageSquare size={18}  strokeWidth={2}/> WA
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
