# manager_qr_scanner mock boundary

`ManagerAttendanceQrScannerSampleFixtures.ts` and `ManagerAttendanceQrScannerHolidaySampleFixtures.ts` contain preview-only attendance, absentee, and holiday records. They do not represent live rosters or persisted calendar data.

The module API is explicitly `EXTERNAL_PRODUCT_DECISION_BLOCKED`; do not add attendance, parent-alert, holiday mutation, or QR attendance MSW handlers without authoritative host API, permission, and response contracts. Preview edits and controls must not imply persistence.
