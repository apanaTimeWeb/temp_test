'use client';

import { FileText, Layers } from 'lucide-react';

interface AdminCommunicationWhatsappTemplatesKpiGridProps {
  templateCount: number;
  categoryCount: number;
  variableCount: number;
}

export function AdminCommunicationWhatsappTemplatesKpiGrid({
  templateCount,
  categoryCount,
  variableCount,
}: AdminCommunicationWhatsappTemplatesKpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="group relative overflow-hidden rounded-2xl border border-info bg-card p-5 shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:border-primary">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">System Templates</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-info-bg border-info text-info-text">
            <FileText size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-text-primary">{templateCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-info-text bg-info-bg border-info">
            Welcome & Official Notices
          </span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-success bg-card p-5 shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:border-primary">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Template Categories</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-success-bg border-success text-success-text">
            <Layers size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-success-text">{categoryCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-success-text bg-success-bg border-success">
            Onboarding & Announcements
          </span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl border border-purple-text bg-card p-5 shadow-lg motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:border-primary">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Dynamic Tokens</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-purple-bg border-purple-text text-purple-text">
            <Layers size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-purple-text">{variableCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-purple-text bg-purple-bg border-purple-text">
            Auto-Populating Student Tags
          </span>
        </div>
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappTemplatesKpiGrid;
