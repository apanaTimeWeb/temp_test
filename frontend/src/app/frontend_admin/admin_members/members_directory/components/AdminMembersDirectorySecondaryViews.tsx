// RESPONSIBILITY: Owns the secondary member-directory tab views and their demo-only local forms.
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Tags, Building, DownloadCloud, UploadCloud, ArrowRight } from 'lucide-react';
import toast from 'sonner';
import type { AdminMembersCategory, AdminMembersDepartment, AdminMembersRenewal, AdminMembersDemoMutationResult } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import useAdminMembersDirectoryMain from '@/app/frontend_admin/admin_members/members_directory/hooks/useAdminMembersDirectoryMain';
import Link from 'next/link';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import type { AdminMembersDirectorySecondaryViewsProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


/** The tab content is co-located here because the five views share the same active-tab lifecycle and demo-only mutation contract. */
export default function AdminMembersDirectorySecondaryViews({ model }: AdminMembersDirectorySecondaryViewsProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [departmentCreating, setDepartmentCreating] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentHead, setDepartmentHead] = useState('');
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  useEffect(() => {
    setCategoryCreating(false); setCategoryName(''); setCategoryError(null);
    setDepartmentCreating(false); setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null);
  }, [model.activeTab]);
  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result: AdminMembersDemoMutationResult = model.createDemoCategory(categoryName);
    if (result === 'created') { toast.success(t('CATEGORY_CREATED', { name: categoryName.trim() }), { id: 'admin_members-members_directory-components-AdminMembersDirectoryCategoriesView-toast-26-1' }); setCategoryName(''); setCategoryError(null); setCategoryCreating(false); return; }
    const key = result === 'duplicate' ? 'CATEGORY_NAME_DUPLICATE' : result === 'blocked' ? 'CATEGORY_CREATE_BLOCKED' : 'CATEGORY_NAME_REQUIRED';
    if (result === 'blocked') toast.info(t(key), { id: 'admin_members-members_directory-components-AdminMembersDirectoryCategoriesView-toast-33-2' }); else setCategoryError(t(key));
  };
  const submitDepartment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result: AdminMembersDemoMutationResult = model.createDemoDepartment(departmentName, departmentHead);
    if (result === 'created') { toast.success(t('DEPARTMENT_CREATED', { name: departmentName.trim() }), { id: 'admin_members-members_directory-components-AdminMembersDirectoryDepartmentsView-toast-26-1' }); setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null); setDepartmentCreating(false); return; }
    const key = result === 'duplicate' ? 'DEPARTMENT_NAME_DUPLICATE' : result === 'blocked' ? 'DEPARTMENT_CREATE_BLOCKED' : 'DEPARTMENT_NAME_REQUIRED';
    if (result === 'blocked') toast.info(t(key), { id: 'admin_members-members_directory-components-AdminMembersDirectoryDepartmentsView-toast-30-2' }); else setDepartmentError(t(key));
  };
  const recordReminder = (memberName: string) => { if (model.recordDemoRenewalReminder(memberName)) toast.info(t('RENEWAL_REMINDER_RECORDED'), { id: 'admin_members-members_directory-components-AdminMembersDirectoryRenewalsView-toast-17-1' }); };
  const expiryLabel = (expiry: AdminMembersRenewal['expiresIn']) => expiry.unit === 'week' ? t('RENEWAL_EXPIRY_WEEKS', { count: expiry.value }) : t('RENEWAL_EXPIRY_DAYS', { count: expiry.value });
  if (model.viewingMember) return null;
  if (model.activeTab === 'plans') return <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-plans-canonical-title"><h2 id="admin-members-plans-canonical-title" className="admin-shared-card-heading">{t('PLANS_TITLE')}</h2><p className="mt-2 text-sm text-text-secondary">{t('PLANS_CANONICAL_DESCRIPTION')}</p><Link href={ADMIN_ROUTES.MEMBERS_PLANS} className="admin-btn-primary mt-4 inline-flex min-h-11 items-center gap-2">{t('OPEN_MEMBERSHIP_PLANS')} <ArrowRight size={18} aria-hidden="true" /></Link></section>;
  if (!model.isDemoMode) return null;

  if (model.activeTab === 'categories') {
    const categories: readonly AdminMembersCategory[] = model.demoCategories;
    return <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-categories-title"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="admin-members-categories-title" className="admin-shared-card-heading">{t('CATEGORY_TITLE')}</h2><button type="button" data-testid="admin_members-AdminMembersCategoriesView-control-001" className="admin-btn-primary" aria-expanded={categoryCreating} aria-controls="admin-members-category-create" onClick={() => { setCategoryCreating((current) => !current); setCategoryError(null); }}><Tags size={18} aria-hidden="true"/> {t('CATEGORY_ADD')}</button></div>
      {categoryCreating && <form id="admin-members-category-create" className="my-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]" onSubmit={submitCategory}><div className="grid gap-1"><label htmlFor="admin-members-category-name" className="admin-label">{t('CATEGORY_NAME_LABEL')}</label><input id="admin-members-category-name" className="admin-input" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required maxLength={80} aria-invalid={Boolean(categoryError)} aria-describedby={categoryError ? 'admin-members-category-name-error' : undefined}/>{categoryError && <p id="admin-members-category-name-error" role="alert" className="text-sm text-danger-text">{categoryError}</p>}</div><button type="submit" className="admin-btn-primary self-end min-h-11">{t('CATEGORY_SAVE')}</button><button type="button" className="admin-btn-ghost self-end min-h-11" onClick={() => { setCategoryCreating(false); setCategoryName(''); setCategoryError(null); }}>{t('CANCEL')}</button></form>}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 admin-shared-card-grid">{categories.map((category) => <li key={category.name} className="flex items-center gap-4 rounded-xl border border-border bg-floating p-5"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" data-admin-bg={category.color} data-admin-color={category.color}><Tags size={18} aria-hidden="true"/></span><span className="min-w-0"><span className="block font-semibold text-primary">{category.name}</span><span className="block text-sm text-text-secondary">{t('SAMPLE_MEMBERS_COUNT', { count: category.members })}</span></span></li>)}</ul>
    </section>;
  }
  if (model.activeTab === 'departments') {
    const departments: readonly AdminMembersDepartment[] = model.demoDepartments;
    return <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-departments-title"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="admin-members-departments-title" className="admin-shared-card-heading">{t('DEPARTMENTS_TITLE')}</h2><button type="button" data-testid="admin_members-AdminMembersDepartmentsView-control-001" className="admin-btn-primary" aria-expanded={departmentCreating} aria-controls="admin-members-department-create" onClick={() => { setDepartmentCreating((current) => !current); setDepartmentError(null); }}><Building size={18} aria-hidden="true"/> {t('DEPARTMENT_ADD')}</button></div>
      {departmentCreating && <form id="admin-members-department-create" className="my-4 grid gap-3 sm:grid-cols-2" onSubmit={submitDepartment}><div className="grid gap-1"><label htmlFor="admin-members-department-name" className="admin-label">{t('DEPARTMENT_NAME_LABEL')}</label><input id="admin-members-department-name" className="admin-input" value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} required maxLength={100}/></div><div className="grid gap-1"><label htmlFor="admin-members-department-head" className="admin-label">{t('DEPARTMENT_HEAD_LABEL')}</label><input id="admin-members-department-head" className="admin-input" value={departmentHead} onChange={(event) => setDepartmentHead(event.target.value)} required maxLength={100}/></div>{departmentError && <p role="alert" className="text-sm text-danger-text sm:col-span-2">{departmentError}</p>}<div className="flex flex-wrap gap-2 sm:col-span-2"><button type="submit" className="admin-btn-primary min-h-11">{t('DEPARTMENT_SAVE')}</button><button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setDepartmentCreating(false); setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null); }}>{t('CANCEL')}</button></div></form>}
      <div className="overflow-x-auto"><table className="w-full min-w-100 border-collapse text-left"><thead><tr><th scope="col">{t('DEPARTMENT_NAME')}</th><th scope="col">{t('DEPARTMENT_HEAD')}</th><th scope="col">{t('DEPARTMENT_MEMBERS_COUNT')}</th></tr></thead><tbody>{departments.map((department) => <tr key={department.name}><th scope="row" className="text-left">{department.name}</th><td>{department.head}</td><td>{department.members}</td></tr>)}</tbody></table></div>
    </section>;
  }
  if (model.activeTab === 'renewal') {
    const renewals: readonly AdminMembersRenewal[] = model.demoRenewals;
    return <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-renewals-title"><h2 id="admin-members-renewals-title" className="admin-shared-section-heading">{t('RENEWALS_TITLE')}</h2><div className="mt-4 grid gap-3 md:hidden" aria-label={t('RENEWALS_TITLE')}>{renewals.map((renewal) => <article key={`mobile-${renewal.member}`} className="rounded-lg border border-border p-4"><h3 className="font-semibold text-text-primary">{renewal.member}</h3><dl className="mt-2 grid gap-2 text-sm"><div><dt className="text-text-secondary">{t('RENEWALS_CURRENT_PLAN')}</dt><dd>{renewal.plan}</dd></div><div><dt className="text-text-secondary">{t('RENEWALS_EXPIRY_IN')}</dt><dd>{expiryLabel(renewal.expiresIn)}</dd></div></dl><button type="button" className="admin-btn-primary mt-3 min-h-11 w-full" disabled={renewal.reminderRecorded} title={renewal.reminderRecorded ? t('RENEWAL_REMINDER_DISABLED_TITLE') : undefined} onClick={() => recordReminder(renewal.member)}>{renewal.reminderRecorded ? t('RENEWAL_REMINDER_RECORDED_LABEL') : t('RENEWAL_SEND_REMINDER')}</button></article>)}</div><div className="mt-4 hidden overflow-x-auto md:block"><table className="w-full admin-shared-table-wide"><thead><tr><th scope="col">{t('RENEWALS_MEMBER')}</th><th scope="col">{t('RENEWALS_CURRENT_PLAN')}</th><th scope="col">{t('RENEWALS_EXPIRY_IN')}</th><th scope="col">{t('RENEWALS_ACTION')}</th></tr></thead><tbody>{renewals.map((renewal) => <tr key={renewal.member}><th scope="row" className="text-left">{renewal.member}</th><td>{renewal.plan}</td><td>{expiryLabel(renewal.expiresIn)}</td><td><button type="button" className="admin-btn-primary min-h-11" disabled={renewal.reminderRecorded} title={renewal.reminderRecorded ? t('RENEWAL_REMINDER_DISABLED_TITLE') : undefined} onClick={() => recordReminder(renewal.member)}>{renewal.reminderRecorded ? t('RENEWAL_REMINDER_RECORDED_LABEL') : t('RENEWAL_SEND_REMINDER')}</button></td></tr>)}</tbody></table></div></section>;
  }
  if (model.activeTab === 'import') return <section className="admin-card p-10 text-center" aria-labelledby="admin-members-import-title"><div className="mb-3 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true"><UploadCloud size={22}/></div><h2 id="admin-members-import-title" className="mb-3 text-2xl font-bold text-text-primary">{t('IMPORT_TITLE')}</h2><p className="mt-2 text-text-secondary">{t('IMPORT_DESCRIPTION')}</p><p className="mt-3 rounded-md border border-warning-bg bg-warning-bg p-4 text-warning-text" role="status">{t('IMPORT_UNAVAILABLE')}</p><button type="button" className="admin-btn-ghost mt-3 min-h-11" disabled title={t('IMPORT_TEMPLATE_BLOCKED')}><DownloadCloud size={18} aria-hidden="true"/> {t('IMPORT_TEMPLATE')}</button></section>;
  return null;
}


export type { AdminMembersDirectorySecondaryViewsProps };
