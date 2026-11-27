// components/SuperadminIntegrationsOverviewGatewayGrid.tsx
// RESPONSIBILITY: Render categorized filter pills, search input, and responsive grid of gateway cards.
// DATA FLOW: Gateways array -> SuperadminIntegrationsOverviewGatewayGrid -> GatewayCards.
'use client';

import { Search, X } from 'lucide-react';
import React from 'react';
import { INTEGRATION_CATEGORIES } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/constants/superadmin_integrations_overview.constants';
import type { IntegrationGatewayItem } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/types/superadmin_integrations_overview.types';
import { SuperadminIntegrationsOverviewEmptyState } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewEmptyState';
import { SuperadminIntegrationsOverviewGatewayCard } from '@/app/frontend_superadmin/superadmin_integrations/integrations_overview/components/SuperadminIntegrationsOverviewGatewayCard';

interface SuperadminIntegrationsOverviewGatewayGridProps {
  gateways: IntegrationGatewayItem[];
  selectedCategory: string;
  searchQuery: string;
  onSelectCategory: (cat: string) => void;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
  onConfigure: (gw: IntegrationGatewayItem) => void;
  onToggle: (id: string, currentEnabled: boolean) => void;
  onTestPing: (id: string) => void;
  togglingGatewayId?: string | null;
  pingingGatewayId?: string | null;
}

export const SuperadminIntegrationsOverviewGatewayGrid: React.FC<
  SuperadminIntegrationsOverviewGatewayGridProps
> = ({
  gateways,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
  onResetFilters,
  onConfigure,
  onToggle,
  onTestPing,
  togglingGatewayId,
  pingingGatewayId,
}) => {
  return (
    <div className="space-y-5" data-testid="superadmin-integrations-gateway-grid">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          {INTEGRATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl motion-safe:transition-all cursor-pointer select-none whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/25'
                    : 'bg-slate-900/80 border border-indigo-500/20 text-slate-300 hover:bg-slate-800/80 hover:text-slate-100'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Search Input with Cyber Luxury Styling */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input maxLength={100}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search providers, gateways..."
            className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Grid or Empty State */}
      {gateways.length === 0 ? (
        <SuperadminIntegrationsOverviewEmptyState onResetFilters={onResetFilters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gateways.map((gw) => (
            <SuperadminIntegrationsOverviewGatewayCard
              key={gw.id}
              gateway={gw}
              onConfigure={onConfigure}
              onToggle={onToggle}
              onTestPing={onTestPing}
              isToggling={togglingGatewayId === gw.id}
              isPinging={pingingGatewayId === gw.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
