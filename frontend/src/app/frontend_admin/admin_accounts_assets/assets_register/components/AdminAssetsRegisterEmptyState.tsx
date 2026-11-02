// components/AdminAssetsRegisterEmptyState.tsx
'use client';
import { useTranslations } from 'next-intl';
import { Layers } from 'lucide-react';
import AdminEmptyState from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveEmptyState';

interface Props {
  onResetFilters?: () => void;
}

export function AdminAssetsRegisterEmptyState({ onResetFilters }: Props) {
  const t = useTranslations('ADMIN_ASSETS_REGISTER.EMPTY');
  const tFilters = useTranslations('ADMIN_ASSETS_REGISTER.FILTERS');

  return (
    <AdminEmptyState
      icon={Layers}
      title={t('TITLE')}
      description={t('DESCRIPTION')}
      action={
        onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors"
          >
            {tFilters('CLEAR_FILTERS')}
          </button>
        ) : undefined
      }
    />
  );
}

export default AdminAssetsRegisterEmptyState;

