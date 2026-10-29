// RESPONSIBILITY: Render the settings help support help center section section of the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
import { Book, Video, Users } from 'lucide-react';

export function ManagerSettingsHelpSupportHelpCenterSection() {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 motion-safe:transition-all motion-safe:duration-base">
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-info">
            <div className="w-12 h-12 rounded-xl bg-info-bg flex items-center justify-center text-info mb-4 motion-safe:transition-transform">
              <Book size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('knowledge_base')}</h3>
            <p className="text-sm text-secondary mb-4 flex-1">{tManagerUi('read_detailed_guides_and_articles_on_how_to_use_all_mana_87e84f')}</p>
            <span className="text-info text-sm font-bold">{tManagerUi('resource_link_unavailable')}</span>
          </div>
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-secondary">
            <div className="w-12 h-12 rounded-xl bg-purple-bg flex items-center justify-center text-purple mb-4 motion-safe:transition-transform">
              <Video size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('video_tutorials')}</h3>
            <p className="text-sm text-secondary mb-4 flex-1">{tManagerUi('watch_step_by_step_videos_to_master_the_library_os_crm_a_9308ee')}</p>
            <span className="text-purple text-sm font-bold">{tManagerUi('resource_link_unavailable')}</span>
          </div>
          <div className="mgr-card p-6 flex flex-col items-start border-t-4 border-t-success">
            <div className="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center text-success mb-4 motion-safe:transition-transform">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">{tManagerUi('community_forum')}</h3>
            <p className="text-sm text-secondary mb-4 flex-1">{tManagerUi('join_other_library_managers_to_share_tips_tricks_and_fea_2cacc8')}</p>
            <span className="text-success text-sm font-bold">{tManagerUi('resource_link_unavailable')}</span>
          </div>
    </div>
  );
}
