# Manager Reports test fixtures

`MANAGER_REPORTS_EMPTY_FIXTURE` and `MANAGER_REPORTS_POPULATED_FIXTURE` are schema-validation fixtures only. They are not registered as a network/MSW response because no authoritative reports API contract was supplied. The browser route `/frontend_manager/manager_dashboard/dashboard_reports` must not be treated as a JSON endpoint. `fetchManagerReports` remains fail-closed until product supplies the endpoint and response contract.
