'use client';

import { useSuperadminAccountingExpensesConfirm } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesConfirm';
/** Responsibility: Superadmin Accounting Expenses Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminAccountingExpensesPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import SuperadminAccountingExpensesSemanticTable from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/components/SuperadminAccountingExpensesSemanticTable';

import { useSuperadminAccountingExpensesUrlFilter } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesUrlFilter';
import { useSuperadminAccountingExpensesValidationMessage } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesValidationMessage';
import { SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES as __SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES } from "@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/config/superadmin_accounting_expenses.url_config";
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/components/SuperadminAccountingExpensesSemanticTable';
type ICellRendererParams = SemanticCellParams<SuperadminAccountingExpense>;
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SuperadminAccountingExpenseSchema, type SuperadminAccountingExpenseFormValues, SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/schemas/SuperadminAccountingExpensesExpenseSchema';
import { useRouter } from 'next/navigation';
import { TrendingUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatSuperadminAccountingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/utils/SuperadminAccountingExpensesFormatters';
import { SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSES } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/mocks/fixtures/SuperadminAccountingExpensesExpenseMockFixtures';
import type { SuperadminAccountingExpense } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesExpenseTypes';
import { SUPERADMIN_ACCOUNTING_EXPENSE_MODE_BADGE } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/constants/SuperadminAccountingExpensesExpenseConstants';
import { useTranslations, useLocale } from 'next-intl';
import { useSuperadminAccountingExpensesUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/hooks/useSuperadminAccountingExpensesUnsavedChangesGuard';






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
 * Renders the `superadmin_accounting` view owned by `SuperadminAccountingExpensesPageClient`.
 * Owns local UI state for `expenses`, `catFilter`, `showAdd`.
 * Effect lifecycle boundaries are `[showAdd]`; listeners/timers/focus are cleaned up by their owning effects.
 * Dirty form state is guarded before destructive or route-leaving actions.
 */
