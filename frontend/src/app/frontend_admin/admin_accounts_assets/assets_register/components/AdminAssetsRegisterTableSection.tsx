'use client';
// Responsibility: accessible, responsive asset grid and URL-backed pagination.

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DataGrid, type DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { AdminAssetsRegisterAsset } from '@/app/frontend_admin/admin_accounts_assets/assets_register/schemas/AdminAssetsRegisterFormSchemas';

const ADMIN_ASSETS_REGISTER_TABLE_PAGE_QUERY = 'admin-assets-register-page';

export default function AdminAssetsRegisterTableSection({ assets, columns, emptyMessage, tableLabel }: { assets: readonly AdminAssetsRegisterAsset[]; columns: DataGridColumn<AdminAssetsRegisterAsset>[]; emptyMessage: string; tableLabel: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const [page, setPage] = useState(() => parseAdminAssetsRegisterPage(new URLSearchParams(queryString).get(ADMIN_ASSETS_REGISTER_TABLE_PAGE_QUERY)));
  const pageRef = useRef(page);
  pageRef.current = page;
  useEffect(() => {
    const next = parseAdminAssetsRegisterPage(new URLSearchParams(queryString).get(ADMIN_ASSETS_REGISTER_TABLE_PAGE_QUERY));
    pageRef.current = next;
    setPage((current) => current === next ? current : next);
  }, [queryString]);
  const setUrlBackedPage = useCallback<Dispatch<SetStateAction<number>>>((nextPage) => {
    const resolved = typeof nextPage === 'function' ? nextPage(pageRef.current) : nextPage;
    const safePage = Number.isSafeInteger(resolved) && resolved >= 0 ? resolved : 0;
    pageRef.current = safePage;
    setPage(safePage);
    const params = new URLSearchParams(queryString);
    if (safePage === 0) params.delete(ADMIN_ASSETS_REGISTER_TABLE_PAGE_QUERY);
    else params.set(ADMIN_ASSETS_REGISTER_TABLE_PAGE_QUERY, String(safePage));
    const serialized = params.toString();
    const nextUrl = serialized ? `${pathname}?${serialized}` : pathname;
    const currentUrl = queryString ? `${pathname}?${queryString}` : pathname;
    if (nextUrl !== currentUrl) router.replace(nextUrl, { scroll: false });
  }, [pathname, queryString, router]);
  return <section className="rounded-xl border border-border bg-card p-4 shadow-card" aria-label={tableLabel}><DataGrid rowData={[...assets]} columnDefs={columns} rowHeight={56} pagination pageSize={10} emptyMessage={emptyMessage} page={page} onPageChange={setUrlBackedPage} /></section>;
}

function parseAdminAssetsRegisterPage(rawValue: string | null): number {
  if (rawValue === null) return 0;
  const parsed = Number(rawValue);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}
