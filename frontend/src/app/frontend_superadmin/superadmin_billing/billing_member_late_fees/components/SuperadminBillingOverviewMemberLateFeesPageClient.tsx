'use client';

import { useSuperadminBillingOverviewMemberLateFeesConfirm } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/hooks/useSuperadminBillingOverviewMemberLateFeesConfirm';
import SuperadminBillingOverviewMemberLateFeesEmptyState from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/components/SuperadminBillingOverviewMemberLateFeesEmptyState';
/** Responsibility: Superadmin Finance Late Fees Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminBillingOverviewMemberLateFeesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

import { toast } from 'sonner';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/utils/SuperadminBillingOverviewMemberLateFeesFormatters';
import { Settings, AlertTriangle, Save, MessageSquare } from 'lucide-react';
import { SUPERADMIN_FINANCE_SAMPLE_OVERDUE } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/mocks/fixtures/SuperadminBillingOverviewMemberLateFeesLateFeeMockFixtures';
import type { SuperadminFinanceOverdueSample } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/types/SuperadminBillingOverviewMemberLateFeesLateFeeTypes';
import type { SuperadminFinanceLateFeeConfig } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/types/SuperadminBillingOverviewMemberLateFeesLateFeeTypes';
import { SUPERADMIN_FINANCE_LATE_FEES_PAGE_CLIENT_INIT_CONFIG } from '@/app/frontend_superadmin/superadmin_billing/billing_member_late_fees/constants/SuperadminBillingOverviewMemberLateFeesStaticConstants';



/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberLateFeesPageClient`.
 * Owns local preview late-fee configuration and editable draft state.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminBillingOverviewMemberLateFeesPageClient() {
  const confirm = useSuperadminBillingOverviewMemberLateFeesConfirm();
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [config, setConfig] = useState<SuperadminFinanceLateFeeConfig>(SUPERADMIN_FINANCE_LATE_FEES_PAGE_CLIENT_INIT_CONFIG);
  const [overdue, setOverdue] = useState<SuperadminFinanceOverdueSample[]>(() => [...SUPERADMIN_FINANCE_SAMPLE_OVERDUE]);
  const totalAccrued = overdue.reduce((sum, row) => sum + row.accruedFee, 0);
  const totalDue = overdue.reduce((sum, row) => sum + row.totalDue, 0);
  const [editing, setEditing] = useState(false);
  const [graceDays, setGraceDays] = useState('');
  const [penaltyRate, setPenaltyRate] = useState('');
  const [validationMessage, setValidationMessage] = useState('');


  const startEdit = () => {
    if (config) { setGraceDays(String(config.gracePeriodDays)); setPenaltyRate(String(config.penaltyPerDay)); }
    setEditing(true);
  };

  const handleCancelEdit = async () => {
    const changed = Boolean(config) && (graceDays !== String(config.gracePeriodDays) || penaltyRate !== String(config.penaltyPerDay));
    if (changed && !await confirm(tCopy('COPY.UNSAVED_CHANGES_WARNING'))) return;
    if (config) { setGraceDays(String(config.gracePeriodDays)); setPenaltyRate(String(config.penaltyPerDay)); }
    setValidationMessage('');
    setEditing(false);
  };

  const handleSave = () => {
    const parsedGraceDays = Number(graceDays);
    const parsedPenaltyRate = Number(penaltyRate);
    if (!graceDays.trim() || !Number.isInteger(parsedGraceDays) || parsedGraceDays < 0) {
      setValidationMessage('COPY.VALIDATION_GRACE_DAYS');
      return;
    }
    if (!penaltyRate.trim() || !Number.isFinite(parsedPenaltyRate) || parsedPenaltyRate < 0) {
      setValidationMessage('COPY.VALIDATION_PENALTY_RATE');
      return;
    }
    setValidationMessage('');
    setConfig({ gracePeriodDays: parsedGraceDays, penaltyPerDay: parsedPenaltyRate });
    toast.message(tCopy("COPY.PREVIEW_ONLY_LATE_FEE_VALUES_WERE_UPDATED_LOCALLY_NO_SERVER_POLICY_WAS_6A8F50FF"), { id: "superadmin_member_finance:SuperadminBillingOverviewMemberLateFeesPageClient:message:1" });
    setEditing(false);
  };


  return (
    <div className="space-y-6">
      {(overdue?.length === 0) && <SuperadminBillingOverviewMemberLateFeesEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.LATE_FEES_SAMPLE")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.SYNTHETIC_OVERDUE_RECORDS_AND_LOCAL_PREVIEW_SETTINGS_ONLY_NO_LATE__8D154884")}</p>
      </div>

      {/* Config Card */}
      <div className="fin-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 fin-text-body font-semibold">
            <Settings size={18} className="fin-icon-muted" />
            {tCopy("COPY.LATE_FEE_SETTINGS")}</div>
          {!editing && (
            <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={startEdit} data-testid="superadmin-finance-finance-late-fees-edit-1">{tCopy("COPY.EDIT")}</button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="fin-label" htmlFor="superadmin-superadminfinancelatefeespageclient-88-input">{tCopy("COPY.GRACE_PERIOD_DAYS")}</label>
              <input id="superadmin-superadminfinancelatefeespageclient-88-input" type="number" min={0} step={1} className="fin-input" value={graceDays} onChange={(e) => { setGraceDays(e.target.value); setValidationMessage(''); }} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? 'superadmin-late-fees-validation' : undefined}  data-testid="superadmin-finance-finance-late-fees-superadmin-superadminfinancelatefeespageclient-88-input-2"/>
              <p className="fin-input-hint">{tCopy("COPY.DAYS_AFTER_DUE_DATE_BEFORE_PENALTIES_APPLY")}</p>
            </div>
            <div>
              <label className="fin-label" htmlFor="superadmin-superadminfinancelatefeespageclient-93-input">{tCopy("COPY.PENALTY_PER_DAY")}</label>
              <input id="superadmin-superadminfinancelatefeespageclient-93-input" type="number" min={0} step="0.01" className="fin-input" value={penaltyRate} onChange={(e) => { setPenaltyRate(e.target.value); setValidationMessage(''); }} aria-invalid={Boolean(validationMessage)} aria-describedby={validationMessage ? 'superadmin-late-fees-validation' : undefined}  data-testid="superadmin-finance-finance-late-fees-superadmin-superadminfinancelatefeespageclient-93-input-3"/>
              <p className="fin-input-hint">{tCopy("COPY.DAILY_LATE_FEE_AMOUNT_AFTER_GRACE_PERIOD")}</p>
            </div>
            {validationMessage && <p id="superadmin-late-fees-validation" className="text-sm text-danger" role="alert">{validationMessage ? tCopy(validationMessage) : ''}</p>}
            <div className="flex gap-2">
              <button type="button" className="fin-badge fin-badge--success cursor-pointer" onClick={handleSave} data-testid="superadmin-finance-finance-late-fees-preview-rules-4">
                <Save size={11} /> {tCopy("COPY.PREVIEW_RULES")}</button>
              <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={handleCancelEdit} data-testid="superadmin-finance-finance-late-fees-cancel-5">{tCopy("COPY.CANCEL")}</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="fin-text-muted text-sm">{tCopy("COPY.GRACE_PERIOD")}</p>
              <p className="fin-kpi-value">{config?.gracePeriodDays} {tCopy("COPY.DAYS")}</p>
            </div>
            <div>
              <p className="fin-text-muted text-sm">{tCopy("COPY.PENALTY_PER_DAY_2")}</p>
              <p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(config?.penaltyPerDay || 0, 'INR', locale)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Table */}
      <div className="fin-card overflow-x-auto">
        <div className="flex items-center gap-2 p-4 fin-border-bottom">
          <AlertTriangle size={18} className="fin-text-warning" />
          <span className="fin-text-body font-semibold">{tCopy("COPY.OVERDUE_STUDENTS")}</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SUBSCRIPTION_DUE_DATE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DAYS_OVERDUE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.LATE_FEE_ACCRUED")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.TOTAL_DUE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {overdue.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">✅</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_ACTIVE_LATE_FEE_CHARGES")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              overdue.map((s) => (
                <tr key={s.studentId} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{s.studentName}</div>
                    <div className="fin-cell-subtext">{s.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{s.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className="fin-text-danger font-semibold">{s.daysOverdue}{tCopy("COPY.D")}</span>
                  </td>
                  <td className="py-3 px-4 text-right fin-text-warning">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-danger">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button"
                        className="fin-badge fin-badge--neutral opacity-60 cursor-not-allowed"
                        disabled
                        title={tCopy("COPY.UNAVAILABLE_THIS_ROW_CONTAINS_SYNTHETIC_DATA_AND_CANNOT_INITIATE_R_27B5F792")}
                        aria-label={tCopy("COPY.COLLECT_PAYMENT_UNAVAILABLE_ARIA_LABEL", { name: s.studentName })}
                       data-testid={`superadmin-finance-finance-late-fees-unavailable-this-row-contains-synthetic-data-and-cannot-initiate-r-27-b5-f792-6-${String(s.studentId)}`}>
                        {tCopy("COPY.COLLECT_UNAVAILABLE")}</button>
                      <button type="button"
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        disabled
                        title={tCopy("COPY.UNAVAILABLE_NO_MESSAGING_API_CONTRACT_IS_SUPPLIED")}
                        aria-label={tCopy("COPY.REMINDER_UNAVAILABLE_FOR_SAMPLE_RECORD")}
                       data-testid={`superadmin-finance-finance-late-fees-unavailable-no-messaging-api-contract-is-supplied-7-${String(s.studentId)}`}>
                        <MessageSquare size={13} /> {tCopy("COPY.UNAVAILABLE")}</button>
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