export default function SuperadminAccountingExpensesPageClient() {
  const confirm = useSuperadminAccountingExpensesConfirm();
  const tCopy = useTranslations('SUPERADMIN_ACCOUNTING');
  const locale = useLocale();
  const translateValidationMessage = useSuperadminAccountingExpensesValidationMessage();
  const router = useRouter();
  const [expenses, setExpenses] = useState<SuperadminAccountingExpense[]>(() => SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSES.map((expense) => ({ ...expense })));
  const [catFilter, setCatFilter] = useSuperadminAccountingExpensesUrlFilter('expenseCategory', 'all');
  const [showAdd, setShowAdd] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting , isDirty} } = useForm<SuperadminAccountingExpenseFormValues>({
    resolver: zodResolver(SuperadminAccountingExpenseSchema),
    defaultValues: { date: '', category: SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash' },
  });
  const { confirmLeave } = useSuperadminAccountingExpensesUnsavedChangesGuard(isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  // Effect contract: manage keyboard focus, Escape/Tab behavior, and focus restoration for the active dialog or drawer; dependency set [showAdd] is the deliberate re-run boundary.
  useEffect(() => {
    if (!showAdd) return;
    
    dialogRef.current?.querySelector<HTMLElement>('input, select, textarea, button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setShowAdd(false); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from<HTMLElement>(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.getElementById('expense-add-trigger')?.focus(); };
  }, [showAdd]);

  const visible = catFilter === 'all' ? expenses : expenses.filter(e => e.category === catFilter);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthTotal = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.amount, 0);
  const total = visible.reduce((s, e) => s + e.amount, 0);

  const handleAdd = (form: SuperadminAccountingExpenseFormValues) => {
    const newExp: SuperadminAccountingExpense = { id: Date.now(), date: form.date, category: form.category, description: form.description, amount: Number(form.amount), paidBy: form.paidBy, mode: form.mode };
    setExpenses(p => [newExp, ...p]);
    toast.message(tCopy("COPY.PREVIEW_ONLY_THE_EXPENSE_WAS_NOT_SUBMITTED_TO_A_SERVER"), { id: "superadmin_accounting:SuperadminAccountingExpensesPageClient:message:1" });
    setShowAdd(false);
    reset({ date: '', category: SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES[0], description: '', amount: '', paidBy: '', mode: 'cash' });
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm(tCopy("COPY.REMOVE_THIS_SAMPLE_EXPENSE_FROM_THE_CURRENT_PAGE_PREVIEW_THIS_DOES_NOT_180F9A03"));
    if (!confirmed) return;
    setExpenses(p => p.filter(e => e.id !== id));
    toast.message(tCopy("COPY.PREVIEW_ONLY_NO_SERVER_SIDE_EXPENSE_DELETION_WAS_PERFORMED"), { id: "superadmin_accounting:SuperadminAccountingExpensesPageClient:message:2" });
  };

  const colDefs = [
    { field: 'date', headerName: tCopy("COPY.DATE"), width: 130, cellRenderer: (p: ICellRendererParams) => <span className="acct-cell-subtext">{p.value}</span> },
    { 
      field: 'category', 
      headerName: tCopy("COPY.CATEGORY"), 
      width: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="acct-badge acct-badge--neutral mt-2 inline-block">
          {p.value}
        </span>
      )
    },
    { field: 'description', headerName: tCopy("COPY.DESCRIPTION"), flex: 1, minWidth: 200, cellRenderer: (p: ICellRendererParams) => <span className="acct-text-body">{p.value}</span> },
    { 
      field: 'amount', 
      headerName: tCopy("COPY.AMOUNT"), 
      width: 140,
      cellStyle: { textAlign: 'right', fontWeight: 600 },
      cellRenderer: (p: ICellRendererParams) => (
        <span className="acct-text-danger">
          {tCopy('COPY.FINANCIAL_DETAIL_ONLY')}
        </span>
      )
    },
    { 
      field: 'mode', 
      headerName: tCopy("COPY.MODE"), 
      width: 120,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`${SUPERADMIN_ACCOUNTING_EXPENSE_MODE_BADGE[p.value as keyof typeof SUPERADMIN_ACCOUNTING_EXPENSE_MODE_BADGE]} mt-2 inline-block capitalize`}>
          {p.value}
        </span>
      )
    },
    { field: 'paidBy', headerName: tCopy("COPY.PAID_BY"), width: 140, cellRenderer: (p: ICellRendererParams) => <span className="acct-text-body">{p.value}</span> },
    {
      headerName: tCopy("COPY.TABLE_COLUMN_ACTIONS"),
      width: 100,
      sortable: false,
      cellStyle: { textAlign: 'right' },
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex justify-end items-center">
          <button type="button" 
            className="acct-badge acct-badge--danger cursor-pointer hover:bg-danger hover:text-on-danger motion-safe:transition-colors motion-reduce:transition-none motion-safe:duration-200" 
            onClick={() => handleDelete(params.data.id)}
            title={tCopy("COPY.DELETE_SAMPLE_EXPENSE")}
            aria-label={tCopy("COPY.REMOVE_SAMPLE_EXPENSE_ARIA_LABEL", { description: String(params.data?.description ?? tCopy('COPY.UNKNOWN_EXPENSE')) })}
           data-testid={`superadmin-accounting-accounting-expenses-delete-sample-expense-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}>
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_EXPENSE_ROWS_ONLY_ADD_DELETE_ACTIONS_AFFECT_LOCAL_PREVIEW_STATE_AND_DO_NOT_WRITE_ACCOUNTING_RECORDS")}</p>
      <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SAMPLE_EXPENSE_RECORDS_ONLY_ADDING_OR_DELETING_EXPENSES_CHANGES_LOCAL_PREVIEW_STATE_AND_DOES_NOT_WRITE_TO_A_BACKEND")}</p>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="acct-page-title">{tCopy("COPY.EXPENSE_LEDGER")}</h1>
          <p className="acct-page-subtitle">{tCopy("COPY.TRACK_ALL_LIBRARY_OPERATIONAL_EXPENSES")}</p>
        </div>
        <button id="expense-add-trigger" type="button" className="acct-badge acct-badge--info cursor-pointer flex items-center gap-1 hover:border-focus" onClick={() => setShowAdd(true)} data-testid="superadmin-accounting-accounting-expenses-expense-add-trigger-2">
          <Plus size={14} /> {tCopy("COPY.ADD_EXPENSE")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="acct-kpi-card">
          <p className="acct-kpi-label">{tCopy("COPY.TOTAL_EXPENSES")}</p>
          <p className="acct-kpi-value acct-text-danger">{formatSuperadminAccountingMajorPreviewCurrency(expenses.reduce((s,e)=>s+e.amount,0), 'INR', locale)}</p>
        </div>
        <div className="acct-kpi-card">
          <p className="acct-kpi-label">{tCopy("COPY.THIS_MONTH")}</p>
          <p className="acct-kpi-value">{formatSuperadminAccountingMajorPreviewCurrency(currentMonthTotal, 'INR', locale)}</p>
        </div>
        <div className="acct-kpi-card">
          <p className="acct-kpi-label">{tCopy("COPY.ENTRIES")}</p>
          <p className="acct-kpi-value">{expenses.length}</p>
        </div>
        <div className="acct-kpi-card">
          <p className="acct-kpi-label">{tCopy("COPY.SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES")}</p>
          <p className="acct-kpi-value">{new Set(expenses.map((e) =>e.category)).size}</p>
        </div>
      </div>

      <div className="acct-filter-bar flex items-center justify-between p-4 bg-card border border-border rounded-lg">
        <div className="flex flex-col">
          <label htmlFor="expense-category-filter" className="acct-label text-xs mb-1">{tCopy("COPY.FILTER_BY_CATEGORY")}</label>
          <select id="expense-category-filter" className="acct-select w-48" value={catFilter} onChange={e => setCatFilter(e.target.value)} data-testid="superadmin-accounting-accounting-expenses-expense-category-filter-3">
            <option value="all">{tCopy("COPY.ALL_CATEGORIES")}</option>
            {SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" className="acct-badge acct-badge--neutral cursor-pointer hover:border-focus flex items-center gap-1" onClick={async () => { if (await confirmLeave()) router.push(__SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES.MODULE_URLS.EXPENSE_CATEGORIES); }} data-testid="superadmin-accounting-accounting-expenses-view-categories-4">
          <TrendingUp size={14} /> {tCopy("COPY.VIEW_CATEGORIES")}
        </button>
      </div>

      <div className="acct-card p-4">
        {visible.length === 0 ? (
          <div className="acct-empty-state py-12">
            <div className="acct-empty-state__icon">💸</div>
            <p className="acct-empty-state__title">{tCopy("COPY.NO_EXPENSES_FOUND")}</p>
          </div>
        ) : (
          <div className="mgr-table-wrapper h-112">
            <SuperadminAccountingExpensesSemanticTable
             
              rowData={visible}
              columnDefs={colDefs}
              rowHeight={56}
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
        )}
      </div>

      {showAdd && (
        <div className="acct-dialog-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setShowAdd(false); }}>
          <div ref={dialogRef} className="acct-dialog bg-card" role="dialog" aria-modal="true" aria-labelledby="expense-dialog-title">
            <h2 id="expense-dialog-title" className="acct-dialog__title mb-4 font-bold text-primary">{tCopy("COPY.ADD_EXPENSE_PREVIEW")}</h2>
            <button type="button" aria-label={tCopy("COPY.CLOSE_ADD_EXPENSE_DIALOG")} className="acct-dialog__close hover:text-danger" onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-expenses-close-add-expense-dialog-5">✕</button>
            <form className="space-y-4" noValidate onSubmit={handleSubmit(handleAdd)} data-testid="superadmin-superadmin-accounting-expenses-page-client-form-line-229">
              <div><label htmlFor="expense-date" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.DATE")} <span className="acct-text-danger">*</span></label><input id="expense-date" type="date" className="acct-input w-full" aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? "expense-date-error" : undefined} {...register("date")}  data-testid="superadmin-accounting-accounting-expenses-expense-date-6"/>{errors.date && <p id="expense-date-error" className="text-sm text-danger" role="alert">{translateValidationMessage(errors.date.message)}</p>}</div>
              <div><label htmlFor="expense-category" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.CATEGORY")}</label><select id="expense-category" className="acct-select w-full" {...register("category")} data-testid="superadmin-accounting-accounting-expenses-expense-category-7">{SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES.map((c) =><option key={c}>{c}</option>)}</select></div>
              <div><label htmlFor="expense-description" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.DESCRIPTION")} <span className="acct-text-danger">*</span></label><input id="expense-description" className="acct-input w-full" placeholder={tCopy("COPY.ENTER_DESCRIPTION")} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "expense-description-error" : undefined} {...register("description")}  data-testid="superadmin-accounting-accounting-expenses-expense-description-8"/>{errors.description && <p id="expense-description-error" className="text-sm text-danger" role="alert">{translateValidationMessage(errors.description.message)}</p>}</div>
              <div><label htmlFor="expense-amount" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.AMOUNT")} <span className="acct-text-danger">*</span></label><input id="expense-amount" type="number" min="0.01" step="0.01" className="acct-input w-full" placeholder="0" aria-invalid={Boolean(errors.amount)} aria-describedby={errors.amount ? "expense-amount-error" : undefined} {...register("amount")}  data-testid="superadmin-accounting-accounting-expenses-expense-amount-9"/>{errors.amount && <p id="expense-amount-error" className="text-sm text-danger" role="alert">{translateValidationMessage(errors.amount.message)}</p>}</div>
              <div><label htmlFor="expense-paid-by" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.PAID_BY")} <span className="acct-text-danger">*</span></label><input id="expense-paid-by" className="acct-input w-full" placeholder={tCopy("COPY.NAME")} aria-invalid={Boolean(errors.paidBy)} aria-describedby={errors.paidBy ? "expense-paid-by-error" : undefined} {...register("paidBy")}  data-testid="superadmin-accounting-accounting-expenses-expense-paid-by-10"/>{errors.paidBy && <p id="expense-paid-by-error" className="text-sm text-danger" role="alert">{translateValidationMessage(errors.paidBy.message)}</p>}</div>
              <div><label htmlFor="expense-mode" className="acct-label text-sm font-semibold mb-1 block">{tCopy("COPY.MODE")}</label><select id="expense-mode" className="acct-select w-full" {...register("mode")} data-testid="superadmin-accounting-accounting-expenses-expense-mode-11">
                <option value="cash">{tCopy("COPY.CASH")}</option><option value="upi">{tCopy("COPY.UPI")}</option><option value="card">{tCopy("COPY.CARD")}</option><option value="bank">{tCopy("COPY.BANK_TRANSFER")}</option>
              </select></div>
              <p className="text-xs text-secondary">{tCopy("COPY.PREVIEW_ONLY_SAVE_UPDATES_THIS_PAGE_S_LOCAL_SAMPLE_STATE_AND_DOES_NOT_SUBMIT_TO_A_SERVER")}</p>
              <div className="acct-dialog__footer mt-6 flex justify-end gap-3">
                <button type="button" className="px-4 py-2 border border-border text-primary rounded hover:bg-card motion-safe:transition-colors motion-reduce:transition-none" onClick={() => setShowAdd(false)} data-testid="superadmin-accounting-accounting-expenses-cancel-12">{tCopy("COPY.CANCEL")}</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-success text-on-success rounded hover:bg-success hover:text-on-success motion-safe:transition-colors motion-reduce:transition-none" data-testid="superadmin-accounting-accounting-expenses-save-preview-13">{tCopy("COPY.SAVE_PREVIEW")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
