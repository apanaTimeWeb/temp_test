import { useEffect, useMemo, useState } from 'react';
import {MANAGER_DOCUMENTS_CATEGORIES, MANAGER_MEMBERS_DOCUMENT_VAULT_SEARCH_DEBOUNCE_MS} from '@/app/frontend_manager/manager_members/members_document_vault/constants/ManagerMembersDocumentVaultConstants';
import { MANAGER_DOCUMENTS_SAMPLE_RECORDS } from '@/app/frontend_manager/manager_members/members_document_vault/hooks/ManagerMembersDocumentVaultDemoRepository';
import type { ManagerMembersDocumentVaultCategoryKey } from '@/app/frontend_manager/manager_members/members_document_vault/types/ManagerMembersDocumentVaultTypes';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns the sample-document search/category filter state and derived row sets. */
export function useManagerDocumentVaultFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  // Dependency rationale: debounce document search before deriving the visible rows and cancel stale timers on change/unmount.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearchQuery(searchQuery), MANAGER_MEMBERS_DOCUMENT_VAULT_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);
  const [selectedCategory, setSelectedCategory] = useState<ManagerMembersDocumentVaultCategoryKey | null>(null);
  const rowData = MANAGER_DOCUMENTS_SAMPLE_RECORDS;

  const visibleRows = useMemo(() => rowData.filter((doc) => {
    const matchesCategory = !selectedCategory || (selectedCategory === 'Other'
      ? !MANAGER_DOCUMENTS_CATEGORIES.some((category) => category.key !== 'Other' && category.key === doc.category)
      : doc.category === selectedCategory);
    const haystack = `${doc.name} ${doc.category} ${doc.uploadedBy}`.toLowerCase();
    return matchesCategory && haystack.includes(debouncedSearchQuery.toLowerCase());
  }), [rowData, debouncedSearchQuery, selectedCategory]);

  const categoryCounts = useMemo(() => Object.fromEntries(
    MANAGER_DOCUMENTS_CATEGORIES.map((category) => [category.key, rowData.filter((doc) => category.key === 'Other'
      ? !MANAGER_DOCUMENTS_CATEGORIES.some((candidate) => candidate.key !== 'Other' && candidate.key === doc.category)
      : doc.category === category.key).length]),
  ) as Record<ManagerMembersDocumentVaultCategoryKey, number>, [rowData]);

  return { rowData, visibleRows, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categoryCounts };
}
