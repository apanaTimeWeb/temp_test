// RESPONSIBILITY: Constants for SuperAdmin Platform Billing & Invoices module.

export const SUPERADMIN_BILLING_INVOICES_CONSTANTS = Object.freeze({
  DEFAULT_PAGE_SIZE: 10,
  PLATFORM_TAX_PROFILE: {
    SELLER_NAME: 'Smart Library SaaS Platform',
    GSTIN: '07AAACS9988D1Z2',
    SAC_CODE: '998313',
    DEFAULT_STATE_CODE: '07', // Delhi
  },
  TAX_RATES: {
    CGST_RATE: 0.09,
    SGST_RATE: 0.09,
    IGST_RATE: 0.18,
  },
  PAYMENT_GATEWAYS: ['Razorpay', 'Stripe', 'UPI', 'Direct Transfer'] as const,
  INVOICE_STATUSES: ['Paid', 'Pending', 'Overdue', 'Failed', 'Partially Paid', 'Refunded'] as const,
});
