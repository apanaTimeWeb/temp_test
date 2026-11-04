'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  ADMIN_STAFF_ATTENDANCE_FIXTURES,
  ADMIN_STAFF_ROSTER_FIXTURES,
} from '@/app/frontend_admin/admin_staff/staff_attendance/mocks/scenarios/admin_staff_attendance.scenarios';
import type {
  StaffAttendanceRecord,
  StaffRosterSlot,
  RegularizeAttendanceInput,
} from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import type {
  StaffAttendanceFilterState,
  StaffAttendanceViewTab,
  StaffAttendanceKpiSummary,
  AdminStaffAttendanceModel,
} from '@/app/frontend_admin/admin_staff/staff_attendance/types/AdminStaffAttendanceTypes';

export function useAdminStaffAttendance(): AdminStaffAttendanceModel {
  const t = useTranslations('ADMIN_STAFF_ATTENDANCE');
  const { selectedBranchId: globalBranchId } = useAdminBranch();
  const isDemoMode = isFrontendDemoModeEnabled();

  const [tab, setTab] = useState<StaffAttendanceViewTab>('logs');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(globalBranchId || 'all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [records, setRecords] = useState<StaffAttendanceRecord[]>(ADMIN_STAFF_ATTENDANCE_FIXTURES);
  const [inspectingRecord, setInspectingRecord] = useState<StaffAttendanceRecord | null>(null);
  const [regularizingRecord, setRegularizingRecord] = useState<StaffAttendanceRecord | null>(null);

  // Sync with global branch if changed
  const effectiveBranchId = selectedBranchId === 'all' && globalBranchId !== 'all' ? globalBranchId : selectedBranchId;

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (effectiveBranchId !== 'all' && r.branchId !== effectiveBranchId) return false;
      if (selectedShift !== 'all' && r.shiftType !== selectedShift) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = r.staffName.toLowerCase().includes(q);
        const matchesId = r.staffId.toLowerCase().includes(q);
        const matchesRole = r.role.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesRole) return false;
      }
      return true;
    });
  }, [records, effectiveBranchId, selectedShift, statusFilter, searchQuery]);

  const filteredRoster = useMemo(() => {
    return ADMIN_STAFF_ROSTER_FIXTURES.filter((slot) => {
      if (effectiveBranchId !== 'all' && slot.branchId !== effectiveBranchId) return false;
      if (selectedShift !== 'all' && slot.shiftType !== selectedShift) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return slot.staffName.toLowerCase().includes(q) || slot.role.toLowerCase().includes(q);
      }
      return true;
    });
  }, [effectiveBranchId, selectedShift, searchQuery]);

  const kpis: StaffAttendanceKpiSummary = useMemo(() => {
    const totalStaff = filteredRecords.length;
    const presentCount = filteredRecords.filter((r) => r.status === 'PRESENT').length;
    const lateCount = filteredRecords.filter((r) => r.status === 'LATE').length;
    const absentCount = filteredRecords.filter((r) => r.status === 'ABSENT').length;
    const onLeaveCount = filteredRecords.filter((r) => r.status === 'ON_LEAVE').length;
    const rate = totalStaff > 0 ? Math.round(((presentCount + lateCount) / totalStaff) * 100) : 0;
    return {
      totalStaff,
      presentCount,
      lateCount,
      absentCount,
      onLeaveCount,
      attendanceRatePercent: rate,
    };
  }, [filteredRecords]);

  const handleRegularizeSubmit = useCallback((input: RegularizeAttendanceInput) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === input.recordId
          ? {
              ...r,
              status: input.newStatus,
              clockIn: input.clockIn,
              clockOut: input.clockOut ?? r.clockOut,
              notes: input.reason,
            }
          : r
      )
    );
    const target = records.find((r) => r.id === input.recordId);
    toast.success(t('TOAST_REGULARIZE_SUCCESS', { name: target?.staffName ?? 'Staff Member' }));
    setRegularizingRecord(null);
  }, [records, t]);

  const filters: StaffAttendanceFilterState = {
    tab,
    selectedBranchId: effectiveBranchId,
    selectedDate,
    selectedShift,
    statusFilter,
    searchQuery,
  };

  return {
    filters,
    setTab,
    setSelectedBranchId,
    setSelectedDate,
    setSelectedShift,
    setStatusFilter,
    setSearchQuery,
    kpis,
    records: filteredRecords,
    rosterSlots: filteredRoster,
    isDemoMode,
    inspectingRecord,
    setInspectingRecord,
    regularizingRecord,
    setRegularizingRecord,
    handleRegularizeSubmit,
  };
}

export default useAdminStaffAttendance;
