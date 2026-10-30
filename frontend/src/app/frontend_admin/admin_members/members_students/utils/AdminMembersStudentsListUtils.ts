import type { AdminStudentsStudent } from '@/app/frontend_admin/admin_members/members_students/types/AdminMembersStudentsTypes';

export type AdminStudentsKpiStatus = 'Active' | 'Suspended' | 'Blocked' | 'Unknown';
export interface AdminStudentsKpiSummary {
  total: number;
  feeDue: number;
  byStatus: Record<AdminStudentsKpiStatus, number>;
}
/** Calculates branch-scoped KPIs without applying table search or status filters. */
export function getAdminStudentsKpiSummary(
  students: readonly AdminStudentsStudent[],
  selectedBranch: string,
): AdminStudentsKpiSummary {
  const branchStudents = selectedBranch === 'All Branches'
    ? students
    : students.filter((student) => student.branch === selectedBranch);
  return {
    total: branchStudents.length,
    feeDue: branchStudents.filter((student) => student.feeStatus === 'Due').length,
    byStatus: {
      Active: branchStudents.filter((student) => student.status === 'Active').length,
      Suspended: branchStudents.filter((student) => student.status === 'Suspended').length,
      Blocked: branchStudents.filter((student) => student.status === 'Blocked').length,
      Unknown: branchStudents.filter((student) => student.status === 'Unknown').length,
    },
  };
}

/** Match name and ID text normally; normalize separators only for phone-shaped queries. */
export function matchesAdminStudentsSearch(student: Pick<AdminStudentsStudent, 'name' | 'id' | 'phone'>, query: string): boolean {
  const normalizedSearch = query.trim().toLocaleLowerCase();
  if (!normalizedSearch) return true;
  if (student.name.toLocaleLowerCase().includes(normalizedSearch) || student.id.toLocaleLowerCase().includes(normalizedSearch)) return true;
  const digitsOnlyQuery = query.replace(/\D/g, '');
  const isPhoneQuery = /^[+\d\s().-]+$/.test(query.trim()) && digitsOnlyQuery.length > 0;
  return isPhoneQuery && student.phone.replace(/\D/g, '').includes(digitsOnlyQuery);

}
