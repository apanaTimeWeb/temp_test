'use client';

import type { AdminProfileActiveBranch } from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Clock,
  Edit3,
  Phone,
  Power,
  Users,
} from 'lucide-react';

export type AdminBranchSortField = 'name' | 'manager' | 'code' | 'status';

interface AdminProfileActiveBranchesTableProps {
  rows: AdminProfileActiveBranch[];
  sortField: AdminBranchSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: AdminBranchSortField) => void;
  onEdit: (branch: AdminProfileActiveBranch) => void;
  onToggleStatus: (branchId: string) => void;
}

export function AdminProfileActiveBranchesTable({
  rows,
  sortField,
  sortDirection,
  onToggleSort,
  onEdit,
  onToggleStatus,
}: AdminProfileActiveBranchesTableProps) {
  const renderSortableHeader = (field: AdminBranchSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap text-left">
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
            {renderSortableHeader('name', 'Branch')}
            {renderSortableHeader('manager', 'Manager')}
            <th scope="col" className="px-4 py-3 whitespace-nowrap text-left text-xs uppercase tracking-wider text-text-secondary font-semibold">
              Address & Timings
            </th>
            <th scope="col" className="px-4 py-3 whitespace-nowrap text-left text-xs uppercase tracking-wider text-text-secondary font-semibold">
              Capacity & Contact
            </th>
            {renderSortableHeader('status', 'Status')}
            <th scope="col" className="px-4 py-3 whitespace-nowrap text-right text-xs uppercase tracking-wider text-text-secondary font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((branch) => {
            const isActive = branch.status === 'Active';
            return (
              <tr key={branch.id} className="h-16 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-semibold text-text-primary text-sm">{branch.name}</span>
                    <span className="block text-xs font-mono text-text-secondary">{branch.code}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary font-medium">
                  <div>
                    <span>{branch.manager}</span>
                    <span className="block text-xs text-text-secondary">{branch.email}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="max-w-xs">
                    <span className="block text-xs text-text-primary line-clamp-1">{branch.address}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                      <Clock size={12} className="text-text-secondary shrink-0" aria-hidden="true" />
                      {branch.timing || '06:00 AM - 11:00 PM'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                      <Phone size={12} className="text-text-secondary shrink-0" aria-hidden="true" />
                      {branch.phone}
                    </span>
                    {branch.totalCapacity ? (
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary border border-border-focus">
                          <Users size={11} aria-hidden="true" /> {branch.totalCapacity} Seats
                        </span>
                      </div>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 border ${isActive ? 'bg-success-bg text-success-text border-success' : 'bg-danger-bg text-danger-text border-danger'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-success motion-safe:animate-pulse' : 'bg-danger'}`} />
                    {branch.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(branch)}
                      data-testid={`admin-branch-edit-${branch.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-card"
                      title="Edit branch details (address, timings, phone, capacity)"
                    >
                      <Edit3 size={13} className="text-primary" aria-hidden="true" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(branch.id)}
                      data-testid={`admin-branch-toggle-${branch.id}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 shadow-card ${
                        isActive ? 'border-danger bg-danger-bg text-danger-text hover:opacity-90 focus-visible:ring-focus-ring' : 'border-success bg-success-bg text-success-text hover:opacity-90 focus-visible:ring-focus-ring'
                      }`}
                      title={isActive ? 'Deactivate branch' : 'Activate branch'}
                    >
                      <Power size={13} aria-hidden="true" />
                      <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
