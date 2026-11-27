import { ManagerSettingsSecurityMain } from '@/app/frontend_manager/manager_settings/settings_security/components/ManagerSettingsSecurityMain';
import ManagerSettingsSecurityLoading from '@/app/frontend_manager/manager_settings/settings_security/loading';
import { Suspense } from 'react';

export default function ManagerSettingsSecurityPage() {
  return (
    <Suspense fallback={<ManagerSettingsSecurityLoading />}>
      <ManagerSettingsSecurityMain />
    </Suspense>
  );
}
