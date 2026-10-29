'use client';
import ManagerAssetsRegisterPage from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/manager_assets_register_views/ManagerAssetsRegisterPage.tsx';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';

// RESPONSIBILITY: Preserve route query state at the module boundary and pass it to the feature view.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export function ManagerAssetsRegisterMain(props: ManagerAssetsRegisterMainProps) {
  return <ManagerAssetsRegisterPage {...props} />;
}
