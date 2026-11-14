// FLOW: Feature source -> superadmin_billing/billing_overview/types/SuperadminBillingOverviewTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Billing Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminBillingInvoiceSample {
  id: string;
  tenant: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Overdue';
  method: string;
  gst: string;
}

