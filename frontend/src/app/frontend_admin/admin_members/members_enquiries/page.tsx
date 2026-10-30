import { notFound } from 'next/navigation';
import { AdminEnquiriesAddPage } from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesAddPage';
import AdminEnquiriesPageView from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesPageView';
import AdminMembersEnquiriesEnquiryDetailPageView from '@/app/frontend_admin/admin_members/members_enquiries/components/AdminMembersEnquiriesEnquiryDetailPageView';
import type { AdminMembersEnquiriesSearchParams } from '@/app/frontend_admin/admin_members/members_enquiries/types/AdminMembersEnquiriesComponentTypes';


/** Canonical route entry: only the verified view/id query parameters dispatch the existing screens. */
export default async function AdminMembersEnquiriesRoute({ searchParams }: { searchParams: AdminMembersEnquiriesSearchParams }) {
  const query = await searchParams;
  const getSingleValue = (value: string | string[] | undefined): string | undefined => Array.isArray(value) ? value[0] : value;
  const view = getSingleValue(query.view);
  const id = getSingleValue(query.id) ?? '';
  switch (view) {
    case undefined:
    case 'enquiries': return <AdminEnquiriesPageView />;
    case 'enquiries/add': return <AdminEnquiriesAddPage />;
    case 'enquiries/detail': return <AdminMembersEnquiriesEnquiryDetailPageView params={Promise.resolve({ id })} />;
    default: notFound();
  }
}
