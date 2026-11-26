'use client';

import { toast } from 'sonner';
/** Responsibility: renders the superadmin_users overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminUsersDirectoryPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useCallback, useState, useMemo } from 'react';
import type { SuperadminUserData, SuperadminUsersStatus } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import type { SuperadminUsersFormValues } from '@/app/frontend_superadmin/superadmin_users/users_directory/schemas/SuperadminUsersDirectorySchema';
import { SUPERADMIN_USERS_INITIAL_USERS, SUPERADMIN_USERS_ROLE_PERMISSIONS } from '@/app/frontend_superadmin/superadmin_users/users_directory/mocks/fixtures/SuperadminUsersDirectoryMockFixtures';
import SuperadminUsersDirectoryContent from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryContent';
import SuperadminUsersDirectoryModal from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryModal';
import SuperadminUsersBulkWhatsAppModal from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersBulkWhatsAppModal';
import {
  downloadSuperadminUsersCsv,
  downloadSuperadminUsersExcel,
  printSuperadminUsersRoster,
} from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryExportUtils';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS } from '@/app/frontend_superadmin/superadmin_users/users_directory/constants/SuperadminUsersDirectoryStaticConstants';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryMaskSensitiveData';
import { useUsersDirectoryColumns } from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryColumns';
import SuperadminUsersDirectoryHeroControls from '@/app/frontend_superadmin/superadmin_users/users_directory/components/SuperadminUsersDirectoryHeroControls';

export default function SuperadminUsersDirectoryPageClient() {
  const t = useTranslations('SUPERADMIN_USERS');

  const [activeTab] = useState<'All Users' | 'Roles & Permissions'>('All Users');
  const [users, setUsers] = useState<SuperadminUserData[]>(SUPERADMIN_USERS_INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [showBulkWhatsApp, setShowBulkWhatsApp] = useState(false);
  const [editUser, setEditUser] = useState<SuperadminUserData | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'SuperAdmin' | 'Admin' | 'Manager'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');
  const [twoFactorFilter, setTwoFactorFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');

  const showToast = useCallback((msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_users:SuperadminUsersDirectoryPageClient:feedback' });
  }, []);

  const handleOpenEdit = useCallback((user: SuperadminUserData) => {
    setEditUser(user);
    setShowModal(true);
  }, []);

  const handleSave = useCallback(
    (formData: SuperadminUsersFormValues) => {
      if (editUser) {
        setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...formData } : u)));
        showToast(`User ${formData.name} updated successfully!`);
      } else {
        const newUser: SuperadminUserData = {
          id: `usr-${Date.now()}`,
          name: formData.name,
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          role: formData.role,
          branch: formData.branch || 'Headquarters Central',
          twoFactor: formData.twoFactor ?? false,
          status: 'Active',
          lastLogin: 'Never',
          phone: '+91 98765 43210',
        };
        setUsers((prev) => [newUser, ...prev]);
        showToast(`User invitation created and sent to ${formData.email}!`);
      }
      setShowModal(false);
      setEditUser(null);
    },
    [editUser, showToast]
  );

  const toggleStatus = useCallback(
    (id: string, current: SuperadminUsersStatus) => {
      const nextStatus: SuperadminUsersStatus = current === 'Active' ? 'Suspended' : 'Active';
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
      showToast(`Account status updated to ${nextStatus}.`);
    },
    [showToast]
  );

  const handleResetPassword = useCallback(
    (name: string) => {
      showToast(`Password reset link dispatched for ${name} successfully!`);
    },
    [showToast]
  );

  const handleQuickWhatsApp = useCallback(
    (user: SuperadminUserData) => {
      const rawPhone = user.phone || '9876543210';
      let digits = rawPhone.replace(/\D/g, '');
      if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
      const phone = digits.length === 10 ? `91${digits}` : digits;
      const msg = `Hello ${user.name}, greetings from Smart Library SuperAdmin!`;
      const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      if (popup) popup.opener = null;
      showToast(`Opened WhatsApp chat for ${user.name}`);
    },
    [showToast]
  );

  const availableBranches = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => {
      if (u.branch) set.add(u.branch);
    });
    return Array.from(set);
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      if (twoFactorFilter === 'enabled' && !user.twoFactor) return false;
      if (twoFactorFilter === 'disabled' && user.twoFactor) return false;
      if (branchFilter !== 'all' && user.branch.toLowerCase() !== branchFilter.toLowerCase()) return false;
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesUsername = user.username.toLowerCase().includes(q);
        const matchesEmail = user.email.toLowerCase().includes(q);
        const matchesBranch = user.branch.toLowerCase().includes(q);
        const matchesRole = user.role.toLowerCase().includes(q);
        const matchesPhone = user.phone ? user.phone.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesUsername && !matchesEmail && !matchesBranch && !matchesRole && !matchesPhone) {
          return false;
        }
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, twoFactorFilter, branchFilter, searchQuery]);

  const hasActiveFilters = Boolean(
    searchQuery || roleFilter !== 'all' || statusFilter !== 'all' || twoFactorFilter !== 'all' || branchFilter !== 'all'
  );

  const resetAllFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setTwoFactorFilter('all');
    setBranchFilter('all');
  };

  const handleExportUsers = useCallback(() => {
    const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      ['DATA CLASSIFICATION: SAMPLE PREVIEW — NOT LIVE USER DATA', ...Array(SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.length - 1).fill('')].map(csvCell).join(','),
      SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map(csvCell).join(','),
      ...filteredUsers.map((user) =>
        SUPERADMIN_USERS_OVERVIEW_PAGE_CLIENT_COLUMNS.map((column) =>
          csvCell(column === 'email' ? maskSensitiveData(String((user as unknown as Record<string, unknown>)[column] ?? '')) : (user as unknown as Record<string, unknown>)[column])
        ).join(',')
      ),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_sample_users_preview.csv';
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t('COPY.DOWNLOADED_A_SAMPLE_PREVIEW_CSV_ONLY_THIS_IS_NOT_A_LIVE_USER_EXPORT'));
  }, [filteredUsers, showToast, t]);

  const handleExportExcel = useCallback(() => {
    downloadSuperadminUsersExcel(filteredUsers, 'superadmin_users_export.xls');
    showToast(`Exported ${filteredUsers.length} user account(s) to Excel (.xls)`);
  }, [filteredUsers, showToast]);

  const handlePrintRoster = useCallback(() => {
    printSuperadminUsersRoster(filteredUsers, 'SuperAdmin User Access Directory');
    showToast(`Prepared ${filteredUsers.length} user account(s) for printing`);
  }, [filteredUsers, showToast]);

  const userCols = useUsersDirectoryColumns({
    t,
    handleOpenEdit,
    toggleStatus,
    handleResetPassword,
    handleQuickWhatsApp,
  });

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      <SuperadminUsersDirectoryHeroControls
        t={t}
        users={users}
        filteredUsers={filteredUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        twoFactorFilter={twoFactorFilter}
        setTwoFactorFilter={setTwoFactorFilter}
        branchFilter={branchFilter}
        setBranchFilter={setBranchFilter}
        availableBranches={availableBranches}
        hasActiveFilters={hasActiveFilters}
        resetAllFilters={resetAllFilters}
        onOpenInvite={() => {
          setEditUser(null);
          setShowModal(true);
        }}
        onOpenBulkWhatsApp={() => setShowBulkWhatsApp(true)}
        onExportCsv={handleExportUsers}
        onExportExcel={handleExportExcel}
        onPrintRoster={handlePrintRoster}
      />

      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs sm:text-sm text-amber-300 flex items-start gap-2.5" role="status">
        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <span>{t('COPY.USER_AND_SESSION_RECORDS_ARE_ILLUSTRATIVE_IN_MEMORY_SAMPLE_DATA_PROVISIONING_STATUS_CHANGES_RBAC_WRITES_PASSWORD_RESETS_AND_SESSION_REVOCATION_REQUIRE_VERIFIED_HOST_API_CONTRACTS_AND_DO_NOT_CHANGE_SERVER_STATE_HERE')}</span>
      </p>

      <div id="superadmin-users-tabpanel" tabIndex={0}>
        <SuperadminUsersDirectoryContent
          activeTab={activeTab}
          users={filteredUsers}
          userCols={userCols}
          rolePermissions={SUPERADMIN_USERS_ROLE_PERMISSIONS}
        />
      </div>

      <SuperadminUsersDirectoryModal
        showModal={showModal}
        editUser={editUser}
        onClose={() => setShowModal(false)}
        handleSave={handleSave}
      />

      <SuperadminUsersBulkWhatsAppModal
        isOpen={showBulkWhatsApp}
        onClose={() => setShowBulkWhatsApp(false)}
        users={filteredUsers}
      />
    </div>
  );
}
