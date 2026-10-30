/** Canonical route and API URL registry for admin_finance. Paths are derived from observed frontend call sites; backend semantics remain outside supplied scope. */
export const ADMIN_FINANCE_ROOT = '/admin/admin_finance' as const;
const adminFinanceRoute = (view: string): string => { const routes: Record<string, string> = {
    "auto_suspend": "/admin/admin_finance/finance_auto_suspend",
    "finance_dashboard": "/admin/admin_finance/finance_dashboard",
    "invoice": "/admin/admin_finance/finance_invoices",
    "invoice/detail": "/admin/admin_finance/finance_invoices?view=detail",
    "late_fees": "/admin/admin_finance/finance_late_fees",
    "payment_promises": "/admin/admin_finance/finance_payment_promises",
    "payments": "/admin/admin_finance/finance_payments",
    "receipt": "/admin/admin_finance/finance_receipts",
    "receipt/detail": "/admin/admin_finance/finance_receipts?view=detail",
    "referrals": "/admin/admin_finance/finance_referrals",
    "refunds": "/admin/admin_finance/finance_refunds",
    "security_deposits": "/admin/admin_finance/finance_security_deposits",
    "trust_score": "/admin/admin_finance/finance_trust_score"
  }; return routes[view] ?? "/admin/admin_finance/finance_collect_fee"; };
export const ADMIN_FINANCE_ROUTE_AUTO_SUSPEND = "/admin/admin_finance/finance_auto_suspend";
export const ADMIN_FINANCE_ROUTE_COLLECT_FEE = '/admin/admin_finance/finance_collect_fee' as const;
export const ADMIN_FINANCE_ROUTE_COLLECT_FEE_FOR_STUDENT = (studentId: string | number) => `${ADMIN_FINANCE_ROUTE_COLLECT_FEE}?studentId=${encodeURIComponent(String(studentId))}` as const;
export const ADMIN_FINANCE_ROUTE_FINANCE_DASHBOARD = "/admin/admin_finance/finance_dashboard";
export const ADMIN_FINANCE_ROUTE_INVOICE_ID = "/admin/admin_finance/finance_invoices?view=detail";
export const ADMIN_FINANCE_ROUTE_INVOICE = "/admin/admin_finance/finance_invoices";
export const ADMIN_FINANCE_ROUTE_LATE_FEES = "/admin/admin_finance/finance_late_fees";
export const ADMIN_FINANCE_ROUTE_PAYMENT_PROMISES = "/admin/admin_finance/finance_payment_promises";
export const ADMIN_FINANCE_ROUTE_PAYMENTS = "/admin/admin_finance/finance_payments";
export const ADMIN_FINANCE_ROUTE_RECEIPT_ID = "/admin/admin_finance/finance_receipts?view=detail";
export const ADMIN_FINANCE_ROUTE_RECEIPT = "/admin/admin_finance/finance_receipts";
export const ADMIN_FINANCE_ROUTE_REFERRALS = "/admin/admin_finance/finance_referrals";
export const ADMIN_FINANCE_ROUTE_REFUNDS = "/admin/admin_finance/finance_refunds";
export const ADMIN_FINANCE_ROUTE_RENEWALS = '/admin/admin_finance/finance_renewals' as const;
export const ADMIN_FINANCE_ROUTE_SECURITY_DEPOSITS = "/admin/admin_finance/finance_security_deposits";
export const ADMIN_FINANCE_ROUTE_SUBSCRIPTIONS = '/admin/admin_finance/finance_subscriptions' as const;
export const ADMIN_FINANCE_ROUTE_TRUST_SCORE = "/admin/admin_finance/finance_trust_score";

export const ADMIN_FINANCE_PAYMENTS = '/finance/payments' as const;
export const ADMIN_FINANCE_REFUNDS = '/finance/refunds' as const;
export const ADMIN_FINANCE_INVOICE_LIST = "/admin/admin_finance/finance_invoices";
export const ADMIN_FINANCE_RECEIPT_LIST = "/admin/admin_finance/finance_receipts";
export const ADMIN_FINANCE_INVOICE = (id: string | number) => `${"/admin/admin_finance/finance_invoices?view=detail"}&id=${encodeURIComponent(String(id))}` as const;
export const ADMIN_FINANCE_RECEIPT = (id: string | number) => `${"/admin/admin_finance/finance_receipts?view=detail"}&id=${encodeURIComponent(String(id))}` as const;
export const ADMIN_FINANCE_SUBSCRIPTIONS = '/admin/admin_finance/finance_subscriptions' as const;
export const ADMIN_FINANCE_RENEWALS = '/admin/admin_finance/finance_renewals' as const;

export const ADMIN_FINANCE_URLS = {
  ROOT: ADMIN_FINANCE_ROOT,
  LIST: ADMIN_FINANCE_PAYMENTS,
  PAYMENTS: ADMIN_FINANCE_PAYMENTS,
  REFUNDS: ADMIN_FINANCE_REFUNDS,
  INVOICE_LIST: ADMIN_FINANCE_INVOICE_LIST,
  RECEIPT_LIST: ADMIN_FINANCE_RECEIPT_LIST,
  INVOICE: ADMIN_FINANCE_INVOICE,
  RECEIPT: ADMIN_FINANCE_RECEIPT,
  SUBSCRIPTIONS: ADMIN_FINANCE_SUBSCRIPTIONS,
  RENEWALS: ADMIN_FINANCE_RENEWALS,
  ROUTE_AUTO_SUSPEND: ADMIN_FINANCE_ROUTE_AUTO_SUSPEND,
  ROUTE_COLLECT_FEE: ADMIN_FINANCE_ROUTE_COLLECT_FEE,
  ROUTE_COLLECT_FEE_FOR_STUDENT: ADMIN_FINANCE_ROUTE_COLLECT_FEE_FOR_STUDENT,
  ROUTE_FINANCE_DASHBOARD: ADMIN_FINANCE_ROUTE_FINANCE_DASHBOARD,
  ROUTE_INVOICE_ID: ADMIN_FINANCE_ROUTE_INVOICE_ID,
  ROUTE_INVOICE: ADMIN_FINANCE_ROUTE_INVOICE,
  ROUTE_LATE_FEES: ADMIN_FINANCE_ROUTE_LATE_FEES,
  ROUTE_PAYMENT_PROMISES: ADMIN_FINANCE_ROUTE_PAYMENT_PROMISES,
  ROUTE_PAYMENTS: ADMIN_FINANCE_ROUTE_PAYMENTS,
  ROUTE_RECEIPT_ID: ADMIN_FINANCE_ROUTE_RECEIPT_ID,
  ROUTE_RECEIPT: ADMIN_FINANCE_ROUTE_RECEIPT,
  ROUTE_REFERRALS: ADMIN_FINANCE_ROUTE_REFERRALS,
  ROUTE_REFUNDS: ADMIN_FINANCE_ROUTE_REFUNDS,
  ROUTE_RENEWALS: ADMIN_FINANCE_ROUTE_RENEWALS,
  ROUTE_SECURITY_DEPOSITS: ADMIN_FINANCE_ROUTE_SECURITY_DEPOSITS,
  ROUTE_SUBSCRIPTIONS: ADMIN_FINANCE_ROUTE_SUBSCRIPTIONS,
  ROUTE_TRUST_SCORE: ADMIN_FINANCE_ROUTE_TRUST_SCORE,

} as const;

export const MODULE_URLS = ADMIN_FINANCE_URLS;
