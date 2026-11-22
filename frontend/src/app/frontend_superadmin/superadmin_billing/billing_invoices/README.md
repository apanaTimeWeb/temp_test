# Platform Billing & Invoices

## Overview
Governs SaaS platform invoices, GST tax compliance (CGST/SGST vs IGST), payment gateway integrations (Razorpay, Stripe, UPI), and payment failure handling.

## Features
- **Sequential Invoicing:** `INV-2026-XXXX`.
- **Dynamic GST Engine:** Intra-state (CGST 9% + SGST 9%) vs Inter-state (IGST 18%).
- **Tax Invoice View:** Itemized SAC lines, tax breakdown, and QR code representation.
- **Payment Failure & Retention Rules:** 9 system behaviors with zero database deletion.
