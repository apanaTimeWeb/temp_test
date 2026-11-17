import { useTranslations } from 'next-intl';
import { ManagerPageLoader } from '@/app/frontend_manager/components/ManagerLoader';

/** Feature-owned loading boundary for asynchronous page transitions. */
export default function ManagerFeatureLoading() {
  const tManagerUi = useTranslations('manager.manager_qr_scanner.ui');
  return (
    <ManagerPageLoader
      icon="search"
      variant="breath"
      title={tManagerUi('loading_this_section')}
    />
  );
}
