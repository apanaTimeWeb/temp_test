export const MANAGER_CRM_QUERY_KEYS = {
  enquiries: () => ['manager_enquiries', 'enquiries'] as const,
  enquiry: (id: string) => ['manager_enquiries', 'enquiries', id] as const,
} as const;
