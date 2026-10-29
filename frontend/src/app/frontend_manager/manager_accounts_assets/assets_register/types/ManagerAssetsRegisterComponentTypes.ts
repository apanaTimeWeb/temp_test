/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAssetsRegisterSearchParams } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import type { ReactNode } from 'react';

export type ManagerAssetsRegisterEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerAssetsRegisterPageProps = {
  searchParams?: Promise<ManagerAssetsRegisterSearchParams>;
};

export type ManagerAssetsRegisterCategoryTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
