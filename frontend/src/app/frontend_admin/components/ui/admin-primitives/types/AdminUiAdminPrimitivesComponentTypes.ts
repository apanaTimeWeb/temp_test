import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface AdminEmptyStateProps { title: string; description: string; icon?: LucideIcon; action?: ReactNode; className?: string; showIcon?: boolean; testId?: string; iconTestId?: string; titleTestId?: string; }

export interface AdminErrorBoundaryProps { children: ReactNode; title: string; description: string; retryLabel: string; className?: string; resetKeys?: readonly unknown[]; onReset?: () => void; }

export interface AdminErrorBoundaryState { hasError: boolean; resetGeneration: number; }

export type AdminSystemKpiCardTrend = 'up' | 'down' | 'neutral';

export interface AdminSystemKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: AdminSystemKpiCardTrend;
  trendLabel?: string;
  className?: string;
}
