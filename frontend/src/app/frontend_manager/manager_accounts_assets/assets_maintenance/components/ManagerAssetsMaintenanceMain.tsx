'use client';

import type { ManagerAssetsMaintenanceMainProps } from '../types/ManagerAssetsMaintenanceTypes';
import ManagerAssetsMaintenancePage from './ManagerAssetsMaintenancePage';

/** This canonical domain owns maintenance only; legacy view query values never dispatch sibling workflows. */
export function ManagerAssetsMaintenanceMain(props: ManagerAssetsMaintenanceMainProps) {
  return <ManagerAssetsMaintenancePage view={props.view} id={props.id} />;
}
