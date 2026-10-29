# Finance — Domain Contract

## Purpose

This directory is a quarantined Manager Library domain root. It owns the domain layout, a redirect-only root page, and this documentation trio. Feature behavior belongs to the terminal canonical leaf modules below.

## Frozen child modules

- `finance_collect_fee` — `/frontend_manager/manager_finance/finance_collect_fee`
- `finance_subscriptions` — `/frontend_manager/manager_finance/finance_subscriptions`
- `finance_renewals` — `/frontend_manager/manager_finance/finance_renewals`
- `finance_payments` — `/frontend_manager/manager_finance/finance_payments`
- `finance_payment_promises` — `/frontend_manager/manager_finance/finance_payment_promises`
- `finance_security_deposits` — `/frontend_manager/manager_finance/finance_security_deposits`
- `finance_late_fees` — `/frontend_manager/manager_finance/finance_late_fees`
- `finance_fines_payments` — `/frontend_manager/manager_finance/finance_fines_payments`
- `finance_auto_suspend` — `/frontend_manager/manager_finance/finance_auto_suspend`
- `finance_invoices` — `/frontend_manager/manager_finance/finance_invoices`
- `finance_receipts` — `/frontend_manager/manager_finance/finance_receipts`
- `finance_refunds` — `/frontend_manager/manager_finance/finance_refunds`
- `finance_trust_scores` — `/frontend_manager/manager_finance/finance_trust_scores`
- `finance_referrals` — `/frontend_manager/manager_finance/finance_referrals`

## Route ownership

- Root URL: `/frontend_manager/manager_finance`.
- Default leaf: `/frontend_manager/manager_finance/finance_collect_fee`.
- Root `page.tsx` redirects to that canonical leaf. It must not render aggregate feature views or retain legacy query-view routing.
- Each child owns `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, its URL config, implementation, tests, and the required leaf documentation trio.
- The shared role shell lives in `frontend_manager/manager_navigation/navigation/`; the domain root must not import sibling feature implementations.

## Change control

Only the frozen children listed above may be added under this domain. Any proposed submodule change must first update the frozen scope and audit ledger; do not create nested business modules or generic shared-business buckets.
