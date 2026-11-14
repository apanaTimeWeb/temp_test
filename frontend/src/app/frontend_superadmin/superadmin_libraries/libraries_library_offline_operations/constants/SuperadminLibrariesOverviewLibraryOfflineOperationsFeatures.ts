// RESPONSIBILITY: Define stable module-owned constants for libraries library offline operations; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_library_offline_operations/constants/SuperadminLibrariesOverviewLibraryOfflineOperationsFeatures.ts -> typed constants -> component/hook/config behavior.
/** Offline-mode capability descriptors; user-facing labels are localized by the owning module. */
export const SUPERADMIN_SYSTEM_OFFLINE_FEATURES = [
  { id: 'attendance-sync', available: true, labelKey: 'COPY.OFFLINE_FEATURE_ATTENDANCE_SYNC' },
  { id: 'student-info-cache', available: true, labelKey: 'COPY.OFFLINE_FEATURE_STUDENT_INFO_CACHE' },
  { id: 'seat-matrix-readonly', available: true, labelKey: 'COPY.OFFLINE_FEATURE_SEAT_MATRIX_READONLY' },
  { id: 'financial-transactions', available: false, labelKey: 'COPY.OFFLINE_FEATURE_FINANCIAL_TRANSACTIONS' },
  { id: 'whatsapp-messages', available: false, labelKey: 'COPY.OFFLINE_FEATURE_WHATSAPP_MESSAGES' },
  { id: 'fee-collection', available: false, labelKey: 'COPY.OFFLINE_FEATURE_FEE_COLLECTION' },
] as const;
