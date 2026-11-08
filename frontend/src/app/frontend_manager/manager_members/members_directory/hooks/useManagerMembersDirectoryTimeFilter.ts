'use client';

import { useState, useMemo } from 'react';
import type { ManagerMembersDirectoryRecord } from '../types/ManagerMembersDirectoryTypes';
import type { ManagerMembersTimeHorizon } from '../components/manager_members_directory_sections/ManagerMembersDirectoryTimeHorizonBar';

export function useManagerMembersDirectoryTimeFilter(
  filteredMembers: ManagerMembersDirectoryRecord[],
  referenceDate?: Date,
) {
  const [timeHorizon, setTimeHorizon] = useState<ManagerMembersTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const timeFilteredMembers = useMemo(() => {
    if (timeHorizon === 'all') return filteredMembers;
    const now = referenceDate ?? new Date();
    return filteredMembers.filter((m) => {
      const recDate = new Date(m.joinDate);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [filteredMembers, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Members';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  return {
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    timeFilteredMembers,
    timeHorizonLabel,
  };
}

