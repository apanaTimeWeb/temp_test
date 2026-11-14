// RESPONSIBILITY: Define stable module-owned constants for libraries student smart id; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_libraries/libraries_student_smart_id/constants/SuperadminLibrariesOnboardingSetupStudentSmartIdConstants.ts -> typed constants -> component/hook/config behavior.
export const SUPERADMIN_SYSTEM_SMART_ID_FLOW_STEPS = [
  { step: '1', icon: '🚪', titleKey: 'COPY.STUDENT_EXITS', descKey: 'COPY.ID_FREED_STUDENT_MOVED_TO_ALUMNI_ARCHIVE' },
  { step: '2', icon: '🔍', titleKey: 'COPY.SYSTEM_SCANS', descKey: 'COPY.CHECKS_FOR_LOWEST_AVAILABLE_GAP_ID_IN_THE_SEQUENCE' },
  { step: '3', icon: '🎯', titleKey: 'COPY.GAP_ID_ASSIGNED', descKey: 'COPY.NEW_STUDENT_GETS_FREED_ID_RECORDS_STAY_COMPACT_AND_SERIAL' },
];

/** Synthetic active IDs used by the explicitly labeled Smart ID preview. */
