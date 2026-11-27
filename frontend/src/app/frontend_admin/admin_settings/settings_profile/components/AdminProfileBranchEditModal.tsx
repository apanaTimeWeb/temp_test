'use client';

// RESPONSIBILITY: AdminProfileBranchEditModal component owned by admin_settings/settings_profile.

import type { AdminProfileActiveBranch } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const BranchEditSchema = z.object({
  name: z.string().trim().min(1, 'Branch name is required').max(100),
  code: z.string().trim().min(1, 'Branch code is required').max(30),
  manager: z.string().max(100),
  phone: z.string().max(15),
  email: z.string().max(120),
  address: z.string().trim().min(1, 'Branch address is required').max(1000),
  timing: z.string().max(100),
  totalCapacity: z.coerce.number().min(1).max(1000),
  status: z.enum(['Active', 'Inactive']),
});

export type AdminBranchEditFormValues = z.infer<typeof BranchEditSchema>;

interface AdminProfileBranchEditModalProps {
  branch: AdminProfileActiveBranch | null;
  open: boolean;
  onClose: () => void;
  onSave: (branchId: string, values: AdminBranchEditFormValues) => void;
}

export function AdminProfileBranchEditModal({
  branch,
  open,
  onClose,
  onSave,
}: AdminProfileBranchEditModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<AdminBranchEditFormValues>({
    resolver: zodResolver(BranchEditSchema),
    defaultValues: {
      name: '',
      code: '',
      manager: '',
      phone: '',
      email: '',
      address: '',
      timing: '06:00 AM - 11:00 PM',
      totalCapacity: 100,
      status: 'Active',
    },
  });

  useEffect(() => {
    if (!branch) return;
    reset({
      name: branch.name,
      code: branch.code,
      manager: branch.manager,
      phone: branch.phone,
      email: branch.email,
      address: branch.address,
      timing: branch.timing || '06:00 AM - 11:00 PM',
      totalCapacity: branch.totalCapacity || 100,
      status: branch.status,
    });
  }, [branch, reset]);

  useEffect(() => {
    if (!open || !isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, open]);

  const currentStatus = watch('status');

  const submitForm = handleSubmit((values) => {
    if (!branch) return;
    onSave(branch.id, {
      ...values,
      code: values.code.trim().toUpperCase(),
    });
  });

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="max-w-xl rounded-2xl border border-border bg-overlay p-6 text-text-primary shadow-dialog">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-border-focus bg-primary-subtle p-2 text-primary">
              <Building2 size={22} aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-text-primary">
                Edit Branch Details
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-text-secondary">
                Update address, operational timings, contact phone, and total seating capacity.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={submitForm} noValidate className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="admin-branch-edit-name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Branch Name *
              </label>
              <input
                id="admin-branch-edit-name"
                maxLength={100}
                type="text"
                {...register('name')}
                aria-invalid={Boolean(errors.name)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Downtown Central"
              />
              {errors.name && <p role="alert" className="mt-1 text-xs text-danger-text">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="admin-branch-edit-code" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Branch Code *
              </label>
              <input
                id="admin-branch-edit-code"
                maxLength={30}
                type="text"
                {...register('code')}
                aria-invalid={Boolean(errors.code)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 font-mono text-sm uppercase text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. DT-CEN"
              />
              {errors.code && <p role="alert" className="mt-1 text-xs text-danger-text">{errors.code.message}</p>}
            </div>

            <div>
              <label htmlFor="admin-branch-edit-manager" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Assigned Manager
              </label>
              <input
                id="admin-branch-edit-manager"
                maxLength={100}
                type="text"
                {...register('manager')}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Vikram Singh"
              />
            </div>

            <div>
              <label htmlFor="admin-branch-edit-phone" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Contact Phone Number
              </label>
              <input
                id="admin-branch-edit-phone"
                maxLength={15}
                type="tel"
                {...register('phone')}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. +91 9876543210"
              />
            </div>

            <div>
              <label htmlFor="admin-branch-edit-timing" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Operational Timings
              </label>
              <input
                id="admin-branch-edit-timing"
                maxLength={100}
                type="text"
                {...register('timing')}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 06:00 AM - 11:00 PM"
              />
            </div>

            <div>
              <label htmlFor="admin-branch-edit-capacity" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Total Seating Capacity
              </label>
              <input
                id="admin-branch-edit-capacity"
                type="number"
                min="1"
                max="1000"
                {...register('totalCapacity')}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 150"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="admin-branch-edit-address" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Branch Address *
              </label>
              <textarea
                id="admin-branch-edit-address"
                maxLength={1000}
                rows={2}
                {...register('address')}
                aria-invalid={Boolean(errors.address)}
                className="w-full resize-none rounded-lg border border-border bg-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. 123 Main Street, Central Plaza, City"
              />
              {errors.address && <p role="alert" className="mt-1 text-xs text-danger-text">{errors.address.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Branch Status
              </span>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="branchStatus"
                    value="Active"
                    checked={currentStatus === 'Active'}
                    onChange={() => setValue('status', 'Active', { shouldDirty: true })}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium text-success-text">Active (Open for seating)</span>
                </label>
                <label className="inline-flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="branchStatus"
                    value="Inactive"
                    checked={currentStatus === 'Inactive'}
                    onChange={() => setValue('status', 'Inactive', { shouldDirty: true })}
                    className="accent-danger"
                  />
                  <span className="text-sm font-medium text-danger-text">Inactive (Temporarily closed / Suspended)</span>
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-save-branch-details-button"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors"
            >
              <Save size={16} aria-hidden="true" />
              <span>Save Changes</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
