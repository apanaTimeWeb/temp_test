/** Category definitions for the metadata-only document preview. */
export const MANAGER_DOCUMENTS_CATEGORIES = [
  { key: 'ID Proof', labelKey: 'id_proofs', iconClass: 'text-primary' },
  { key: 'Finance', labelKey: 'finance', iconClass: 'text-success' },
  { key: 'Study Material', labelKey: 'study_material', iconClass: 'text-warning' },
  { key: 'Other', labelKey: 'other', iconClass: 'text-info' },
] as const;

export const MANAGER_MEMBERS_DOCUMENT_VAULT_SEARCH_DEBOUNCE_MS = 300;
