import { ManagerPageLoader } from '@/app/frontend_manager/components/ManagerLoader';

/** Feature-owned loading boundary for asynchronous page transitions. */
export default function ManagerFeatureLoading() {
  return (
    <ManagerPageLoader
      icon="qr-code"
      variant="breath"
    />
  );
}
