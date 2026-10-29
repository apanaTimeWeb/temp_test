
import { useTranslations } from 'next-intl';
/** Feature-owned loading boundary for asynchronous page transitions. */
export default function ManagerMembersEnquiriesLoading() {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');
  return (
    <section className="mgr-page mgr-loading-state" aria-busy="true" aria-describedby="manager-feature-loading-message">
      <span className="mgr-skeleton mgr-skeleton-title" aria-hidden="true" />
      <span className="mgr-skeleton mgr-skeleton-line" aria-hidden="true" />
      <span className="mgr-skeleton mgr-skeleton-line" aria-hidden="true" />
      <p id="manager-feature-loading-message" role="status">{tManagerUi('loading_this_section')}</p>
    </section>
  );
}
