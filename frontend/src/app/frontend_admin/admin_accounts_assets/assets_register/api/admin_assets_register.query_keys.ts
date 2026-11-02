// api/admin_assets_register.query_keys.ts
import type { AdminAssetsRegisterFilterParams } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterTypes';

export const ADMIN_ASSETS_REGISTER_QUERY_KEYS = {
  all: ['admin_assets_register'] as const,
  lists: () => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.all, 'list'] as const,
  list: (params?: AdminAssetsRegisterFilterParams) => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.lists(), params ?? {}] as const,
  details: () => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.details(), id] as const,
  kpis: () => [...ADMIN_ASSETS_REGISTER_QUERY_KEYS.all, 'kpis'] as const,
};

