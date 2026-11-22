import type { ComboboxOption } from '@/components/ui/combobox/SearchableCombobox';

export const ADMIN_MEMBERS_SHIFT_OPTIONS: ComboboxOption[] = [
  { value: 'Morning', label: 'Morning (06:00 - 12:00)', badge: 'M' },
  { value: 'Afternoon', label: 'Afternoon (12:00 - 17:00)', badge: 'A' },
  { value: 'Evening', label: 'Evening (17:00 - 22:00)', badge: 'E' },
  { value: 'Night', label: 'Night (22:00 - 06:00)', badge: 'N' },
  { value: 'Full Day', label: 'Full Day 24/7 (06:00 - 22:00+)', badge: 'FD' },
];

export const ADMIN_MEMBERS_PLAN_OPTIONS: ComboboxOption[] = [
  { value: 'Premium (Monthly)', label: 'Premium (Monthly)', subLabel: '₹1,500/mo' },
  { value: 'Standard (Quarterly)', label: 'Standard (Quarterly)', subLabel: '₹3,600/3mo' },
  { value: 'Premium (Yearly)', label: 'Premium (Yearly)', subLabel: '₹14,000/yr' },
  { value: 'Standard (Monthly)', label: 'Standard (Monthly)', subLabel: '₹1,000/mo' },
];

