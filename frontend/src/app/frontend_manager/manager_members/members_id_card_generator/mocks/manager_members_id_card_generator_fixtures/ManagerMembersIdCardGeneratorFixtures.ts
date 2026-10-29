import type { ManagerStudent } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorTypes';

export const MANAGER_STUDENTS_FIXTURES: ManagerStudent[] = [
  { id: '1', smartId: 'LIB-001', name: 'Alex Rivera', phone: '+91 98765 43210', status: 'Active', shift: 'Morning', seat: 'S-01', branch: 'Main Branch', plan: 'Monthly', dueMinor: 0, currency: 'INR', joined: '01/01/2024' },
  { id: '2', smartId: 'LIB-002', name: 'Priya Sharma', phone: '+91 98765 43211', status: 'Active', shift: 'Evening', seat: 'S-11', branch: 'Main Branch', plan: 'Quarterly', dueMinor: 150000, currency: 'INR', joined: '15/02/2024' },
  { id: '3', smartId: 'LIB-003', name: 'Rohan Mehta', phone: '+91 98765 43212', status: 'Suspended', shift: 'Morning', seat: 'S-22', branch: 'Main Branch', plan: 'Half-Yearly', dueMinor: 50000, currency: 'INR', joined: '10/03/2024' },
  { id: '4', smartId: 'LIB-004', name: 'Sam Taylor', phone: '+91 98765 43213', status: 'Expired', shift: 'Night', seat: '—', branch: 'North Branch', plan: 'Monthly', dueMinor: 0, currency: 'INR', joined: '21/04/2024' },
  { id: '5', smartId: 'LIB-005', name: 'Jordan Lee', phone: '+91 98765 43214', status: 'Active', shift: 'Afternoon', seat: 'S-30', branch: 'South Branch', plan: 'Annual', dueMinor: 225000, currency: 'INR', joined: '01/05/2024' },
];

export let managerStudentsMockState = structuredClone(MANAGER_STUDENTS_FIXTURES);

export function resetManagerIdCardGeneratorMockState() {
  managerStudentsMockState = structuredClone(MANAGER_STUDENTS_FIXTURES);
}

