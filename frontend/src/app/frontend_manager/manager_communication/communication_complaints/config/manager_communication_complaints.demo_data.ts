/** Runtime demo fallback payloads and student lookup list for communication_complaints. */
export const MANAGER_COMPLAINTS_DEMO_API_FIXTURES = [
  { id: 'test-complaint-001', subject: 'AC Water Leakage', description: 'Water is dripping from the AC unit directly onto desk workspace.', createdAt: '2026-10-14', status: 'open', student: 'Aman Verma', phone: '9876543210', seatTag: 'Seat S-14 (Hall A)', priority: 'Urgent' as const },
  { id: 'test-complaint-002', subject: 'Wi-Fi Signal Drop', description: '5GHz Wi-Fi disconnecting intermittently during study hours.', createdAt: '2026-10-15', status: 'in_progress', student: 'Pooja Sharma', phone: '9876543211', seatTag: 'Discussion Room 2', priority: 'Normal' as const },
  { id: 'test-complaint-003', subject: 'Noise & Whispering', description: 'Loud conversation near reading cubicles.', createdAt: '2026-10-16', status: 'resolved', student: 'Rohan Gupta', phone: '9876543212', seatTag: 'Seat S-08 (Silent Zone)', priority: 'Normal' as const },
  { id: 'test-complaint-004', subject: 'Broken Desk Armrest', description: 'Chair tilt mechanism jammed and armrest wobbling.', createdAt: '2026-10-17', status: 'open', student: 'Neha Singh', phone: '9876543213', seatTag: 'Seat S-22 (Row 3)', priority: 'Normal' as const },
];

export const MANAGER_COMPLAINTS_DEMO_MEMBERS = [
  { id: 'LIB-001', name: 'Rahul Sharma', phone: '9876543210', seat: 'S-01', shift: 'Morning', status: 'Active' },
  { id: 'LIB-002', name: 'Priya Verma', phone: '9876543211', seat: 'S-14', shift: 'Morning', status: 'Expired' },
  { id: 'LIB-003', name: 'Amit Kumar', phone: '9876543212', seat: 'S-08', shift: 'Evening', status: 'Suspended' },
  { id: 'LIB-004', name: 'Sneha Patel', phone: '9876543213', seat: 'S-22', shift: 'Morning', status: 'Active' },
  { id: 'LIB-005', name: 'Vikas Mishra', phone: '9876543214', seat: 'S-05', shift: 'Full Day', status: 'Active' },
  { id: 'LIB-006', name: 'Ananya Gupta', phone: '9876543215', seat: 'S-11', shift: 'Morning', status: 'Active' },
  { id: 'LIB-007', name: 'Rohan Mehra', phone: '9876543216', seat: 'S-19', shift: 'Night', status: 'Expired' },
  { id: 'LIB-008', name: 'Pooja Reddy', phone: '9876543217', seat: 'S-02', shift: 'Full Day', status: 'Active' },
] as const;
