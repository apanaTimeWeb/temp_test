import { ManagerAssetsRegisterMain } from '@/app/frontend_manager/manager_accounts_assets/assets_register/components/ManagerAssetsRegisterMain';
import type { ManagerAssetsRegisterPageProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterComponentTypes';
import type { ManagerAssetsRegisterMainProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterMainTypes';



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
  return <ManagerAssetsRegisterMain view={mainProps.view} id={mainProps.id} name={mainProps.name} phone={mainProps.phone} smartId={mainProps.smartId} />;
}
