import { Suspense } from 'react';
import { ManagerSettingsSecurityMain } from './components/ManagerSettingsSecurityMain';
import ManagerSettingsSecurityLoading from './loading';

export default function ManagerSettingsSecurityPage() {
  return (
    <Suspense fallback={<ManagerSettingsSecurityLoading />}>
      <ManagerSettingsSecurityMain />
    </Suspense>
  );
}
