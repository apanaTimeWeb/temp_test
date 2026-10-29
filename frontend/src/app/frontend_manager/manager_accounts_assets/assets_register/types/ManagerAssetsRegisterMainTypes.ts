export type ManagerAssetsRegisterQueryValue = string | string[] | undefined;

export interface ManagerAssetsRegisterSearchParams {
  view?: ManagerAssetsRegisterQueryValue;
  id?: ManagerAssetsRegisterQueryValue;
  name?: ManagerAssetsRegisterQueryValue;
  phone?: ManagerAssetsRegisterQueryValue;
  smartId?: ManagerAssetsRegisterQueryValue;
}

export interface ManagerAssetsRegisterMainProps {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
}
