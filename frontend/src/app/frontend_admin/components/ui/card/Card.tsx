import type { HTMLAttributes, ReactNode } from 'react';
import type { CardProps } from '@/app/frontend_admin/components/ui/card/types/AdminUiCardComponentTypes';


export function Card({ className = '', children, ...props }: CardProps) { return <div className={`rounded-lg border border-border bg-card shadow-card ${className}`} {...props}>{children}</div>; }
export default Card;


export type { CardProps };
