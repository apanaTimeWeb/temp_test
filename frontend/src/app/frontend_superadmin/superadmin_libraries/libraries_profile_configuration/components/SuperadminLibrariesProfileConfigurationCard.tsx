/** Responsibility: SuperadminLibrariesProfileConfigurationCard; module-owned presentation component for libraries_profile_configuration. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesProfileConfigurationCard formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */

import React from 'react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/utils/SuperadminLibrariesProfileConfigurationClassNameUtilities';
import type { SuperadminSystemCardProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_profile_configuration/types/SuperadminLibrariesProfileConfigurationCardComponentTypes';

/**
 * Performs the superadmin libraries profile configuration card operation within libraries profile configuration; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemCardProps.
 */
export function SuperadminLibrariesProfileConfigurationCard({ children, className }: SuperadminSystemCardProps) {
  return (
    <div
      className={cn(
        'sys-card rounded-2xl border border-indigo-500/20 bg-card/85 backdrop-blur-md shadow-xl shadow-black/20 p-6 transition-all hover:border-indigo-500/35 overflow-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('border-b border-indigo-500/15 pb-4 mb-5', className)}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-base font-semibold text-slate-100', className)}>{children}</h3>;
}

export function CardDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-xs text-slate-400 mt-0.5', className)}>{children}</p>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('pt-4 border-t border-indigo-500/15', className)}>{children}</div>;
}

export default SuperadminLibrariesProfileConfigurationCard;
