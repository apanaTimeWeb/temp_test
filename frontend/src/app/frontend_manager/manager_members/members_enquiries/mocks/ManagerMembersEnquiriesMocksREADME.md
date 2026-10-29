# manager_enquiries mock boundary

`ManagerMembersEnquiriesFixtures.ts` and `ManagerMembersEnquiriesHandlers.ts` provide module-owned mock data/handlers for the existing list/detail and local test contracts. The fixture response shapes are covered by schema compatibility tests.

The production API currently permits read-only list/detail calls. Create, status-update, and follow-up operations intentionally fail closed until authoritative host API, payload, permission, and result contracts are supplied. Do not treat mock-only writes as persistence.
