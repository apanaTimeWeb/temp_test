import type { AdminSystemPowerSavingScenario } from '@/app/frontend_admin/admin_system/system_power_saving/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
}

export interface AdminSystemPowerSavingZonesSectionProps {
  threshold: number;
}

export interface AdminSystemPowerSavingHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemPowerSavingScenario;
}
