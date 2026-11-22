import { FileSearch } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import type { AdminEmptyStateProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


/** Presentational empty state; the owning feature supplies localized text and actions. */
export default function AdminEmptyState({ title, description, icon: Icon = FileSearch, action, className = '', showIcon = true, testId, iconTestId, titleTestId }: AdminEmptyStateProps) {
  return <div data-testid={testId} className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center text-text-secondary ${className}`} role="status">{showIcon ? <div data-testid={iconTestId}><Icon size={28} strokeWidth={2} aria-hidden={true} /></div> : null}<p data-testid={titleTestId} className="mt-3 font-medium text-text-primary">{title}</p><p className="mt-1 text-sm">{description}</p>{action ? <div className="mt-4">{action}</div> : null}</div>;
}


export type { AdminEmptyStateProps };
