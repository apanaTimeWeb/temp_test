# Finance sample and API-test fixtures

`ManagerFinanceRefundsApiFixtures.ts` and `ManagerFinanceRefundsHandlers.ts` contain synthetic test-only fixtures and MSW handlers. The handler listens only on `/__test__/manager-finance-refunds`; this local path is not a production endpoint. The external refunds endpoint, response envelope, authorization/tenant rules, and persistence behavior remain `CONTRACT_MISSING`. The API client fails closed before issuing a network request. No mutation handlers are registered.

`ManagerFinanceRefundsCollectFeeMocks.ts`, `ManagerFinanceRefundsRefundRequestSampleFixtures.ts`, `ManagerFinanceRefundsOperationalSampleFixtures.ts`, and `ManagerFinanceRefundsComponentSampleFixtures.ts` are illustrative preview/layout fixtures, not current financial records. Pages that render them must retain a visible sample-data disclosure. No fixture may be used to imply that a payment, refund, fee, invoice, receipt, suspension, renewal, or other financial operation has persisted.

Write actions remain disabled until an authoritative host API, payload, permissions, and response contract is supplied.
