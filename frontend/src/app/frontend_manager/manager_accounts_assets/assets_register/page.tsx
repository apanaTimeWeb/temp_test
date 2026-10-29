import { ManagerAssetsRegisterMain } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/ManagerAssetsRegisterMain';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';
import type { ManagerAssetsRegisterPageProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterComponentTypes';



function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ManagerAssetsRegisterPage({ searchParams }: ManagerAssetsRegisterPageProps) {
  const params = searchParams ? await searchParams : {};
  const mainProps: ManagerAssetsRegisterMainProps = {
    view: firstValue(params.view),
    id: firstValue(params.id),
    name: firstValue(params.name),
    phone: firstValue(params.phone),
    smartId: firstValue(params.smartId),
  };
  return <ManagerAssetsRegisterMain {...mainProps} />;
}
