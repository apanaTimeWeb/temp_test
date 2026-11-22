# Architecture: Billing Invoices

## Boundaries & Constraints
- Maximum file size: `< 300 lines`
- Zero barrel files
- Zero raw browser dialogs
- Platform Billing ledger is isolated from individual library student fee collections.

## Data Flow
```
page.tsx -> SuperadminBillingInvoicesPageClient
  -> SuperadminBillingInvoicesKpiCards
  -> Search & Filter Controls (Status, Gateway, Text)
  -> SuperadminBillingInvoicesSemanticTable
  -> Modals:
     - SuperadminBillingCreateInvoiceModal (Manual Tax Invoice Generation)
     - SuperadminBillingInvoiceDetailModal (Printable GST Tax Invoice Preview)
     - SuperadminPaymentFailureRulesModal (9 Failure Conditions & Retention Engine)
```
