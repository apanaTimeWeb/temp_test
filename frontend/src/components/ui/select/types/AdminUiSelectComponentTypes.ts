import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  disabled?: boolean;
}

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  dataAttributes: Record<string, string | number>;
}

export interface SelectContentProps {
  children?: ReactNode;
  /** Additional classes applied to the native select control by the owning Select primitive. */
  className?: string;
}

export interface SelectItemProps {
  value: string;
  children?: ReactNode;
  disabled?: boolean;
  [key: `data-${string}`]: string | number | undefined;
}

export interface SelectTriggerProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export interface SelectValueProps {
  placeholder?: string;
}
