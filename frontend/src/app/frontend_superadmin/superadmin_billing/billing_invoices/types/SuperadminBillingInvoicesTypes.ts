// FLOW: Feature source -> superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Billing Types; defines module-owned type contracts for the named data boundary. */

export type SuperadminInvoicePaymentStatus =
  | 'Paid'
  | 'Overdue'
  | 'Pending'
  | 'Partially Paid'
  | 'Failed'
  | 'Refunded';

export interface SuperadminInvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  sacCode?: string;
}

export interface SuperadminBillingInvoiceSample {
  id: string;
  tenant: string;
  legalName?: string;
  billingAddress?: string;
  cityStatePin?: string;
  date: string;
  dueDate?: string;
  amount: number;
  subtotal?: number;
  discount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  status: 'Paid' | 'Overdue' | 'Pending' | 'Partially Paid' | 'Failed' | 'Refunded';
  method: string;
  gateway?: 'Razorpay' | 'Stripe' | 'UPI' | 'Direct Transfer';
  gst: string;
  phone?: string;
  email?: string;
  contact?: string;
  planName?: string;
  billingCycle?: 'Monthly' | 'Annual';
  retryCount?: number;
  failureReason?: string;
  webhookVerified?: boolean;
  creditNoteId?: string;
  items?: SuperadminInvoiceLineItem[];
}
