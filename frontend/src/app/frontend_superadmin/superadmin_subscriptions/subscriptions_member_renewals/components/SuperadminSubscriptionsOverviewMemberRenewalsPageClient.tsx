'use client';
/** Responsibility: Superadmin Finance Renewals Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSubscriptionsOverviewMemberRenewalsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminFinanceRenewalsSemanticTable from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable';

import { useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/hooks/useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/components/SuperadminSubscriptionsOverviewMemberRenewalsSemanticTable';
type ICellRendererParams = SemanticCellParams<Renewal>;
import { useState } from 'react';

import { toast } from 'sonner';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/utils/SuperadminSubscriptionsOverviewMemberRenewalsFormatters';
import { RefreshCw, Send } from 'lucide-react';
import { SUPERADMIN_FINANCE_SAMPLE_RENEWALS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/mocks/fixtures/SuperadminSubscriptionsOverviewMemberRenewalsMockFixtures';
import { SUPERADMIN_FINANCE_RENEWAL_PLANS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/constants/SuperadminSubscriptionsOverviewMemberRenewalsRenewalConstants';
import { SUPERADMIN_FINANCE_RENEWAL_FILTERS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/constants/SuperadminSubscriptionsOverviewMemberRenewalsRenewalConstants';
import type { FilterType, Renewal } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_renewals/types/SuperadminSubscriptionsOverviewMemberRenewalsPageClientComponentTypes';






/** Derives a stable, non-index row identity for repeated interactive table controls. */
function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminSubscriptionsOverviewMemberRenewalsPageClient`.
 * Owns local UI state for `filter`, `allRenewals`, `renewDialog`, `renewPlanId`, `renewAmount`, `renewMode` and related form/selection state.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSubscriptionsOverviewMemberRenewalsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [filter, setFilter] = useSuperadminSubscriptionsOverviewMemberRenewalsUrlFilter<FilterType>('renewalFilter', 'expiring_7');
  const [allRenewals] = useState(SUPERADMIN_FINANCE_SAMPLE_RENEWALS);
  const [renewDialog, setRenewDialog] = useState<{ id: number; name: string } | null>(null);
  const [renewPlanId, setRenewPlanId] = useState('');
  const [renewAmount, setRenewAmount] = useState('');
  const [renewMode, setRenewMode] = useState('cash');
  const [renewTxnId, setRenewTxnId] = useState('');

  const visible = allRenewals.filter((r) => {
    if (filter === 'expired')     return r.daysLeft < 0;
    if (filter === 'expiring_7')  return r.daysLeft >= 0 && r.daysLeft <= 7;
    if (filter === 'expiring_15') return r.daysLeft >= 0 && r.daysLeft <= 15;
    return true;
  });

  const totalDue = visible.reduce((sum, renewal) => sum + renewal.total, 0);

  const handleRemindAll = () => {
    toast.error(tCopy("COPY.WHATSAPP_REMINDERS_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:1" });
  };

  const handleRemind = (name: string) => {
    toast.error(tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:2" });
  };

  const openRenew = (r: Renewal) => {
    setRenewDialog({ id: r.id, name: r.studentName });
    setRenewPlanId(String(r.planId));
    setRenewAmount(String(r.total));
  };

  const handleRenew = () => {
    if (!renewDialog || !renewAmount) return;
    // Do not remove the sample row or imply a completed renewal without a verified payment API contract.
    toast.error(tCopy("COPY.RENEWAL_IS_UNAVAILABLE_BECAUSE_THE_SAMPLE_RECORDS_DO_NOT_SUPPLY_A__008DD4CE"), { id: "superadmin_member_finance:SuperadminSubscriptionsOverviewMemberRenewalsPageClient:error:3" });
  };

  const colDefs = [
    { field: 'studentName', headerName: tCopy("COPY.STUDENT"), flex: 1, minWidth: 150, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-name font-medium">{p.value}</span> },
    { field: 'smartId', headerName: tCopy("COPY.SMART_ID_2"), width: 120, cellRenderer: (p: ICellRendererParams) => <span className="fin-mono text-sm">{p.value}</span> },
    { field: 'shift', headerName: tCopy("COPY.SHIFT"), width: 110, cellRenderer: (p: ICellRendererParams) => <div className="h-full flex items-center"><span className="fin-badge fin-badge--neutral">{p.value}</span></div> },
    { field: 'plan', headerName: tCopy("COPY.PLAN"), width: 110, cellRenderer: (p: ICellRendererParams) => <span className="fin-text-body">{p.value}</span> },
    { field: 'expiryDate', headerName: tCopy("COPY.TABLE_COLUMN_EXPIRY_DATE"), width: 120, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'daysLeft', 
      headerName: tCopy("COPY.DAYS_LEFT"), 
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={Number(p.value ?? 0) < 0 ? 'fin-text-danger font-semibold' : Number(p.value ?? 0) <= 7 ? 'fin-text-warning font-semibold' : 'fin-text-body'}>
          {Number(p.value ?? 0) < 0 ? `${Math.abs(Number(p.value ?? 0))} days ago` : `${Number(p.value ?? 0)} days`}
        </span>
      )
    },
    { field: 'lastPaymentDate', headerName: tCopy("COPY.TABLE_COLUMN_LAST_PAYMENT"), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="fin-cell-subtext">{p.value}</span> },
    { 
      field: 'due', 
      headerName: tCopy("COPY.DUE"), 
      width: 110,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: ICellRendererParams) => (
        <span className={Number(p.value ?? 0) > 0 ? 'fin-text-danger' : 'fin-text-body'}>
          {tCopy('COPY.FINANCIAL_DETAIL_ONLY')}
        </span>
      )
    },
    {
      headerName: tCopy("COPY.ACTIONS"),
      width: 180,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center gap-2 h-full">
          <button type="button"
            className="fin-badge fin-badge--info cursor-pointer hover:border-focus"
            onClick={() => openRenew(params.data)}
            title={tCopy("COPY.RENEW_NOW")}
           data-testid={`superadmin-finance-finance-renewals-renew-now-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
            <RefreshCw size={12} className="mr-1" /> {tCopy("COPY.RENEW")}</button>
          <button type="button"
            className="fin-badge fin-badge--neutral cursor-not-allowed opacity-50"
            onClick={() => handleRemind(params.data.studentName)} disabled
            title={tCopy("COPY.WHATSAPP_REMINDER_UNAVAILABLE")}
           data-testid={`superadmin-finance-finance-renewals-send-whatsapp-reminder-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
            <Send size={12} className="mr-1" /> {tCopy("COPY.REMIND")}</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="fin-page-title">{tCopy("COPY.RENEWALS")}</h1>
          <p className="fin-page-subtitle">{tCopy("COPY.SUBSCRIPTIONS_NEEDING_RENEWAL_ATTENTION")}</p>
        </div>
        <button type="button" className="fin-badge fin-badge--neutral cursor-not-allowed opacity-50" onClick={handleRemindAll} disabled title={tCopy("COPY.WHATSAPP_REMINDERS_UNAVAILABLE")} data-testid="superadmin-finance-finance-renewals-remind-all-3">
          <Send size={14} className="mr-1" /> {tCopy("COPY.REMIND_ALL")}</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {SUPERADMIN_FINANCE_RENEWAL_FILTERS.map((f) => (
          <button type="button"
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={filter === f.value ? 'fin-badge fin-badge--info cursor-pointer' : 'fin-badge fin-badge--neutral cursor-pointer'}
           data-testid={`superadmin-finance-finance-renewals-set-filter-4-${String(f.value)}`}>
            {f.emoji} {tCopy(f.labelKey)}
          </button>
        ))}
      </div>

      <div className="fin-card p-4">
        <div className="mgr-table-wrapper h-112">
          <SuperadminFinanceRenewalsSemanticTable
           
            rowData={visible}
            columnDefs={colDefs}
            rowHeight={60}
            headerHeight={48}
            pagination={true}
            paginationPageSize={10}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
          />
        </div>
      </div>

      {renewDialog && (
        <div className="fin-dialog-overlay">
          <div className="fin-dialog">
            <h2 className="fin-dialog__title">{tCopy("COPY.RENEW_SUBSCRIPTION")}{renewDialog.name}</h2>
            <button type="button" className="fin-dialog__close" aria-label={tCopy("COPY.CLOSE")} onClick={() => setRenewDialog(null)} data-testid="superadmin-finance-finance-renewals-close-5">✕</button>
            <div className="space-y-4">
              <div>
                <label className="fin-label" htmlFor="superadmin-superadminfinancerenewalspageclient-202-select">{tCopy("COPY.PLAN")}</label>
                <select id="superadmin-superadminfinancerenewalspageclient-202-select"
                  className="fin-select"
                  value={renewPlanId}
                  onChange={(e) => {
                    
                    setRenewPlanId(e.target.value);
                    const selectedPlan = SUPERADMIN_FINANCE_RENEWAL_PLANS.find((p) => String(p.id) === e.target.value);
                    if (selectedPlan) {
                      setRenewAmount(String(selectedPlan.price));
                    }
                  }}
                 data-testid="superadmin-finance-finance-renewals-field-6">
                  {SUPERADMIN_FINANCE_RENEWAL_PLANS.map((p) => (
                    <option key={p.id} value={String(p.id)}>{p.name} — {formatMajorUnitPreviewCurrency(p.price, 'INR', locale)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="fin-label" htmlFor="superadmin-superadminfinancerenewalspageclient-221-input">{tCopy("COPY.AMOUNT")}</label>
                <input id="superadmin-superadminfinancerenewalspageclient-221-input" type="number" min={0} step="0.01" inputMode="decimal" aria-invalid={renewAmount !== '' && (!Number.isFinite(Number(renewAmount)) || Number(renewAmount) < 0)} className="fin-input" value={renewAmount} onChange={(e) => setRenewAmount(e.target.value)}  data-testid="superadmin-finance-finance-renewals-field-7"/>
              </div>
              <div>
                <label className="fin-label" htmlFor="superadmin-superadminfinancerenewalspageclient-225-select">{tCopy("COPY.PAYMENT_MODE")}</label>
                <select id="superadmin-superadminfinancerenewalspageclient-225-select" className="fin-select" value={renewMode} onChange={(e) => setRenewMode(e.target.value)} data-testid="superadmin-finance-finance-renewals-cash-8">
                  <option value="cash">{tCopy("COPY.CASH")}</option>
                  <option value="upi">{tCopy("COPY.UPI")}</option>
                  <option value="card">{tCopy("COPY.CARD")}</option>
                  <option value="bank">{tCopy("COPY.BANK_TRANSFER")}</option>
                </select>
              </div>
              {renewMode !== 'cash' && (
                <div>
                  <label className="fin-label" htmlFor="superadmin-superadminfinancerenewalspageclient-235-input">{tCopy("COPY.TRANSACTION_ID")}</label>
                  <input id="superadmin-superadminfinancerenewalspageclient-235-input" className="fin-input" value={renewTxnId} onChange={(e) => setRenewTxnId(e.target.value)} placeholder={tCopy("COPY.ENTER_TRANSACTION_REFERENCE")}  data-testid="superadmin-finance-finance-renewals-enter-transaction-reference-9"/>
                </div>
              )}
            </div>
            <div className="fin-dialog__footer">
              <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => setRenewDialog(null)} data-testid="superadmin-finance-finance-renewals-cancel-10">{tCopy("COPY.CANCEL")}</button>
              <button type="button"
                className="fin-badge fin-badge--success cursor-not-allowed opacity-50"
                onClick={handleRenew}
                disabled title={tCopy("COPY.RENEWAL_IS_UNAVAILABLE_BECAUSE_THE_SAMPLE_RECORDS_DO_NOT_SUPPLY_A__008DD4CE")}
               data-testid="superadmin-finance-finance-renewals-renewing-11">
                {tCopy('COPY.CONFIRM_RENEWAL')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
