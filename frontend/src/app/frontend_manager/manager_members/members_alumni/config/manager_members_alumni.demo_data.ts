import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';

export interface AlumniDemoStudentOption {
  id: string;
  name: string;
  phone: string;
  seat?: string;
  status: string;
  department?: string;
  preparationFor?: string;
  locker?: string;
  securityDeposit?: number;
}

export const MANAGER_MEMBERS_ALUMNI_DEMO_STUDENTS: AlumniDemoStudentOption[] = [
  { id: 'LIB-1001', name: 'Aarav Sharma', phone: '9876543210', seat: 'A-01', status: 'Active', department: 'UPSC Civil Services', locker: 'L-01' },
  { id: 'LIB-1002', name: 'Priya Patel', phone: '9876543211', seat: 'A-04', status: 'Active', preparationFor: 'NEET PG', securityDeposit: 500 },
  { id: 'LIB-1003', name: 'Rohan Verma', phone: '9876543212', seat: 'B-12', status: 'Active', department: 'SSC CGL' },
  { id: 'LIB-1004', name: 'Ananya Iyer', phone: '9876543213', seat: 'B-07', status: 'Expiring Soon', department: 'GATE Computer Science', locker: 'L-04' },
  { id: 'LIB-1005', name: 'Vikram Singh', phone: '9876543214', seat: 'C-02', status: 'Active', department: 'CA Final' },
  { id: 'LIB-1006', name: 'Meera Nair', phone: '9876543215', seat: 'A-11', status: 'Active', department: 'RBI Grade B' },
];

export const MANAGER_MEMBERS_ALUMNI_DEMO_RECORDS: MembersAlumniRow[] = [
  { id: 'ALM-001', name: 'Rahul Sharma', phone: '9876543210', leftDate: '2025-08-15', duration: '14 Months', exam: 'UPSC Civil Services', designation: 'AIR 142 (IAS)', testimonial: 'The silent 14-hr air-conditioned library environment was key to my consistency.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-002', name: 'Neha Gupta', phone: '9876543211', leftDate: '2024-11-20', duration: '8 Months', exam: 'SBI Probationary Officer', designation: 'Probationary Officer (Scale I)', testimonial: 'Regular test series practice at designated silent desk helped me clear prelims & mains.', currentStatus: 'Employed', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-003', name: 'Aman Verma', phone: '9876543212', leftDate: '2025-05-10', duration: '18 Months', exam: 'CA Final Both Groups', designation: 'Chartered Accountant', testimonial: 'Uninterrupted power & high-speed wifi made virtual classes completely seamless.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Settled', depositAmount: 500 },
  { id: 'ALM-004', name: 'Ritu Saxena', phone: '9876543213', leftDate: '2024-09-30', duration: '12 Months', exam: 'UPPSC', designation: 'Sub-Divisional Magistrate (SDM)', testimonial: 'Discipline in the study hall kept me focused through the long preparation months.', currentStatus: 'Cleared Exam', depositSettlementStatus: 'Refunded', depositAmount: 1000 },
  { id: 'ALM-005', name: 'Deepak Patel', phone: '9876543214', leftDate: '2025-03-12', duration: '6 Months', exam: 'GATE Computer Science', designation: 'AIR 89 (M.Tech IIT-B)', testimonial: 'Excellent night shift study culture for engineering aspirants.', currentStatus: 'Higher Studies', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-006', name: 'Shweta Singh', phone: '9876543215', leftDate: '2024-07-22', duration: '16 Months', exam: 'NEET PG', designation: 'Top 500 (MD Medicine)', testimonial: 'Comfortable ergonomic chairs and sound isolation prevented physical fatigue.', currentStatus: 'Higher Studies', depositSettlementStatus: 'Refunded', depositAmount: 500 },
  { id: 'ALM-007', name: 'Vikram Mehta', phone: '9876543216', leftDate: '2025-01-18', duration: '10 Months', exam: 'RBI Grade B Officer', designation: 'Assistant Manager', testimonial: 'Best environment for focused analytical reading and economic daily reviews.', currentStatus: 'Employed', depositSettlementStatus: 'Refunded', depositAmount: 1000 },
  { id: 'ALM-008', name: 'Pooja Tiwari', phone: '9876543217', leftDate: '2024-12-05', duration: '9 Months', exam: 'SSC CGL', designation: 'Inspector (Income Tax)', testimonial: 'Always clean, well maintained, and peaceful for intense mock solving.', currentStatus: 'Employed', depositSettlementStatus: 'Held', depositAmount: 500 },
];
