export const ADMIN_SYSTEM_SMART_ID_ACTIVE_IDS = [1, 2, 4, 5, 6, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20] as const;
export const ADMIN_SYSTEM_SMART_ID_ALL_IDS = Array.from({ length: 20 }, (_, index) => index + 1);
export const ADMIN_SYSTEM_SMART_ID_GAP_IDS = ADMIN_SYSTEM_SMART_ID_ALL_IDS.filter((id) => !ADMIN_SYSTEM_SMART_ID_ACTIVE_IDS.includes(id as (typeof ADMIN_SYSTEM_SMART_ID_ACTIVE_IDS)[number]));

export const ADMIN_SYSTEM_SMART_ID_FLOW_STEPS = [
  { step: '1', icon: '🚪', titleKey: 'FLOW_EXIT_TITLE', descKey: 'FLOW_EXIT_DESCRIPTION' },
  { step: '2', icon: '🔍', titleKey: 'FLOW_SCAN_TITLE', descKey: 'FLOW_SCAN_DESCRIPTION' },
  { step: '3', icon: '🎯', titleKey: 'FLOW_ASSIGN_TITLE', descKey: 'FLOW_ASSIGN_DESCRIPTION' },
] as const;
