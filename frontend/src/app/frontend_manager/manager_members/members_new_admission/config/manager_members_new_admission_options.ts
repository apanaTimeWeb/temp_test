import type { ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';
import { MANAGER_MEMBERS_DEMO_RECORDS } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryFixtures';

export const MANAGER_ADMISSION_REFERRAL_OPTIONS: ComboboxOption[] = [
  { value: 'Direct Walk-in', label: 'Direct Walk-in / Self (No Referral)', badge: 'Default' },
  ...MANAGER_MEMBERS_DEMO_RECORDS.map((r) => ({
    value: `${r.id} (${r.name})`,
    label: `${r.name} (${r.id})`,
    subLabel: `Phone: ${r.phone} · Seat: ${r.seat || 'General'}`,
    badge: r.status,
  })),
];

export const MANAGER_ADMISSION_GENDER_OPTIONS: ComboboxOption[] = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export const MANAGER_ADMISSION_PREPARATION_OPTIONS: ComboboxOption[] = [
  { value: 'UPSC Civil Services', label: 'UPSC Civil Services' },
  { value: 'State PSC', label: 'State PSC (BPSC/UPPSC/MPPSC)' },
  { value: 'SSC & Banking', label: 'SSC / Banking Exams' },
  { value: 'Medical Entrance (NEET/AIIMS)', label: 'Medical Entrance (NEET)' },
  { value: 'Engineering Entrance (JEE/GATE)', label: 'Engineering Entrance (JEE/GATE)' },
  { value: 'Chartered Accountancy (CA/CS)', label: 'Chartered Accountancy (CA/CS)' },
  { value: 'Judiciary / Law Entrance (CLAT)', label: 'Judiciary / Law Entrance (CLAT)' },
  { value: 'College Semester Studies', label: 'College Semester Studies' },
  { value: 'Other Competitive Exams', label: 'Other Competitive Exams' },
];

export const MANAGER_ADMISSION_BLOOD_GROUP_OPTIONS: ComboboxOption[] = [
  { value: '', label: 'None / Not Known' },
  { value: 'B+', label: 'B+ (Positive)' },
  { value: 'A+', label: 'A+ (Positive)' },
  { value: 'O+', label: 'O+ (Positive)' },
  { value: 'AB+', label: 'AB+ (Positive)' },
  { value: 'B-', label: 'B- (Negative)' },
  { value: 'A-', label: 'A- (Negative)' },
  { value: 'O-', label: 'O- (Negative)' },
  { value: 'AB-', label: 'AB- (Negative)' },
];

export const MANAGER_ADMISSION_FLOOR_OPTIONS: ComboboxOption[] = [
  { value: '', label: 'Select Floor (Optional)' },
  { value: '1', label: '1st Floor (General Study Hall)' },
  { value: '2', label: '2nd Floor (Silent Zone / AC)' },
  { value: '3', label: '3rd Floor (Reserved / Dedicated Cabin)' },
];

export const MANAGER_ADMISSION_SEAT_OPTIONS: ComboboxOption[] = Array.from({ length: 24 }, (_, i) => {
  const code = `S-${String(i + 1).padStart(2, '0')}`;
  return { value: code, label: `${code} (Available)`, badge: 'Available' };
});

export const MANAGER_ADMISSION_LOCKER_OPTIONS: ComboboxOption[] = [
  { value: '', label: 'No Locker Required' },
  ...Array.from({ length: 12 }, (_, i) => {
    const code = `L-${String(i + 1).padStart(2, '0')}`;
    return { value: code, label: `${code} (Available - ₹200/mo)`, badge: '₹200/mo' };
  }),
];

export const MANAGER_ADMISSION_PAYMENT_MODE_OPTIONS: ComboboxOption[] = [
  { value: 'Cash', label: 'Cash at Reception', badge: 'Counter' },
  { value: 'UPI', label: 'UPI (Google Pay / PhonePe / Paytm / QR)', badge: 'Instant' },
];
