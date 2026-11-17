import { useTranslations } from 'next-intl';
import { ManagerPageLoader } from '@/app/frontend_manager/components/ManagerLoader';

/** Feature-owned loading boundary for asynchronous page transitions. */
export default function ManagerFeatureLoading() {
  const tManagerUi = useTranslations('manager.manager_complaints.ui');
  return (
    <ManagerPageLoader
      icon="book"
      variant="flip"
      title={tManagerUi('loading_this_section')}
    />
  );
}
