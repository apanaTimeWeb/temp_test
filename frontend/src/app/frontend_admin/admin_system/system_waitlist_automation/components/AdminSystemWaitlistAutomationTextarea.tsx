'use client';
// RESPONSIBILITY: AdminSystemTextarea component owned by admin_system; responsibility folder: admin_system_textarea.

import { type TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/frontend_admin/admin_system/system_waitlist_automation/utils/AdminSystemWaitlistAutomationUtils';
import type { AdminSystemTextareaProps } from '@/app/frontend_admin/admin_system/system_waitlist_automation/types/AdminSystemWaitlistAutomationComponentTypes';


const AdminSystemTextarea = forwardRef<HTMLTextAreaElement, AdminSystemTextareaProps>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn('min-h-24 w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60', className)} {...props} />,
);

AdminSystemTextarea.displayName = 'AdminSystemTextarea';
export { AdminSystemTextarea };
export default AdminSystemTextarea;


export type { AdminSystemTextareaProps };
