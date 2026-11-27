export interface AdmissionDemoReferrer {
  id: string;
  name: string;
  phone: string;
  seat?: string;
  status: string;
}

export const MANAGER_MEMBERS_NEW_ADMISSION_DEMO_REFERRERS: AdmissionDemoReferrer[] = [
  { id: 'STU-001', name: 'Aarav Sharma', phone: '9876543210', seat: 'A-01', status: 'Active' },
  { id: 'STU-002', name: 'Priya Patel', phone: '9876543211', seat: 'A-04', status: 'Active' },
  { id: 'STU-003', name: 'Rohan Verma', phone: '9876543212', seat: 'B-12', status: 'Active' },
  { id: 'STU-004', name: 'Ananya Iyer', phone: '9876543213', seat: 'B-07', status: 'Expiring Soon' },
  { id: 'STU-005', name: 'Vikram Singh', phone: '9876543214', seat: 'C-02', status: 'Active' },
  { id: 'STU-006', name: 'Meera Nair', phone: '9876543215', seat: 'A-11', status: 'Active' },
];
