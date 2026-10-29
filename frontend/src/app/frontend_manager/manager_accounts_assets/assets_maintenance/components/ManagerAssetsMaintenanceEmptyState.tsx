
import type { ManagerAssetsMaintenanceEmptyStateProps } from '@/app/frontend_manager/manager_accounts_assets/assets_maintenance/types/ManagerAssetsMaintenanceComponentTypes';



export default function ManagerAssetsMaintenanceEmptyState({ title }: ManagerAssetsMaintenanceEmptyStateProps) {
  return <div className="fin-empty-state" role="status" aria-live="polite" data-testid="manager_assets_maintenance-empty-state"><div className="fin-empty-state__icon" aria-hidden="true">🔧</div><p className="fin-empty-state__title">{title}</p></div>;
}
