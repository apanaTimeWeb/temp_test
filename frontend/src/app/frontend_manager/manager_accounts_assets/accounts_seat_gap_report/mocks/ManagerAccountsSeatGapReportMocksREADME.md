# manager_seat_gap_report mock boundary

`ManagerAccountsSeatGapReportAssetSampleFixtures.ts`, `ManagerAccountsSeatGapReportExpenseSampleFixtures.ts`, and `ManagerAccountsSeatGapReportOperationalSampleFixtures.ts` contain illustrative preview rows only. The financial reports, settlement, maintenance, category, seat-gap, and shift-gap rows do not represent live accounting records or verified financial formulas.

Add MSW handlers only when an authoritative endpoint and request/response/permission contract exists. The current Accounting API module explicitly reports `EXTERNAL_PRODUCT_DECISION_BLOCKED`; create/delete/settle/maintenance/category actions must remain unavailable. Do not invent persisted-success responses.
