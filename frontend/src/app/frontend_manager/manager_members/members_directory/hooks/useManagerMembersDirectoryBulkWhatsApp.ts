'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ManagerMembersDirectoryRecord } from '../types/ManagerMembersDirectoryTypes';

export function useManagerMembersDirectoryBulkWhatsApp(
  allMembers: ManagerMembersDirectoryRecord[],
  paginatedMembers: ManagerMembersDirectoryRecord[],
  filteredMembers: ManagerMembersDirectoryRecord[]
) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedMembers = useMemo(
    () => allMembers.filter((m) => selectedIds.includes(m.id)),
    [allMembers, selectedIds]
  );

  const toggleSelectOne = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginatedMembers.map((m) => m.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  }, [paginatedMembers, selectedIds]);

  const selectAllFiltered = useCallback(() => {
    setSelectedIds(filteredMembers.map((m) => m.id));
  }, [filteredMembers]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const quickWhatsApp = useCallback((member: ManagerMembersDirectoryRecord) => {
    let cleanPhone = member.phone.replace(/\D/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Hello ${member.name}, this is Central Library Management regarding your membership (${member.id} • ${member.type} Plan). How may we assist you today? — Central Library Administration`
    );
    const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  }, []);

  return {
    selectedIds,
    selectedMembers,
    isModalOpen,
    setIsModalOpen,
    toggleSelectOne,
    toggleSelectAll,
    selectAllFiltered,
    clearSelection,
    quickWhatsApp,
  };
}

