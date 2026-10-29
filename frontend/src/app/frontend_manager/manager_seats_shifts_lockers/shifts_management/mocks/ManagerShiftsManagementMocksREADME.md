# Seats, Shifts, and Lockers fixtures

The data in `ManagerShiftsManagementSampleFixtures.ts` exists only to render the module's preview layouts. It is not a live allocation feed and must not be interpreted as persisted seat, locker, shift, or student state.

`ManagerShiftsManagementApiFixtures.ts` and `ManagerShiftsManagementHandlers.ts` provide synthetic test-only responses for the four existing read-only GET contracts (seat matrix, lockers, allocations, history). They are shaped to satisfy the current API mappers and include an unknown status case to guard against unsafe coercion. `?__testMode=empty` and `?__testMode=error` are test controls only. No allocation, migration, seat, shift, or locker mutation handler is registered.

Durable operations remain disabled until the host supplies authoritative read/write contracts. Unknown live status values must remain `unknown`, not be converted to `maintenance`, `free`, `occupied`, or `Active`.
