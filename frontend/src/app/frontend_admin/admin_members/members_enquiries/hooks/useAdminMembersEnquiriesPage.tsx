'use client';
// DATA FLOW: members_enquiries route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.
import type { Enquiry,EnquiryStatus } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { ADMIN_ENQUIRIES_ENQUIRY_STORAGE_EXPECTED_VERSION,AdminEnquiriesEnquiryStoragePayloadSchema } from '@/app/frontend_admin/admin_members/members_enquiries/schemas/AdminMembersEnquiriesSchema';
import { matchesAdminEnquiriesEnquirySearch } from '@/app/frontend_admin/admin_members/members_enquiries/utils/AdminMembersEnquiriesTextUtils';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect,useMemo,useState } from 'react';

/** @description Owns CRM enquiry pipeline view/search/filter state and derives filtered records for the view layer. @dependencies Module-owned enquiry storage and CRM domain types. @edge-case Empty storage produces an empty pipeline; search is case-insensitive; phone search ignores punctuation. */
const INITIAL_ENQUIRIES: Enquiry[] = [
  { id: '1', name: 'Rahul Sharma', phone: '9876543210', shift: 'Morning', status: 'New', handledBy: 'Admin', addedDate: '2026-10-01', isToday: true, avatar: 'RS', preferredBranch: 'Downtown Central' },
  { id: '2', name: 'Sneha Patil', phone: '9123456789', shift: 'Evening', status: 'Visited', handledBy: 'John', addedDate: '2026-09-30', isUpcoming: true, avatar: 'SP', preferredBranch: 'Westside Branch' },
  { id: '3', name: 'Amit Kumar', phone: '9988776655', shift: 'Night', status: 'Interested', handledBy: 'Admin', addedDate: '2026-09-29', isOverdue: true, avatar: 'AK', preferredBranch: 'North Hub' },
  { id: '4', name: 'Priya Singh', phone: '9001122334', shift: 'Morning', status: 'Converted', handledBy: 'Jane', addedDate: '2026-09-28', convertedDate: '2026-09-30', avatar: 'PS', preferredBranch: 'Downtown Central' },
];

// Demo records are intentionally memory-only: business entities must not be persisted in browser storage.
let inMemoryAdminEnquiries: Enquiry[] = INITIAL_ENQUIRIES.map((record) => ({ ...record }));

export function getEnquiries(): Enquiry[] {
  if (!isFrontendDemoModeEnabled()) return [];
  return inMemoryAdminEnquiries.map((record) => ({ ...record }));
}

export function saveEnquiries(records: Enquiry[]): void {
  if (!isFrontendDemoModeEnabled()) throw new Error('Enquiry changes are available only in explicit demo mode.');
  const candidate: unknown = { version: ADMIN_ENQUIRIES_ENQUIRY_STORAGE_EXPECTED_VERSION, records };
  const validated = AdminEnquiriesEnquiryStoragePayloadSchema.safeParse(candidate);
  if (!validated.success || validated.data.version !== ADMIN_ENQUIRIES_ENQUIRY_STORAGE_EXPECTED_VERSION) {
    throw new Error('Enquiry update rejected invalid records.');
  }
  inMemoryAdminEnquiries = validated.data.records.map((record) => ({ ...record }));
}

export function addEnquiry(enquiry: Omit<Enquiry, 'id' | 'addedDate' | 'avatar'>): Enquiry {
  if (!isFrontendDemoModeEnabled()) throw new Error('CRM creation is blocked until a verified backend API contract is supplied.');
  const records = getEnquiries();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: crypto.randomUUID(),
    addedDate: format(new Date(), 'yyyy-MM-dd'),
    avatar: enquiry.name.trim().slice(0, 2).toUpperCase() || 'EN',
  };
  saveEnquiries([newEnquiry, ...records]);
  return newEnquiry;
}

export default function useAdminEnquiriesPage() {
  const router = useRouter();
  const isDemoMode = isFrontendDemoModeEnabled();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [view, setView] = useAdminApplicationInfrastructureUrlQueryState<'kanban' | 'table'>('displayMode', 'table', { validValues: ['kanban', 'table'] });
  const [search, setSearch] = useAdminApplicationInfrastructureUrlQueryState<string>('search', '');
  const [statusFilter, setStatusFilter] = useAdminApplicationInfrastructureUrlQueryState<string>('statusFilter', 'All', { validValues: ['All', 'New', 'Visited', 'Interested', 'Converted', 'Lost'] });
  const { selectedBranch, isAllBranches } = useAdminBranch();
  useEffect(() => {
    // Browser storage is a demo fixture only. Never load it into the production state path.
    if (!isDemoMode) {
      setEnquiries([]);
      return;
    }
    setEnquiries(getEnquiries());
  }, [isDemoMode]);
  const filtered = useMemo(() => enquiries.filter((enquiry) => {
    const matchBranch = isAllBranches || !selectedBranch || !enquiry.preferredBranch || enquiry.preferredBranch.toLowerCase().includes(selectedBranch.name.toLowerCase()) || selectedBranch.name.toLowerCase().includes(enquiry.preferredBranch.toLowerCase());
    const matchSearch = matchesAdminEnquiriesEnquirySearch(enquiry, search);
    return matchBranch && matchSearch && (statusFilter === 'All' || enquiry.status === statusFilter);
  }), [enquiries, search, statusFilter, isAllBranches, selectedBranch]);
  const colEnquiries = (status: EnquiryStatus) => filtered.filter((enquiry) => enquiry.status === status);
  return { router, isDemoMode, enquiries, setEnquiries, view, setView, search, setSearch, statusFilter, setStatusFilter, filtered, colEnquiries } as const;
}
