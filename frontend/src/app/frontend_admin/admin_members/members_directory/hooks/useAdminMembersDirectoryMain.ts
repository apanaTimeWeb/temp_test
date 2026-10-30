'use client';
// DATA FLOW: members_directory route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { ADMIN_MEMBERS_DETAIL_NAVIGATION, ADMIN_MEMBERS_DIRECTORY_NAVIGATION, resolveAdminMembersDirectoryView } from '@/app/frontend_admin/admin_members/members_directory/config/admin_members_directory.url_config';
import { ADMIN_MEMBERS_FIXTURES } from '@/app/frontend_admin/admin_members/members_directory/mocks/AdminMembersDirectoryFixtures';
import type { AdminMembersDetailTab, AdminMembersDirectoryTab, AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import type { AdminMembersCreateFormValues } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { ADMIN_MEMBERS_CATEGORY_FIXTURES, ADMIN_MEMBERS_DEPARTMENT_FIXTURES, ADMIN_MEMBERS_RENEWAL_FIXTURES } from '@/app/frontend_admin/admin_members/members_directory/mocks/AdminMembersDirectoryFixtures';
import type { AdminMembersCategory, AdminMembersDepartment, AdminMembersRenewal, AdminMembersDemoMutationResult } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

export default function useAdminMembersDirectoryMain() {
  const t = useTranslations('ADMIN_MEMBERS');
  const isDemoMode = isFrontendDemoModeEnabled();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('view');
  const [localActiveTab, setLocalActiveTab] = useState<AdminMembersDirectoryTab>(() => resolveAdminMembersDirectoryView(requestedTab));
  const activeTab: AdminMembersDirectoryTab = localActiveTab;
  useEffect(() => {
    if (requestedTab) {
      setLocalActiveTab(resolveAdminMembersDirectoryView(requestedTab));
    }
  }, [requestedTab]);
  const setActiveTab = useCallback((tab: AdminMembersDirectoryTab) => {
    setLocalActiveTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set('view', tab);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);
  const [viewingMember, setViewingMember] = useState<AdminMembersMember | null>(null);
  const [editingMember, setEditingMember] = useState<AdminMembersMember | null>(null);
  const [detailTab, setDetailTab] = useState<AdminMembersDetailTab>('profile');
  const [demoMembers, setDemoMembers] = useState<readonly AdminMembersMember[]>(() => isDemoMode ? ADMIN_MEMBERS_FIXTURES : []);
  const [nextDemoMemberSequence, setNextDemoMemberSequence] = useState(() => ADMIN_MEMBERS_FIXTURES.reduce((max, member) => {
    const match = /^MEM-(\d+)$/.exec(member.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1);
  const [demoCategories, setDemoCategories] = useState<AdminMembersCategory[]>(() => isDemoMode ? ADMIN_MEMBERS_CATEGORY_FIXTURES.map((category) => ({ ...category })) : []);
  const [demoDepartments, setDemoDepartments] = useState<AdminMembersDepartment[]>(() => isDemoMode ? ADMIN_MEMBERS_DEPARTMENT_FIXTURES.map((department) => ({ ...department })) : []);
  const [demoRenewals, setDemoRenewals] = useState<AdminMembersRenewal[]>(() => isDemoMode ? ADMIN_MEMBERS_RENEWAL_FIXTURES.map((renewal) => ({ ...renewal, reminderRecorded: false })) : []);
  const createDemoCategory = (name: string): AdminMembersDemoMutationResult => {
    const normalized = name.trim();
    if (!isDemoMode) return 'blocked';
    if (!normalized) return 'invalid';
    if (demoCategories.some((category) => category.name.toLocaleLowerCase() === normalized.toLocaleLowerCase())) return 'duplicate';
    setDemoCategories((current) => [...current, { name: normalized, members: 0, color: 'primary' }]);
    return 'created';
  };
  const createDemoDepartment = (name: string, head: string): AdminMembersDemoMutationResult => {
    const normalizedName = name.trim();
    const normalizedHead = head.trim();
    if (!isDemoMode) return 'blocked';
    if (!normalizedName || !normalizedHead) return 'invalid';
    if (demoDepartments.some((department) => department.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase())) return 'duplicate';
    setDemoDepartments((current) => [...current, { name: normalizedName, head: normalizedHead, members: 0 }]);
    return 'created';
  };
  const recordDemoRenewalReminder = (memberName: string): boolean => {
    if (!isDemoMode || demoRenewals.some((renewal) => renewal.member === memberName && renewal.reminderRecorded)) return false;
    setDemoRenewals((current) => current.map((renewal) => renewal.member === memberName ? { ...renewal, reminderRecorded: true } : renewal));
    return true;
  };
  const handleAction = (_action: string, member: AdminMembersMember) => {
    if (!isDemoMode) {
      toast.info(t('MEMBER_EDIT_UNAVAILABLE'), { id: 'admin_members-members_directory-hooks-useAdminMembersDirectoryMain-toast-70-1' });
      return;
    }
    setEditingMember(member);
  };
  const handleSaveDemoMember = (member: AdminMembersMember, values: AdminMembersCreateFormValues) => {
    if (!isDemoMode) {
      toast.info(t('MEMBER_EDIT_UNAVAILABLE'), { id: 'admin_members-members_directory-hooks-useAdminMembersDirectoryMain-toast-77-2' });
      setEditingMember(null);
      return;
    }
    const updatedMember: AdminMembersMember = { ...member, ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), plan: values.plan.trim() };
    setDemoMembers((current) => current.map((candidate) => candidate.id === member.id ? updatedMember : candidate));
    setViewingMember((current) => current?.id === member.id ? updatedMember : current);
    setEditingMember(null);
    toast.success(t('MEMBER_UPDATE_DEMO_SUCCESS', { name: updatedMember.name }), { id: 'admin_members-members_directory-hooks-useAdminMembersDirectoryMain-toast-85-3' });
  };
  const handleAddMember = (values: AdminMembersCreateFormValues) => {
    if (!isDemoMode) {
      toast.info(t('PERSISTENCE_BLOCKED'), { id: 'admin_members-members_directory-hooks-useAdminMembersDirectoryMain-toast-89-4' });
      return;
    }
    const newMember: AdminMembersMember = {
      id: `MEM-${String(nextDemoMemberSequence).padStart(3, '0')}`,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      plan: values.plan.trim(),
      status: 'Active',
      expiryDate: '',
    };
    setDemoMembers((current) => [...current, newMember]);
    setNextDemoMemberSequence((current) => current + 1);
    setActiveTab('all');
    toast.success(t('DEMO_MEMBER_CREATED', { name: newMember.name }), { id: 'admin_members-members_directory-hooks-useAdminMembersDirectoryMain-toast-104-5' });
  };
  const openMemberDetails = (member: AdminMembersMember) => { setViewingMember(member); setDetailTab('profile'); };
  return { activeTab, setActiveTab, viewingMember, setViewingMember, detailTab, setDetailTab, mainNav: ADMIN_MEMBERS_DIRECTORY_NAVIGATION, detailNav: ADMIN_MEMBERS_DETAIL_NAVIGATION, dummyMembers: isDemoMode ? demoMembers : [], editingMember, setEditingMember, handleSaveDemoMember, demoCategories, demoDepartments, demoRenewals, createDemoCategory, createDemoDepartment, recordDemoRenewalReminder, isDemoMode, handleAction, handleAddMember, openMemberDetails } as const;
}
