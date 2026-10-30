import type { AdminSystemProfileScenario } from '@/app/frontend_admin/admin_system/system_profile/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
}

export interface AdminSystemProfileHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemProfileScenario;
}

export type AdminSystemProfilePageLabelKey = 'STRENGTH_VERY_WEAK' | 'STRENGTH_WEAK' | 'STRENGTH_FAIR' | 'STRENGTH_GOOD' | 'STRENGTH_STRONG';
export type AdminSystemProfilePageLabelKey2 = 'STRENGTH_VERY_WEAK' | 'STRENGTH_WEAK' | 'STRENGTH_FAIR' | 'STRENGTH_GOOD' | 'STRENGTH_STRONG';
