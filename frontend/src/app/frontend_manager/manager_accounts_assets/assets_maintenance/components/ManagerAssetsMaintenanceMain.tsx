'use client';

import ManagerAssetsMaintenancePage from './ManagerAssetsMaintenancePage';
import type { ManagerAssetsMaintenanceMainProps } from '../types/ManagerAssetsMaintenanceTypes';

/** This canonical domain owns maintenance only; legacy view query values never dispatch sibling workflows. */
export function ManagerAssetsMaintenanceMain(props: ManagerAssetsMaintenanceMainProps) {
  return <ManagerAssetsMaintenancePage view={props.view} id={props.id} />;
}
