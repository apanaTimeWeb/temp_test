'use client';

import { AdminProfileActiveBranchesMobileList } from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileActiveBranchesMobileList';
import {
  AdminProfileActiveBranchesTable,
  type AdminBranchSortField,
} from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileActiveBranchesTable';
import {
  AdminProfileBranchEditModal,
  type AdminBranchEditFormValues,
} from '@/app/frontend_admin/admin_settings/settings_profile/components/AdminProfileBranchEditModal';
import {
  ADMIN_PROFILE_ACTIVE_BRANCHES,
  type AdminProfileActiveBranch,
} from '@/app/frontend_admin/admin_settings/settings_profile/config/admin_settings_profile.demo_data';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import { Building2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function AdminProfileActiveBranchesPanel() {
  const [branches, setBranches] = useState<AdminProfileActiveBranch[]>(() => ADMIN_PROFILE_ACTIVE_BRANCHES);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<AdminBranchSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [editingBranch, setEditingBranch] = useState<AdminProfileActiveBranch | null>(null);

  const toggleSort = (field: AdminBranchSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q) ||
        (b.address ? b.address.toLowerCase().includes(q) : false) ||
        (b.phone ? b.phone.toLowerCase().includes(q) : false) ||
        (b.timing ? b.timing.toLowerCase().includes(q) : false),
    );
  }, [branches, search]);

  const sortedRows = useMemo(() => {
    if (!sortField) return rows;
    return [...rows].sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const visibleRows = useMemo(
    () => sortedRows.slice(safePage * pageSize, (safePage + 1) * pageSize),
    [safePage, pageSize, sortedRows],
  );

  const handleSaveEdit = (branchId: string, values: AdminBranchEditFormValues) => {
    setBranches((prev) =>
      prev.map((b) =>
        b.id === branchId
          ? {
              ...b,
              name: values.name,
              code: values.code,
              manager: values.manager.trim(),
              phone: values.phone.trim(),
              email: values.email.trim(),
              address: values.address,
              timing: values.timing.trim(),
              totalCapacity: Number(values.totalCapacity) || 0,
              status: values.status,
            }
          : b,
      ),
    );
    toast.success(`Branch "${values.name}" details updated successfully`, { id: `admin-branch-save-${branchId}` });
    setEditingBranch(null);
  };

  const handleToggleBranchStatus = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b;
        const newStatus: 'Active' | 'Inactive' = b.status === 'Active' ? 'Inactive' : 'Active';
        toast.success(
          newStatus === 'Inactive'
            ? `Branch "${b.name}" deactivated successfully. New seat allocations paused.`
            : `Branch "${b.name}" activated successfully.`,
          { id: `admin-branch-toggle-${branchId}` },
        );
        return { ...b, status: newStatus };
      }),
    );
  };

  const totalActive = useMemo(() => branches.filter((b) => b.status === 'Active').length, [branches]);
  const totalInactive = useMemo(() => branches.filter((b) => b.status === 'Inactive').length, [branches]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="p-5 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl border border-success bg-success-bg text-success-text">
              <Building2 size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Library Branches</h2>
              <p className="text-xs text-text-secondary">Manage branch details, timings, capacity, and active status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-highlight px-3 py-1.5 text-xs font-semibold text-text-secondary">
              Total: <strong className="text-text-primary">{branches.length}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-1.5 text-xs font-semibold text-success-text">
              Active: <strong>{totalActive}</strong>
            </span>
            {totalInactive > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-danger bg-danger-bg px-3 py-1.5 text-xs font-semibold text-danger-text">
                Inactive: <strong>{totalInactive}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-surface-highlight">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
            <input
              maxLength={100}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search branches by name, code, manager, address, phone..."
              aria-label="Search branches"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {!rows.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center text-text-secondary m-4">
            <Building2 size={36} className="text-text-disabled mb-2" aria-hidden="true" />
            <p className="font-medium text-text-primary">No branches found</p>
            <p className="mt-1 text-sm text-text-secondary">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <AdminProfileActiveBranchesMobileList
              rows={visibleRows}
              onEdit={setEditingBranch}
              onToggleStatus={handleToggleBranchStatus}
            />

            <AdminProfileActiveBranchesTable
              rows={visibleRows}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              onEdit={setEditingBranch}
              onToggleStatus={handleToggleBranchStatus}
            />

            <AdminTablePagination
              page={safePage}
              pageSize={pageSize}
              totalRows={sortedRows.length}
              onPageChange={setPage}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setPage(0);
              }}
              labels={{ results: '' }}
            />
          </>
        )}
      </section>

      <AdminProfileBranchEditModal
        branch={editingBranch}
        open={editingBranch !== null}
        onClose={() => setEditingBranch(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
