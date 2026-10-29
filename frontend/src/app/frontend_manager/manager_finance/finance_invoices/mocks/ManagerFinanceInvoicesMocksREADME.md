# Finance sample and API-test fixtures

`ManagerFinanceInvoicesCollectFeeMocks.ts`, `ManagerFinanceInvoicesRefundRequestSampleFixtures.ts`, `ManagerFinanceInvoicesOperationalSampleFixtures.ts`, and `ManagerFinanceInvoicesComponentSampleFixtures.ts` are illustrative preview/layout fixtures, not current financial records. Pages that render them must retain a visible sample-data disclosure. No fixture may be used to imply that a payment, refund, fee, invoice, receipt, suspension, renewal, or other financial operation has persisted.

`ManagerFinanceInvoicesApiFixtures.ts` and `ManagerFinanceInvoicesHandlers.ts` are synthetic **test-only** fixtures and MSW handlers for the existing read-only `GET /finance/payments` and `GET /finance/refunds` contracts. The fixture arrays are parsed against the module's current Zod response schemas. `?__testMode=empty` and `?__testMode=error` exercise empty/error branches in tests; these parameters are not part of the production API contract. No mutation handlers are registered.

Write actions remain disabled until an authoritative host API, payload, permissions, and response contract is supplied.
