// RESPONSIBILITY: Zod validation schemas for Superadmin Platform Billing & Invoices module.
import { z } from 'zod';

export const SUPERADMIN_CREATE_INVOICE_SCHEMA = z.object({
  invoiceId: z.string().trim().regex(/^INV-2026-\d{4}$/, 'Invoice format must be INV-2026-XXXX'),
  tenant: z.string().trim().min(2, 'Tenant name is required').max(100),
  legalName: z.string().trim().max(120).optional(),
  billingAddress: z.string().trim().max(200).optional(),
  cityStatePin: z.string().trim().max(100).optional(),
  gst: z.string().trim().length(15, 'GSTIN must be exactly 15 characters').optional(),
  subtotal: z.number().positive('Subtotal must be greater than zero'),
  discount: z.number().nonnegative().default(0),
  taxType: z.enum(['intra', 'inter']),
  method: z.string().min(1, 'Payment method required'),
  status: z.enum(['Paid', 'Pending', 'Overdue', 'Failed', 'Partially Paid', 'Refunded']),
  billingCycle: z.enum(['Monthly', 'Annual']),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type SuperadminCreateInvoiceValues = z.infer<typeof SUPERADMIN_CREATE_INVOICE_SCHEMA>;
