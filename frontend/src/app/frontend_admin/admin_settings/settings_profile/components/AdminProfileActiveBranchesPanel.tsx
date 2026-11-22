'use client';

import {
ADMIN_PROFILE_ACTIVE_BRANCHES,
type AdminProfileActiveBranch,
} from '@/app/frontend_admin/admin_settings/settings_profile/mocks/AdminSettingsProfileFixtures';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AdminTablePagination } from '@/app/frontend_admin/components/ui/table/AdminTablePagination';
import {
ArrowDown,
ArrowUp,
ArrowUpDown,
Building2,
Clock,
Edit3,
MapPin,
Phone,
Power,
Save,
Search,
Users
} from 'lucide-react';
import { useMemo,useState } from 'react';
import { toast } from 'sonner';

export default function AdminProfileActiveBranchesPanel() {
  const [branches, setBranches] = useState<AdminProfileActiveBranch[]>(() => ADMIN_PROFILE_ACTIVE_BRANCHES);

  const [search, setSearch] = useState('');
  type BranchSortField = 'name' | 'manager' | 'code' | 'status';
  const [sortField, setSortField] = useState<BranchSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Edit Modal State
  const [editingBranch, setEditingBranch] = useState<AdminProfileActiveBranch | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    code: string;
    manager: string;
    phone: string;
    email: string;
    address: string;
    timing: string;
    totalCapacity: number;
    status: 'Active' | 'Inactive';
  }>({
    name: '',
    code: '',
    manager: '',
    phone: '',
    email: '',
    address: '',
    timing: '',
    totalCapacity: 100,
    status: 'Active',
  });

  const toggleSort = (field: BranchSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return branches;
    return branches.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      b.code.toLowerCase().includes(q) ||
      b.manager.toLowerCase().includes(q) ||
      (b.address ? b.address.toLowerCase().includes(q) : false) ||
      (b.phone ? b.phone.toLowerCase().includes(q) : false) ||
      (b.timing ? b.timing.toLowerCase().includes(q) : false)
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
  const visibleRows = useMemo(() => sortedRows.slice(safePage * pageSize, (safePage + 1) * pageSize), [safePage, pageSize, sortedRows]);

  // Open Edit Dialog
  const handleOpenEdit = (branch: AdminProfileActiveBranch) => {
    setEditingBranch(branch);
    setEditFormData({
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
    setIsEditModalOpen(true);
  };

  // Save Edit Changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    if (!editFormData.name.trim()) {
      toast.error('Branch name is required');
      return;
    }
    if (!editFormData.address.trim()) {
      toast.error('Branch address is required');
      return;
    }

    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== editingBranch.id) return b;
        return {
          ...b,
          name: editFormData.name.trim(),
          code: editFormData.code.trim().toUpperCase(),
          manager: editFormData.manager.trim(),
          phone: editFormData.phone.trim(),
          email: editFormData.email.trim(),
          address: editFormData.address.trim(),
          timing: editFormData.timing.trim(),
          totalCapacity: Number(editFormData.totalCapacity) || 0,
          status: editFormData.status,
        };
      })
    );

    toast.success(`Branch "${editFormData.name.trim()}" details updated successfully`);
    setIsEditModalOpen(false);
    setEditingBranch(null);
  };

  // Toggle Branch Status (Deactivate / Activate)
  const handleToggleBranchStatus = (branchId: string) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id !== branchId) return b;
        const newStatus: 'Active' | 'Inactive' = b.status === 'Active' ? 'Inactive' : 'Active';
        if (newStatus === 'Inactive') {
          toast.success(`Branch "${b.name}" deactivated successfully. New seat allocations paused.`);
        } else {
          toast.success(`Branch "${b.name}" activated successfully.`);
        }
        return { ...b, status: newStatus };
      })
    );
  };

  const totalActive = useMemo(() => branches.filter((b) => b.status === 'Active').length, [branches]);
  const totalInactive = useMemo(() => branches.filter((b) => b.status === 'Inactive').length, [branches]);

  const renderSortableHeader = (field: BranchSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-4 py-3 whitespace-nowrap text-left">
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
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
            <ArrowUpDown className="text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Branches Table Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md">
        <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Library Branches</h2>
              <p className="text-xs text-slate-400">Manage branch details, timings, capacity, and active status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300">
              Total: <strong className="text-white">{branches.length}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400">
              Active: <strong>{totalActive}</strong>
            </span>
            {totalInactive > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400">
                Inactive: <strong>{totalInactive}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input maxLength={100}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search branches by name, code, manager, address, phone..."
              aria-label="Search branches"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {!rows.length ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 p-12 text-center text-slate-400 m-4">
            <Building2 size={36} className="text-slate-600 mb-2" />
            <p className="font-medium text-slate-200">No branches found</p>
            <p className="mt-1 text-sm text-slate-400">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="space-y-3 md:hidden p-4" aria-label="Branches mobile list">
              {visibleRows.map((branch) => {
                const isActive = branch.status === 'Active';
                return (
                  <article key={branch.id} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-white text-base">{branch.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {branch.code}
                          </span>
                          {branch.totalCapacity ? (
                            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                              <Users size={12} /> {branch.totalCapacity} Seats
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {branch.status}
                      </span>
                    </div>

                    <dl className="grid grid-cols-1 gap-2 text-sm text-slate-300">
                      <div>
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">Manager & Phone</dt>
                        <dd className="break-words font-medium text-slate-200 flex items-center gap-2">
                          <span>{branch.manager}</span>
                          <span className="text-xs text-slate-400">({branch.phone})</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">Address</dt>
                        <dd className="break-words text-slate-300 flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-500 shrink-0" />
                          <span>{branch.address}</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">Timings</dt>
                        <dd className="text-slate-300 flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-500 shrink-0" />
                          <span>{branch.timing || '06:00 AM - 11:00 PM'}</span>
                        </dd>
                      </div>
                    </dl>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(branch)}
                        data-testid={`admin-branch-edit-mobile-${branch.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
                      >
                        <Edit3 size={14} className="text-primary" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleBranchStatus(branch.id)}
                        data-testid={`admin-branch-toggle-mobile-${branch.id}`}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold active:scale-95 transition-all ${
                          isActive
                            ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Power size={14} />
                        <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="h-12 bg-slate-950/70 uppercase text-xs text-slate-400 font-semibold border-b border-slate-800">
                    {renderSortableHeader('name', 'Branch')}
                    {renderSortableHeader('manager', 'Manager')}
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-left text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Address & Timings
                    </th>
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-left text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Capacity & Contact
                    </th>
                    {renderSortableHeader('status', 'Status')}
                    <th scope="col" className="px-4 py-3 whitespace-nowrap text-right text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {visibleRows.map((branch) => {
                    const isActive = branch.status === 'Active';
                    return (
                      <tr key={branch.id} className="h-16 border-b border-slate-800/60 text-slate-200 motion-safe:transition-colors hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div>
                            <span className="font-semibold text-slate-100 text-sm">{branch.name}</span>
                            <span className="block text-xs font-mono text-slate-400">{branch.code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-medium">
                          <div>
                            <span>{branch.manager}</span>
                            <span className="block text-xs text-slate-500">{branch.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div className="max-w-xs">
                            <span className="block text-xs text-slate-200 line-clamp-1">{branch.address}</span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <Clock size={12} className="text-slate-500 shrink-0" />
                              {branch.timing || '06:00 AM - 11:00 PM'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-300">
                              <Phone size={12} className="text-slate-500 shrink-0" />
                              {branch.phone}
                            </span>
                            {branch.totalCapacity ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  <Users size={11} /> {branch.totalCapacity} Seats
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                            {branch.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(branch)}
                              data-testid={`admin-branch-edit-${branch.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
                              title="Edit branch details (address, timings, phone, capacity)"
                            >
                              <Edit3 size={13} className="text-primary" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleBranchStatus(branch.id)}
                              data-testid={`admin-branch-toggle-${branch.id}`}
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 shadow-xs ${
                                isActive
                                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 focus-visible:ring-rose-500'
                                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 focus-visible:ring-emerald-500'
                              }`}
                              title={isActive ? 'Deactivate branch' : 'Activate branch'}
                            >
                              <Power size={13} />
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

      {/* Edit Branch Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsEditModalOpen(false);
            setEditingBranch(null);
          }
        }}
      >
        <DialogContent className="max-w-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 rounded-2xl">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Building2 size={22} />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  Edit Branch Details
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  Update address, operational timings, contact phone, and total seating capacity.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Branch Name *
                </label>
                <input maxLength={100}
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Downtown Central"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Branch Code *
                </label>
                <input maxLength={30}
                  type="text"
                  required
                  value={editFormData.code}
                  onChange={(e) => setEditFormData({ ...editFormData, code: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. DT-CEN"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Assigned Manager
                </label>
                <input maxLength={100}
                  type="text"
                  value={editFormData.manager}
                  onChange={(e) => setEditFormData({ ...editFormData, manager: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. Vikram Singh"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Contact Phone Number
                </label>
                <input maxLength={15}
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. +91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Operational Timings
                </label>
                <input maxLength={100}
                  type="text"
                  value={editFormData.timing}
                  onChange={(e) => setEditFormData({ ...editFormData, timing: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 06:00 AM - 11:00 PM"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Total Seating Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={editFormData.totalCapacity}
                  onChange={(e) => setEditFormData({ ...editFormData, totalCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g. 150"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Branch Address *
                </label>
                <textarea maxLength={1000}
                  rows={2}
                  required
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-700 bg-slate-800 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="e.g. 123 Main Street, Central Plaza, City"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Branch Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="branchStatus"
                      value="Active"
                      checked={editFormData.status === 'Active'}
                      onChange={() => setEditFormData({ ...editFormData, status: 'Active' })}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-emerald-400">Active (Open for seating)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="branchStatus"
                      value="Inactive"
                      checked={editFormData.status === 'Inactive'}
                      onChange={() => setEditFormData({ ...editFormData, status: 'Inactive' })}
                      className="text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-rose-400">Inactive (Temporarily closed / Suspended)</span>
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingBranch(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="admin-save-branch-details-button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
