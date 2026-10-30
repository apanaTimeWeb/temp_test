import type { AdminSystemAutoScaleFormValues } from '@/app/frontend_admin/admin_system/system_auto_scale/schemas/AdminSystemAutoScaleSchema';
import type { AdminSystemAutoScaleScenario } from '@/app/frontend_admin/admin_system/system_auto_scale/tests/harness/bootstrap';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export type AdminSystemAutoScaleRecommendationId = 'seats' | 'lockers';

export type AdminSystemAutoScaleRecommendationVariant2 = 'danger' | 'warning' | 'success';

export interface AdminSystemAutoScaleRecommendation {
  id: AdminSystemAutoScaleRecommendationId;
  variant: AdminSystemAutoScaleRecommendationVariant2;
  label: string;
  message: string;
  action: string | null;
  route: string | null;
}

export interface AdminSystemAutoScaleRecommendationsSectionProps {
  recommendations: readonly AdminSystemAutoScaleRecommendation[];
  onNavigate: (route: string) => void;
}

export interface AdminSystemAutoScaleThresholdsSectionProps {
  form: UseFormReturn<AdminSystemAutoScaleFormValues>;
}

export interface AdminSystemAutoScaleHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemAutoScaleScenario;
}
