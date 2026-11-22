// FLOW: Feature source -> superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Billing Types; defines module-owned type contracts for invoices, transactions, GST configuration, and gateways. */

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
  status: SuperadminInvoicePaymentStatus;
  method: string;
  gateway?: 'Razorpay' | 'Stripe' | 'UPI' | 'Direct Transfer';
  gst: string;
  phone?: string;
  email?: string;
  contact?: string;
  planName?: string;
  billingCycle?: 'Monthly' | 'Annual';
  paidAmount?: number;
  balanceDue?: number;
  retryCount?: number;
  failureReason?: string;
  webhookVerified?: boolean;
  creditNoteId?: string;
  items?: SuperadminInvoiceLineItem[];
}

export interface SuperadminPaymentTransaction {
  id: string;
  invoiceId: string;
  tenant: string;
  date: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: 'UPI' | 'Card' | 'Netbanking' | 'Direct Transfer';
  gateway: 'Razorpay' | 'Stripe' | 'Cashfree' | 'Dynamic UPI QR';
  utr: string;
  status: 'Success' | 'Failed' | 'Refunded' | 'Pending';
  failureReason?: string;
}

export interface SuperadminGstTaxConfig {
  legalName: string;
  tradeName: string;
  billingAddress: string;
  state: string;
  stateCode: string;
  pinCode: string;
  gstin: string;
  sacCode: string;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  rcmApplicable: boolean;
  invoicePrefix: string;
  creditNotePrefix: string;
  nextInvoiceNumber: number;
  autoInvoiceCycle: 'Monthly' | 'Quarterly' | 'Annual';
}

export interface SuperadminGatewayConfig {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpaySecret: string;
  razorpayWebhookSecret: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  upiEnabled: boolean;
  upiVpa: string;
  upiMerchantName: string;
  allowPartialPayments: boolean;
  partialPaymentMinPercent: number;
}

export interface SuperadminCreditNote {
  id: string;
  invoiceId: string;
  tenant: string;
  date: string;
  amount: number;
  reason: 'Cancellation' | 'Billing Error' | 'Goodwill Refund' | 'Plan Downgrade';
  status: 'Refunded' | 'Adjusted' | 'Pending';
}
