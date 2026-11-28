export const SHIFT_TABS = [
  { value: 'All', labelKey: 'shift_tab_all' },
  { value: 'Morning', labelKey: 'shift_tab_morning' },
  { value: 'Afternoon', labelKey: 'shift_tab_afternoon' },
  { value: 'Evening', labelKey: 'shift_tab_evening' },
  { value: 'Night', labelKey: 'shift_tab_night' },
  { value: 'Full Day', labelKey: 'shift_tab_full_day' },
] as const;

export const LEGEND_ITEMS = [
  { cls: 'ss-legend-dot--success', labelKey: 'legend_free' },
  { cls: 'ss-legend-dot--danger', labelKey: 'legend_occupied' },
  { cls: 'ss-legend-dot--warning', labelKey: 'legend_expiring_within_7_days' },
  { cls: 'ss-legend-dot--maintenance', labelKey: 'legend_maintenance' },
] as const;

export const SHIFT_BADGE: Record<string, string> = {
  Morning:   'ss-badge ss-badge--primary',
  Afternoon: 'ss-badge ss-badge--warning',
  Evening:   'ss-badge ss-badge--success',
  Night:     'ss-badge ss-badge--purple',
  'Full Day': 'ss-badge ss-badge--info',
};

export interface RegisteredStudentCandidate {
  id: string;
  name: string;
  smartId: string;
  phone: string;
  preferredShift: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'Full Day';
  exam: string;
  gender: 'Male' | 'Female';
}

export const REGISTERED_STUDENT_CANDIDATES: RegisteredStudentCandidate[] = [
  { id: 'STU-001', name: 'Alex Rivera', smartId: 'LIB-88429', phone: '9876543210', preferredShift: 'Morning', exam: 'UPSC Civil Services', gender: 'Male' },
  { id: 'STU-002', name: 'Priya Sharma', smartId: 'LIB-00234', phone: '9812345678', preferredShift: 'Evening', exam: 'State PSC & SSC', gender: 'Female' },
  { id: 'STU-003', name: 'Rohan Mehta', smartId: 'LIB-00567', phone: '9823456789', preferredShift: 'Full Day', exam: 'NEET / Medical', gender: 'Male' },
  { id: 'STU-004', name: 'Neha Gupta', smartId: 'LIB-00891', phone: '9834567890', preferredShift: 'Morning', exam: 'Chartered Accountancy', gender: 'Female' },
  { id: 'STU-005', name: 'Amit Verma', smartId: 'LIB-01243', phone: '9845678901', preferredShift: 'Afternoon', exam: 'GATE / Engineering', gender: 'Male' },
  { id: 'STU-006', name: 'Pooja Singh', smartId: 'LIB-01582', phone: '9856789012', preferredShift: 'Evening', exam: 'Banking & PO', gender: 'Female' },
  { id: 'STU-007', name: 'Rahul Sharma', smartId: 'LIB-02104', phone: '9867890123', preferredShift: 'Night', exam: 'Judiciary Exams', gender: 'Male' },
  { id: 'STU-008', name: 'Kavita Yadav', smartId: 'LIB-02755', phone: '9878901234', preferredShift: 'Morning', exam: 'Civil Services', gender: 'Female' },
];
