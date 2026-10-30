import type { ButtonHTMLAttributes, ComponentType, ReactNode, HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react';

export type AdminSystemBadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "info" | "outline";

export interface AdminSystemBadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?: AdminSystemBadgeVariant; }

export type AdminSystemButtonVariant = "primary" | "ghost" | "destructive" | "secondary" | "link";

export type AdminUiAdminPrimitivesSize = "sm" | "md" | "lg" | "icon";

export interface AdminSystemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: AdminSystemButtonVariant; size?: AdminUiAdminPrimitivesSize; }

export interface AdminSystemCardProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; }

export interface AdminSystemCardContentProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; }

export interface AdminSystemCardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { children?: ReactNode; }

export interface AdminSystemCardFooterProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; }

export interface AdminSystemCardHeaderProps extends HTMLAttributes<HTMLDivElement> { children?: ReactNode; }

export interface AdminSystemCardTitleProps extends HTMLAttributes<HTMLHeadingElement> { children?: ReactNode; }

export interface AdminEmptyStateProps { title: string; description: string; icon?: ComponentType<any>; action?: ReactNode; className?: string; showIcon?: boolean; testId?: string; iconTestId?: string; titleTestId?: string; }

export interface AdminErrorBoundaryProps { children: ReactNode; title: string; description: string; retryLabel: string; className?: string; resetKeys?: readonly unknown[]; onReset?: () => void; }

export interface AdminErrorBoundaryState { hasError: boolean; resetGeneration: number; }

export interface AdminSystemInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export type AdminSystemKpiCardTrend = 'up' | 'down' | 'neutral';

export interface AdminSystemKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: AdminSystemKpiCardTrend;
  trendLabel?: string;
  className?: string;
}

export interface AdminSystemLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export interface AdminSystemSwitchProps {
  checked?: boolean; onCheckedChange?: (checked: boolean) => void; disabled?: boolean; id?: string;
  'aria-label'?: string; 'aria-labelledby'?: string; className?: string;
}
