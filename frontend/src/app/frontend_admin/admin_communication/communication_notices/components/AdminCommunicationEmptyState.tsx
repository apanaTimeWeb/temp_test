'use client';

import type { AdminCommunicationEmptyStateProps } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import { SearchX } from 'lucide-react';

export function AdminCommunicationEmptyState({
  title = 'No data found',
  description = 'Try adjusting your filters.',
  testId,
  iconTestId,
  titleTestId,
}: AdminCommunicationEmptyStateProps) {
  return (
    <div data-testid={testId} role="status" className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-12 text-center text-text-secondary">
      <div data-testid={iconTestId}><SearchX aria-hidden="true" size={28} strokeWidth={2} /></div>
      <p data-testid={titleTestId} className="font-medium text-text-primary">{title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
}
export default AdminCommunicationEmptyState;
