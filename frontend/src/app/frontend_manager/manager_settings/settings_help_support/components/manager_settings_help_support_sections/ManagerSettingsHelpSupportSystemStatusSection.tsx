// RESPONSIBILITY: Render the settings help support system status section section of the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { CircleHelp, Server, Database, Globe } from 'lucide-react';

export function ManagerSettingsHelpSupportSystemStatusSection() {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const systems = [
    { labelKey: 'system_api_services', icon: Server },
    { labelKey: 'system_database_clusters', icon: Database },
    { labelKey: 'system_cdn_assets', icon: Globe },
  ];

  return (
    <section className="motion-safe:transition-all motion-safe:duration-base max-w-5xl" aria-labelledby="manager-system-status-title">
      <div className="mgr-card p-8 mb-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-warning-bg flex items-center justify-center text-warning mb-4">
          <CircleHelp size={32} aria-hidden="true" />
        </div>
        <h2 id="manager-system-status-title" className="text-2xl font-black text-primary mb-2">{tManagerUi('system_status_unavailable')}</h2>
        <p className="text-secondary" role="status">{tManagerUi('system_status_contract_missing')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systems.map((system) => (
          <div key={system.labelKey} className="mgr-card p-6 flex flex-col">
            <div className="flex items-center gap-3 text-primary font-bold text-lg mb-4">
              <system.icon className="text-secondary" aria-hidden="true" />
              <span>{tManagerUi(system.labelKey)}</span>
            </div>
            <p className="text-sm text-secondary">{tManagerUi('status_not_verified')}</p>
            <p className="text-sm text-secondary mt-2">{tManagerUi('uptime_not_available')}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
