'use client';

import type { AdminSettingsBranchRecord } from '@/app/frontend_admin/admin_settings/settings_branches/types/AdminSettingsBranchesTypes';
import { Clock, Edit3, MapPin, Power, Users } from 'lucide-react';

interface AdminSettingsBranchesMobileListProps {
  rows: AdminSettingsBranchRecord[];
  onEdit: (branch: AdminSettingsBranchRecord) => void;
  onToggleStatus: (branchId: string) => void;
}

export function AdminSettingsBranchesMobileList({
  rows,
  onEdit,
  onToggleStatus,
}: AdminSettingsBranchesMobileListProps) {
  return (
    <div className="space-y-3 md:hidden p-4" aria-label="Branches mobile list">
      {rows.map((branch) => {
        const isActive = branch.status === 'Active';
        return (
          <article key={branch.id} className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-text-primary text-base">{branch.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-highlight text-text-secondary border border-border">
                    {branch.code}
                  </span>
                  {branch.totalCapacity ? (
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <Users size={12} aria-hidden="true" /> {branch.totalCapacity} Seats
                    </span>
                  ) : null}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 border ${isActive ? 'bg-success-bg text-success-text border-success' : 'bg-danger-bg text-danger-text border-danger'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-success motion-safe:animate-pulse' : 'bg-danger'}`} />
                {branch.status}
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-2 text-sm text-text-secondary">
              <div>
                <dt className="text-xs text-text-secondary uppercase tracking-wide">Manager &amp; Phone</dt>
                <dd className="break-words font-medium text-text-primary flex items-center gap-2">
                  <span>{branch.manager}</span>
                  <span className="text-xs text-text-secondary">({branch.phone})</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary uppercase tracking-wide">Address</dt>
                <dd className="break-words text-text-secondary flex items-center gap-1.5">
                  <MapPin size={13} className="text-text-secondary shrink-0" aria-hidden="true" />
                  <span>{branch.address}</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary uppercase tracking-wide">Timings</dt>
                <dd className="text-text-secondary flex items-center gap-1.5">
                  <Clock size={13} className="text-text-secondary shrink-0" aria-hidden="true" />
                  <span>{branch.timing || '06:00 AM - 11:00 PM'}</span>
                </dd>
              </div>
            </dl>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => onEdit(branch)}
                data-testid={`admin-branch-edit-mobile-${branch.id}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
              >
                <Edit3 size={14} className="text-primary" aria-hidden="true" />
                <span>Edit Details</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleStatus(branch.id)}
                data-testid={`admin-branch-toggle-mobile-${branch.id}`}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold motion-safe:transition-colors ${
                  isActive ? 'border-danger bg-danger-bg text-danger-text hover:opacity-90' : 'border-success bg-success-bg text-success-text hover:opacity-90'
                }`}
              >
                <Power size={14} aria-hidden="true" />
                <span>{isActive ? 'Deactivate' : 'Activate'}</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
