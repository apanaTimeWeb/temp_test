'use client';
// RESPONSIBILITY: Own state and lifecycle for Branch Management (Module 03).
import { useState, useCallback, useMemo } from 'react';
import type { SuperadminBranchRecord, BranchAuditLog, BranchOperatingStatus } from '../types/SuperadminBranchesOverviewTypes';
import { INITIAL_BRANCHES_DATA, INITIAL_BRANCH_AUDIT_LOGS, SUPERADMIN_AVAILABLE_LIBRARIES } from '../constants/SuperadminBranchesOverviewData';

export function useSuperadminBranchesOverview() {
  const [branches, setBranches] = useState<SuperadminBranchRecord[]>(INITIAL_BRANCHES_DATA);
  const [auditLogs, setAuditLogs] = useState<BranchAuditLog[]>(INITIAL_BRANCH_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [selectedLibraryId, setSelectedLibraryId] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BranchOperatingStatus>('all');

  const recordAudit = useCallback((log: Omit<BranchAuditLog, 'id' | 'timestamp'>) => {
    const newLog: BranchAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const createBranch = useCallback((data: Omit<SuperadminBranchRecord, 'id' | 'createdAt' | 'status'>): { success: boolean; error?: string } => {
    const parentLib = SUPERADMIN_AVAILABLE_LIBRARIES.find((l) => l.id === data.libraryId);
    if (parentLib && parentLib.currentBranchCount >= parentLib.maxBranchesAllowed) {
      return {
        success: false,
        error: `Branch limit reached: Library "${parentLib.name}" already uses ${parentLib.currentBranchCount} of ${parentLib.maxBranchesAllowed} allowed branches. Please upgrade plan or request additional quota.`,
      };
    }
    const isDuplicate = branches.some((b) => b.code.trim().toUpperCase() === data.code.trim().toUpperCase());
    if (isDuplicate) {
      return { success: false, error: `Branch Code "${data.code}" already exists. Duplicate codes are forbidden.` };
    }
    const newBranch: SuperadminBranchRecord = {
      ...data,
      id: `br-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      lastAuditAction: 'Branch Created (SuperAdmin)',
    };
    setBranches((prev) => [newBranch, ...prev]);
    recordAudit({
      branchId: newBranch.id, branchCode: newBranch.code, branchName: newBranch.name,
      action: 'CREATE', performedBy: 'SuperAdmin',
      details: `Created under tenant "${data.libraryName}" with capacity ${data.capacity}`,
    });
    return { success: true };
  }, [branches, recordAudit]);

  const updateBranch = useCallback((id: string, updates: Partial<SuperadminBranchRecord>) => {
    setBranches((prev) => prev.map((b) => b.id === id ? { ...b, ...updates, lastAuditAction: 'Details Updated' } : b));
    const target = branches.find((b) => b.id === id);
    if (target) recordAudit({ branchId: target.id, branchCode: target.code, branchName: target.name, action: 'EDIT', performedBy: 'SuperAdmin', details: 'Address, contact or operational settings updated' });
  }, [branches, recordAudit]);

  const updateStatus = useCallback((id: string, status: BranchOperatingStatus, action: BranchAuditLog['action'], details: string, reason?: string, isArchived?: boolean) => {
    setBranches((prev) => prev.map((b) => b.id === id ? { ...b, status, ...(isArchived !== undefined ? { isArchived } : {}), lastAuditAction: details } : b));
    const target = branches.find((b) => b.id === id);
    if (target) recordAudit({ branchId: target.id, branchCode: target.code, branchName: target.name, action, performedBy: 'SuperAdmin', details, reason });
  }, [branches, recordAudit]);

  const activateBranch = useCallback((id: string) => updateStatus(id, 'active', 'ACTIVATE', 'Branch operational status set to Active'), [updateStatus]);
  const suspendBranch = useCallback((id: string, reason: string) => updateStatus(id, 'suspended', 'SUSPEND', `Branch access blocked. Sibling branches unaffected.`, reason), [updateStatus]);
  const deactivateBranch = useCallback((id: string) => updateStatus(id, 'deactivated', 'DEACTIVATE', 'Branch set to operationally inactive'), [updateStatus]);

  const closeBranch = useCallback((id: string, notes: string, forceSoftwareDecommission = false): { success: boolean; error?: string } => {
    const target = branches.find((b) => b.id === id);
    if (!target) return { success: false, error: 'Branch not found' };
    if (!forceSoftwareDecommission) {
      if (target.memberDues > 0) return { success: false, error: `Cannot close branch! ₹${target.memberDues} in member dues are pending settlement.` };
    }
    updateStatus(
      id,
      'closed',
      'CLOSE',
      forceSoftwareDecommission
        ? 'SuperAdmin software decommission & manager credentials revoked'
        : 'Soft-closed without hard deletion. Records archived.',
      notes,
      true
    );
    return { success: true };
  }, [branches, updateStatus]);

  const restoreBranch = useCallback((id: string) => updateStatus(id, 'active', 'RESTORE', 'Archived branch restored to active status per policy', undefined, false), [updateStatus]);

  const transferManager = useCallback((id: string, newManager: { name: string; email: string; phone: string }, reason: string) => {
    setBranches((prev) => prev.map((b) => b.id === id ? { ...b, managerName: newManager.name, managerEmail: newManager.email, managerPhone: newManager.phone, lastAuditAction: `Manager Transferred to ${newManager.name}` } : b));
    const target = branches.find((b) => b.id === id);
    if (target) recordAudit({ branchId: target.id, branchCode: target.code, branchName: target.name, action: 'TRANSFER_MANAGER', performedBy: 'SuperAdmin', details: `Manager changed from "${target.managerName}" to "${newManager.name}"`, reason });
  }, [branches, recordAudit]);

  const changeAdmin = useCallback((id: string, newAdmin: { name: string; email: string }) => {
    setBranches((prev) => prev.map((b) => b.id === id ? { ...b, adminName: newAdmin.name, adminEmail: newAdmin.email, lastAuditAction: `Admin Assigned: ${newAdmin.name}` } : b));
    const target = branches.find((b) => b.id === id);
    if (target) recordAudit({ branchId: target.id, branchCode: target.code, branchName: target.name, action: 'CHANGE_ADMIN', performedBy: 'SuperAdmin', details: `Authorized Admin changed to "${newAdmin.name}"` });
  }, [branches, recordAudit]);

  const changePlan = useCallback((id: string, newPlan: string, capacity: number, allowedModules: Record<string, boolean>) => {
    setBranches((prev) => prev.map((b) => b.id === id ? { ...b, plan: newPlan, capacity, allowedModules, lastAuditAction: `Plan Quota Updated: ${newPlan}` } : b));
    const target = branches.find((b) => b.id === id);
    if (target) recordAudit({ branchId: target.id, branchCode: target.code, branchName: target.name, action: 'CHANGE_PLAN', performedBy: 'SuperAdmin', details: `Plan changed to "${newPlan}", Capacity: ${capacity}` });
  }, [branches, recordAudit]);

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const matchSearch = !search.trim() ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.code.toLowerCase().includes(search.toLowerCase()) ||
        b.city.toLowerCase().includes(search.toLowerCase()) ||
        b.libraryName.toLowerCase().includes(search.toLowerCase()) ||
        b.managerName.toLowerCase().includes(search.toLowerCase());
      const matchLibrary = selectedLibraryId === 'all' || b.libraryId === selectedLibraryId;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus && matchLibrary;
    });
  }, [branches, search, selectedLibraryId, statusFilter]);

  return {
    branches, filteredBranches, auditLogs, search, setSearch,
    selectedLibraryId, setSelectedLibraryId, statusFilter, setStatusFilter,
    availableLibraries: SUPERADMIN_AVAILABLE_LIBRARIES,
    createBranch, updateBranch, activateBranch, suspendBranch,
    deactivateBranch, closeBranch, restoreBranch, transferManager,
    changeAdmin, changePlan,
  };
}
