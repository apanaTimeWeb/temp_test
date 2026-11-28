import { ManagerPageLoader } from '@/app/frontend_manager/components/ManagerLoader';

/** Feature-owned loading boundary for asynchronous page transitions. */
export default function ManagerMonthlyHistoryLoading() {
  return <ManagerPageLoader size="md" icon="calendar-check" variant="contra" />;
}
