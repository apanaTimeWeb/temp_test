import type { HTMLAttributes, ReactNode } from 'react';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

export interface DialogCloseProps { children?: ReactNode; asChild?: boolean; className?: string; }

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface DialogDescriptionProps { children?: ReactNode; className?: string; }

export interface DialogFooterProps{children?:ReactNode;className?:string;}

export interface DialogHeaderProps{children?:ReactNode;className?:string;}

export interface DialogTitleProps { children?: ReactNode; className?: string; }

export interface DialogTriggerProps { children?: ReactNode; asChild?: boolean; className?: string; }
