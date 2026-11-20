'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Filter,
  GitBranch,
  MoreVertical,
  Plus,
  PowerOff,
  Search,
  ShieldAlert,
  X,
  XCircle,
} from 'lucide-react';

interface BranchItem {
  id: string;
  code: string;
  name: string;
  libraryName: string;
  libraryId: string;
  city: string;
  state: string;
  capacity: number;
  adminName: string;
  adminEmail: string;
  status: 'active' | 'suspended' | 'closed';
  createdAt: string;
}

const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: 'br-1',
    code: 'BR-DEL-01',
    name: 'Apex Connaught Place Central',
    libraryName: 'Apex Study Library Group',
    libraryId: 'lib-1',
    city: 'New Delhi',
    state: 'Delhi',
    capacity: 180,
    adminName: 'Rajesh Sharma',
    adminEmail: 'rajesh.sharma@apexlib.in',
    status: 'active',
    createdAt: '2026-01-15',
  },
  {
    id: 'br-2',
    code: 'BR-NOI-02',
    name: 'Apex Noida Sector 62 Branch',
    libraryName: 'Apex Study Library Group',
    libraryId: 'lib-1',
    city: 'Noida',
    state: 'Uttar Pradesh',
    capacity: 120,
    adminName: 'Sunita Verma',
    adminEmail: 'sunita.v@apexlib.in',
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: 'br-3',
    code: 'BR-PAT-01',
    name: 'Kankarbagh Readers Hub',
    libraryName: 'Patna Central Reading Rooms',
    libraryId: 'lib-2',
    city: 'Patna',
    state: 'Bihar',
    capacity: 90,
    adminName: 'Alok Kumar',
    adminEmail: 'alok@patnareaders.org',
    status: 'suspended',
    createdAt: '2026-03-01',
  },
  {
    id: 'br-4',
    code: 'BR-LKO-01',
    name: 'Gomti Nagar Premium Branch',
    libraryName: 'Awadh Digital Study Center',
    libraryId: 'lib-3',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    capacity: 150,
    adminName: 'Farhan Zaidi',
    adminEmail: 'farhan@awadhstudy.com',
    status: 'active',
    createdAt: '2026-04-12',
  },
  {
    id: 'br-5',
    code: 'BR-VAR-01',
    name: 'BHU Gate Scholar Wing',
    libraryName: 'Kashi Scholars Library',
    libraryId: 'lib-4',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    capacity: 60,
    adminName: 'Pooja Pandey',
    adminEmail: 'pooja@kashischolars.com',
    status: 'closed',
    createdAt: '2025-11-20',
  },
];

export default function SuperadminBranchesOverviewScreen() {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'closed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    libraryName: 'Apex Study Library Group',
    city: '',
    state: '',
    capacity: 100,
    adminName: '',
    adminEmail: '',
  });

  const filtered = branches.filter((b) => {
    const matchSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase()) ||
      b.libraryName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBranches = branches.length;
  const activeCount = branches.filter((b) => b.status === 'active').length;
  const suspendedCount = branches.filter((b) => b.status === 'suspended').length;
  const closedCount = branches.filter((b) => b.status === 'closed').length;

  const toggleStatus = (id: string, newStatus: 'active' | 'suspended' | 'closed') => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.city) return;
    const item: BranchItem = {
      id: `br-${Date.now()}`,
      code: `BR-${newBranch.city.slice(0, 3).toUpperCase()}-0${branches.length + 1}`,
      name: newBranch.name,
      libraryName: newBranch.libraryName,
      libraryId: 'lib-custom',
      city: newBranch.city,
      state: newBranch.state || 'State',
      capacity: Number(newBranch.capacity) || 100,
      adminName: newBranch.adminName || 'Admin Assigned',
      adminEmail: newBranch.adminEmail || 'branch@libraryos.io',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBranches([item, ...branches]);
    setShowCreateModal(false);
    setNewBranch({
      name: '',
      libraryName: 'Apex Study Library Group',
      city: '',
      state: '',
      capacity: 100,
      adminName: '',
      adminEmail: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <GitBranch size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                03. Branch Management
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  Multi-Tenant
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Har Library Account ke andar branches create, edit, activate, suspend aur close karna
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          Create New Branch
        </button>
      </div>

      {/* ── Stat KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-neutral-400 font-medium">Total Branches</div>
          <div className="text-2xl font-black text-white mt-1">{totalBranches}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Across all registered libraries</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Active Branches
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Operating normally</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
            <PowerOff size={13} /> Suspended
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">{suspendedCount}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Subscription or policy hold</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
            <XCircle size={13} /> Closed Branches
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">{closedCount}</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Permanently decommissioned</div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches by code, name, city, or library..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-neutral-400" />
          <span className="text-xs text-neutral-400">Status:</span>
          {(['all', 'active', 'suspended', 'closed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors capitalize ${
                statusFilter === st
                  ? 'bg-neutral-800 text-white border border-neutral-700'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── Branches Table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-neutral-900/40 text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Branch Code & Name</th>
                <th className="py-3 px-4">Owning Library Account</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Seats / Cap</th>
                <th className="py-3 px-4">Branch Admin</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-800/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{b.name}</div>
                    <div className="text-xs font-mono text-emerald-400/90">{b.code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-neutral-200">
                      <Building2 size={13} className="text-neutral-400 shrink-0" />
                      <span>{b.libraryName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {b.city}, {b.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{b.capacity}</span>
                    <span className="text-xs text-neutral-500 ml-1">seats</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-neutral-200 text-xs font-medium">{b.adminName}</div>
                    <div className="text-[11px] text-neutral-500">{b.adminEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    {b.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    )}
                    {b.status === 'suspended' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Suspended
                      </span>
                    )}
                    {b.status === 'closed' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {b.status !== 'active' && (
                        <button
                          onClick={() => toggleStatus(b.id, 'active')}
                          className="px-2 py-1 text-xs rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      {b.status === 'active' && (
                        <button
                          onClick={() => toggleStatus(b.id, 'suspended')}
                          className="px-2 py-1 text-xs rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-medium transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                      {b.status !== 'closed' && (
                        <button
                          onClick={() => toggleStatus(b.id, 'closed')}
                          className="px-2 py-1 text-xs rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-colors"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-400 text-sm">
                    No branches found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Branch Modal ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <GitBranch size={18} className="text-emerald-400" />
                Add New Library Branch
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Owning Library Account
                </label>
                <select
                  value={newBranch.libraryName}
                  onChange={(e) => setNewBranch({ ...newBranch, libraryName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Apex Study Library Group">Apex Study Library Group</option>
                  <option value="Patna Central Reading Rooms">Patna Central Reading Rooms</option>
                  <option value="Awadh Digital Study Center">Awadh Digital Study Center</option>
                  <option value="Kashi Scholars Library">Kashi Scholars Library</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Extension Branch"
                  value={newBranch.name}
                  onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi"
                    value={newBranch.city}
                    onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi"
                    value={newBranch.state}
                    onChange={(e) => setNewBranch({ ...newBranch, state: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newBranch.capacity}
                    onChange={(e) => setNewBranch({ ...newBranch, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Branch Admin Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Batra"
                    value={newBranch.adminName}
                    onChange={(e) => setNewBranch({ ...newBranch, adminName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Branch Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin.branch@libraryos.io"
                  value={newBranch.adminEmail}
                  onChange={(e) => setNewBranch({ ...newBranch, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-border text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                >
                  Create Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
