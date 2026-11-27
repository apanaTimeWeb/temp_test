'use client';
// RESPONSIBILITY: Owns the secondary member-directory tab views and their demo-only local forms.

import { AdminMembersDirectoryRenewalsTabView } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryRenewalsTabView';
import type { AdminMembersCategory, AdminMembersDemoMutationResult, AdminMembersDepartment } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { AdminMembersDirectorySecondaryViewsProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Building, DownloadCloud, Tags, UploadCloud } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';

/** The tab content shares the active-tab lifecycle and demo-only mutation contract. */
export default function AdminMembersDirectorySecondaryViews({ model }: AdminMembersDirectorySecondaryViewsProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const [categoryCreating, setCategoryCreating] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [departmentCreating, setDepartmentCreating] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [departmentHead, setDepartmentHead] = useState('');
  const [departmentError, setDepartmentError] = useState<string | null>(null);

  type DeptSortField = 'name' | 'head' | 'members';
  const [deptSortField, setDeptSortField] = useState<DeptSortField | null>(null);
  const [deptSortDirection, setDeptSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleDeptSort = (field: DeptSortField) => {
    if (deptSortField === field) setDeptSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setDeptSortField(field); setDeptSortDirection('asc'); }
  };

  useEffect(() => {
    setCategoryCreating(false); setCategoryName(''); setCategoryError(null);
    setDepartmentCreating(false); setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null);
  }, [model.activeTab]);

  const submitCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result: AdminMembersDemoMutationResult = model.createDemoCategory(categoryName);
    if (result === 'created') {
      toast.success(t('CATEGORY_CREATED', { name: categoryName.trim() }), { id: 'admin_members-members_directory-components-AdminMembersDirectoryCategoriesView-toast-26-1' });
      setCategoryName(''); setCategoryError(null); setCategoryCreating(false);
      return;
    }
    const key = result === 'duplicate' ? 'CATEGORY_NAME_DUPLICATE' : result === 'blocked' ? 'CATEGORY_CREATE_BLOCKED' : 'CATEGORY_NAME_REQUIRED';
    if (result === 'blocked') toast.info(t(key), { id: 'admin_members-members_directory-components-AdminMembersDirectoryCategoriesView-toast-33-2' });
    else setCategoryError(t(key));
  };

  const submitDepartment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result: AdminMembersDemoMutationResult = model.createDemoDepartment(departmentName, departmentHead);
    if (result === 'created') {
      toast.success(t('DEPARTMENT_CREATED', { name: departmentName.trim() }), { id: 'admin_members-members_directory-components-AdminMembersDirectoryDepartmentsView-toast-26-1' });
      setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null); setDepartmentCreating(false);
      return;
    }
    const key = result === 'duplicate' ? 'DEPARTMENT_NAME_DUPLICATE' : result === 'blocked' ? 'DEPARTMENT_CREATE_BLOCKED' : 'DEPARTMENT_NAME_REQUIRED';
    if (result === 'blocked') toast.info(t(key), { id: 'admin_members-members_directory-components-AdminMembersDirectoryDepartmentsView-toast-30-2' });
    else setDepartmentError(t(key));
  };

  const recordReminder = (memberName: string) => {
    if (model.recordDemoRenewalReminder(memberName)) {
      toast.info(t('RENEWAL_REMINDER_RECORDED'), { id: 'admin_members-members_directory-components-AdminMembersDirectoryRenewalsView-toast-17-1' });
    }
  };

  if (model.viewingMember) return null;
  if (model.activeTab === 'plans') {
    return (
      <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-plans-canonical-title">
        <h2 id="admin-members-plans-canonical-title" className="admin-shared-card-heading">{t('PLANS_TITLE')}</h2>
        <p className="mt-2 text-sm text-text-secondary">{t('PLANS_CANONICAL_DESCRIPTION')}</p>
        <Link href={ADMIN_ROUTES.MEMBERS_PLANS} className="admin-btn-primary mt-4 inline-flex min-h-11 items-center gap-2">
          {t('OPEN_MEMBERSHIP_PLANS')} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    );
  }
  if (!model.isDemoMode) return null;

  if (model.activeTab === 'categories') {
    const categories: readonly AdminMembersCategory[] = model.demoCategories;
    return (
      <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-categories-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 id="admin-members-categories-title" className="admin-shared-card-heading flex items-center gap-2">
            <Tags size={20} className="text-purple" aria-hidden="true" />
            <span>{t('CATEGORY_TITLE')}</span>
          </h2>
          <button
            type="button"
            data-testid="admin_members-AdminMembersCategoriesView-control-001"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-purple-bg px-4 py-2 text-xs font-semibold text-purple hover:opacity-90 motion-safe:transition-opacity shadow-card"
            aria-expanded={categoryCreating}
            aria-controls="admin-members-category-create"
            onClick={() => { setCategoryCreating((current) => !current); setCategoryError(null); }}
          >
            <Tags size={16} aria-hidden="true" /> <span>{t('CATEGORY_ADD')}</span>
          </button>
        </div>
        {categoryCreating && (
          <form id="admin-members-category-create" className="my-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] p-4 rounded-xl border border-border bg-surface-highlight" onSubmit={submitCategory}>
            <div className="grid gap-1">
              <label htmlFor="admin-members-category-name" className="admin-label">{t('CATEGORY_NAME_LABEL')}</label>
              <input id="admin-members-category-name" className="admin-input" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required maxLength={80} aria-invalid={Boolean(categoryError)} aria-describedby={categoryError ? 'admin-members-category-name-error' : undefined} />
              {categoryError && <p id="admin-members-category-name-error" role="alert" className="text-sm text-danger-text">{categoryError}</p>}
            </div>
            <button type="submit" className="admin-btn-primary self-end min-h-11" aria-label={t('CATEGORY_SAVE')}>Save Category</button>
            <button type="button" className="admin-btn-ghost self-end min-h-11" onClick={() => { setCategoryCreating(false); setCategoryName(''); setCategoryError(null); }}>{t('CANCEL')}</button>
          </form>
        )}
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 admin-shared-card-grid">
          {categories.map((category) => {
            const colorClass = category.color === 'primary'
              ? 'bg-info-bg text-info-text border border-info'
              : category.color === 'purple'
                ? 'bg-purple-bg text-purple border border-border'
                : 'bg-warning-bg text-warning-text border border-warning';
            return (
              <li key={category.name} className="flex items-center gap-4 rounded-xl border border-border bg-surface-highlight p-4 shadow-card hover:border-border-focus motion-safe:transition-colors">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`} data-admin-bg={category.color} data-admin-color={category.color}>
                  <Tags size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-text-primary">{category.name}</span>
                  <span className="block text-xs text-text-secondary">{t('SAMPLE_MEMBERS_COUNT', { count: category.members })}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  if (model.activeTab === 'departments') {
    const rawDepartments: readonly AdminMembersDepartment[] = model.demoDepartments;
    const departments = [...rawDepartments].sort((a, b) => {
      if (!deptSortField) return 0;
      if (deptSortField === 'members') {
        const diff = a.members - b.members;
        return deptSortDirection === 'asc' ? diff : -diff;
      }
      const cmp = a[deptSortField].localeCompare(b[deptSortField], undefined, { numeric: true, sensitivity: 'base' });
      return deptSortDirection === 'asc' ? cmp : -cmp;
    });

    const renderDeptHeader = (field: DeptSortField, label: string) => {
      const isActive = deptSortField === field;
      return (
        <th scope="col" aria-sort={isActive ? (deptSortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="p-3">
          <button type="button" onClick={() => toggleDeptSort(field)} className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1" aria-label={`${label}, sort ${isActive ? (deptSortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
            <span>{label}</span>
            {isActive ? (
              deptSortDirection === 'asc' ? <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" /> : <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowUpDown className="text-text-secondary opacity-60 group-hover:opacity-100 group-hover:text-primary motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />
            )}
          </button>
        </th>
      );
    };

    return (
      <section className="admin-card admin-shared-card-padding" aria-labelledby="admin-members-departments-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 id="admin-members-departments-title" className="admin-shared-card-heading flex items-center gap-2">
            <Building size={20} className="text-info-text" aria-hidden="true" /> <span>{t('DEPARTMENTS_TITLE')}</span>
          </h2>
          <button type="button" data-testid="admin_members-AdminMembersDepartmentsView-control-001" className="inline-flex items-center gap-2 rounded-xl border border-info bg-info-bg px-4 py-2 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity shadow-card" aria-expanded={departmentCreating} aria-controls="admin-members-department-create" onClick={() => { setDepartmentCreating((current) => !current); setDepartmentError(null); }}>
            <Building size={16} aria-hidden="true" /> <span>{t('DEPARTMENT_ADD')}</span>
          </button>
        </div>
        {departmentCreating && (
          <form id="admin-members-department-create" className="my-4 grid gap-3 sm:grid-cols-2 p-4 rounded-xl border border-border bg-surface-highlight" onSubmit={submitDepartment}>
            <div className="grid gap-1">
              <label htmlFor="admin-members-department-name" className="admin-label">{t('DEPARTMENT_NAME_LABEL')}</label>
              <input id="admin-members-department-name" className="admin-input" value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} required maxLength={100} />
            </div>
            <div className="grid gap-1">
              <label htmlFor="admin-members-department-head" className="admin-label">{t('DEPARTMENT_HEAD_LABEL')}</label>
              <input id="admin-members-department-head" className="admin-input" value={departmentHead} onChange={(event) => setDepartmentHead(event.target.value)} required maxLength={100} />
            </div>
            {departmentError && <p role="alert" className="text-sm text-danger-text sm:col-span-2">{departmentError}</p>}
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button type="submit" className="admin-btn-primary min-h-11" aria-label={t('DEPARTMENT_SAVE')}>Save Department</button>
              <button type="button" className="admin-btn-ghost min-h-11" onClick={() => { setDepartmentCreating(false); setDepartmentName(''); setDepartmentHead(''); setDepartmentError(null); }}>{t('CANCEL')}</button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-100 border-collapse text-left text-sm">
            <thead>
              <tr className="h-12 bg-surface-highlight uppercase text-xs text-text-secondary font-semibold border-b border-border">
                {renderDeptHeader('name', t('DEPARTMENT_NAME'))}
                {renderDeptHeader('head', t('DEPARTMENT_HEAD'))}
                {renderDeptHeader('members', t('DEPARTMENT_MEMBERS_COUNT'))}
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.name} className="h-12 border-b border-border text-text-primary motion-safe:transition-colors hover:bg-surface-hover even:bg-surface-zebra">
                  <th scope="row" className="p-3 text-left font-medium text-text-primary flex items-center gap-2"><Building size={14} className="text-info-text shrink-0" aria-hidden="true" /> <span>{department.name}</span></th>
                  <td className="p-3">{department.head}</td>
                  <td className="p-3 font-semibold text-info-text">{department.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (model.activeTab === 'renewal') {
    return <AdminMembersDirectoryRenewalsTabView demoRenewals={model.demoRenewals} onRecordReminder={recordReminder} />;
  }

  if (model.activeTab === 'import') {
    return (
      <section className="admin-card p-10 text-center" aria-labelledby="admin-members-import-title">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-subtle text-primary" aria-hidden="true"><UploadCloud size={22} /></div>
        <h2 id="admin-members-import-title" className="mb-3 text-2xl font-bold text-text-primary">{t('IMPORT_TITLE')}</h2>
        <p className="mt-2 text-text-secondary">{t('IMPORT_DESCRIPTION')}</p>
        <p className="mt-3 rounded-md border border-warning bg-warning-bg p-4 text-warning-text" role="status">{t('IMPORT_UNAVAILABLE')}</p>
        <button type="button" className="admin-btn-ghost mt-3 min-h-11" disabled title={t('IMPORT_TEMPLATE_BLOCKED')}><DownloadCloud size={18} aria-hidden="true" /> {t('IMPORT_TEMPLATE')}</button>
      </section>
    );
  }
  return null;
}

export type { AdminMembersDirectorySecondaryViewsProps };
