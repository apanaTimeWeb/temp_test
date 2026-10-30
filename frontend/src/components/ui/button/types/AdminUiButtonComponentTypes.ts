import type { ButtonHTMLAttributes, ReactNode, MouseEventHandler } from 'react';

export type AdminUiButtonVariant = 'default' | 'outline' | 'ghost' | 'danger' | 'destructive';

export type AdminUiButtonSize2 = 'sm' | 'default' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminUiButtonVariant;
  size?: AdminUiButtonSize2;
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  children?: ReactNode;
}

export type ButtonAsChildElementProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  tabIndex?: number;
  'aria-disabled'?: boolean | 'true' | 'false';
  'aria-busy'?: boolean | 'true' | 'false';
  children?: ReactNode;
  [attribute: string]: unknown;
};
