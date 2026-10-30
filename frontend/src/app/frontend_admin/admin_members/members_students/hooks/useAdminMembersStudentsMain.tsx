'use client';
// DATA FLOW: members_students route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AdminStudentsApiContractMissingError, fetchAdminStudents } from '@/app/frontend_admin/admin_members/members_students/api/admin_members_students_api';
import { ADMIN_MEMBERS_STUDENTS_QUERY_KEYS } from '@/app/frontend_admin/admin_members/members_students/api/admin_members_students.query_keys';
import { matchesAdminStudentsSearch } from '@/app/frontend_admin/admin_members/members_students/utils/AdminMembersStudentsListUtils';
import { ADMIN_STUDENTS_BUSINESS_STATUSES, ADMIN_STUDENTS_STATUSES } from '@/app/frontend_admin/admin_members/members_students/config/admin_members_students.url_config';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { AdminStudentsApiResponseSchema } from '@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema';
import { ADMIN_STUDENTS_API_FIXTURE } from '@/app/frontend_admin/admin_members/members_students/mocks/scenarios/admin_members_students.scenarios';
import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';
import useAdminStudentsColumnDefinitions from '@/app/frontend_admin/admin_members/members_students/hooks/useAdminMembersStudentsColumnDefinitions';

/** @description Owns Students list/filter/selection state. Explicit demo mode reads schema-validated synthetic fixtures; live mode fails closed until the Students API contract is supplied. Branch filtering remains on an all-branches fallback until the host supplies authoritative branch identity and tenant scope. @edge-case Unknown backend status values remain visible as Unknown instead of being dropped or coerced into a known business status. */
export default function useAdminMembersStudentsMain() {
  const t = useTranslations('ADMIN_STUDENTS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<AdminStudentsStudent['status'] | 'All'>('statusFilter', 'All', { validValues: ['All', ...ADMIN_STUDENTS_STATUSES] });
  const [selectedStudent, setSelectedStudentState] = useState<AdminStudentsStudent | null>(null);
  const invalidDetailRecoveryRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Branch filtering remains local until the host supplies an authoritative branch identity contract.
  const selectedBranch = 'All Branches';
  const studentsQuery = useQuery({
    queryKey: ADMIN_MEMBERS_STUDENTS_QUERY_KEYS.list({ mode: isDemoMode ? 'demo' : 'live' }),
    queryFn: () => isDemoMode
      ? AdminStudentsApiResponseSchema.parse(ADMIN_STUDENTS_API_FIXTURE)
      : fetchAdminStudents(),
  });
  const isLoading = studentsQuery.isPending;
  const errorMessage = studentsQuery.isError
    ? studentsQuery.error instanceof AdminStudentsApiContractMissingError
      ? t('API_CONTRACT_UNAVAILABLE')
      : t('LOAD_ERROR')
    : null;

  const normalize = useCallback((source: readonly import('@/app/frontend_admin/admin_members/members_students/schemas/AdminMembersStudentsApiSchema').AdminStudentsApiRecord[]): AdminStudentsStudent[] => source.flatMap((student) => {
    const status: AdminStudentsStudent['status'] = ADMIN_STUDENTS_BUSINESS_STATUSES.includes(student.status as (typeof ADMIN_STUDENTS_BUSINESS_STATUSES)[number]) ? student.status as AdminStudentsStudent['status'] : 'Unknown';
    return [{ id: String(student.id), name: (typeof student.fullName === 'string' && student.fullName.trim()) || (typeof student.name === 'string' && student.name.trim()) || t('UNKNOWN_STUDENT'), phone: student.phone || '—', shift: student.shift || '—', seat: student.seat || '—', plan: student.plan || '—', joinDate: student.joinDate || '—', expiryDate: student.expiryDate || '—', status, branch: student.branch || '—', feeStatus: student.feeStatus || undefined, locker: student.locker || '—', consecutiveAbsent: student.consecutiveAbsent, totalPaid: student.totalPaid, dueFee: student.dueFee, totalPaidMinor: student.totalPaidMinor, dueFeeMinor: student.dueFeeMinor, currencyCode: student.currencyCode }];
  }), [t]);


  const students = useMemo(() => normalize(studentsQuery.data ?? []), [normalize, studentsQuery.data]);
  const setSelectedStudent = useCallback((student: AdminStudentsStudent | null) => {
    setSelectedStudentState(student);
    const next = new URLSearchParams(searchParams.toString());
    if (student) {
      next.set('view', 'detail');
      next.set('id', student.id);
    } else {
      if (next.get('view') === 'detail') next.delete('view');
      next.delete('id');
    }
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);
  useEffect(() => {
    const requestedView = searchParams.get('view');
    const requestedId = searchParams.get('id');
    if (requestedView !== 'detail' || !requestedId) {
      invalidDetailRecoveryRef.current = null;
      setSelectedStudentState(null);
      return;
    }

    const match = students.find((student) => student.id === requestedId) ?? null;
    setSelectedStudentState(match);
    if (match) {
      invalidDetailRecoveryRef.current = null;
      return;
    }
    if (!isLoading && !errorMessage) {
      // Recover from a stale/deleted detail deep link only after a successful list load.
      const queryState = searchParams.toString();
      if (invalidDetailRecoveryRef.current !== queryState) {
        invalidDetailRecoveryRef.current = queryState;
        const next = new URLSearchParams(queryState);
        next.delete('view');
        next.delete('id');
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    }
  }, [errorMessage, isLoading, pathname, router, searchParams, students]);
  const retryLoadStudents = useCallback(() => studentsQuery.refetch(), [studentsQuery.refetch]);
  const filtered = useMemo(() => students.filter((student) =>
    (selectedBranch === 'All Branches' || student.branch === selectedBranch) &&
    (statusFilter === 'All' || student.status === statusFilter) &&
    matchesAdminStudentsSearch(student, search)), [search, selectedBranch, statusFilter, students]);
  const colDefs = useAdminStudentsColumnDefinitions({ onSelectStudent: setSelectedStudent });

  return { search, setSearch, statusFilter, setStatusFilter, students, selectedStudent, setSelectedStudent, selectedBranch, filtered, colDefs, statuses: ADMIN_STUDENTS_STATUSES, isLoading, errorMessage, retryLoadStudents } as const;
}
