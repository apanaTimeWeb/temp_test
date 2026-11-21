// RESPONSIBILITY: Thin orchestrator client component for SuperAdmin Feature & Module Governance.
'use client';

import React, { useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useSuperadminFeaturesOverviewState } from '@/app/frontend_superadmin/superadmin_features/features_overview/hooks/useSuperadminFeaturesOverviewState';
import { useSuperadminFeaturesOverviewConfirm } from '@/app/frontend_superadmin/superadmin_features/features_overview/hooks/useSuperadminFeaturesOverviewConfirm';
import SuperadminFeaturesOverviewHeaderKpis from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewHeaderKpis';
import SuperadminFeaturesOverviewScopeSelector from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewScopeSelector';
import SuperadminFeaturesOverviewCategoryTabs from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewCategoryTabs';
import SuperadminFeaturesOverviewModuleCard from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewModuleCard';
import SuperadminFeaturesOverviewMatrixTable from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewMatrixTable';
import SuperadminFeaturesOverviewOverrideModal from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewOverrideModal';
import SuperadminFeaturesOverviewApiGuardSimulatorModal from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewApiGuardSimulatorModal';
import SuperadminFeaturesOverviewConfirmModal from '@/app/frontend_superadmin/superadmin_features/features_overview/components/SuperadminFeaturesOverviewConfirmModal';

export default function SuperadminFeaturesOverviewPageClient() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const {
    platformStates,
    overrides,
    selectedTenantId,
    selectedBranchId,
    selectedTenant,
    selectedBranch,
    categoryFilter,
    searchQuery,
    notification,
    isOverrideModalOpen,
    isApiGuardModalOpen,
    targetModule,
    computedModules,
    filteredModules,
    tenantsList,
    setSelectedTenantId,
    setSelectedBranchId,
    setCategoryFilter,
    setSearchQuery,
    togglePlatformDefault,
    togglePlanEntitlement,
    toggleLibraryModule,
    resetModuleOverride,
    enableAllForCurrentScope,
    disableAllForCurrentScope,
    resetAllForCurrentScope,
    saveOverride,
    removeOverride,
    openOverrideModalForModule,
    openApiGuardModalForModule,
    closeOverrideModal,
    closeApiGuardModal,
  } = useSuperadminFeaturesOverviewState();

  const { dialogState, requestConfirm, closeConfirm, handleConfirmed } =
    useSuperadminFeaturesOverviewConfirm();

  // Guarded toggle for platform killswitch on critical modules
  const handleTogglePlatform = (moduleId: string) => {
    const isCurrentlyOn = platformStates.find((s) => s.moduleId === moduleId)?.platformDefault;
    if (isCurrentlyOn) {
      requestConfirm({
        title: 'Platform Killswitch Warning',
        message:
          'Disabling this module at the Platform Default level will globally block it across ALL libraries and branches immediately. Backend API will deny all related requests (HTTP 403). Are you sure?',
        confirmLabel: 'Yes, Killswitch Globally',
        isDestructive: true,
        onConfirm: () => togglePlatformDefault(moduleId),
      });
    } else {
      togglePlatformDefault(moduleId);
    }
  };

  // Guarded override deletion
  const handleDeleteOverride = (overrideId: string) => {
    requestConfirm({
      title: 'Remove Custom Override',
      message: 'This will restore default plan and platform governance rules for this library. Continue?',
      confirmLabel: 'Remove Override',
      isDestructive: false,
      onConfirm: () => removeOverride(overrideId),
    });
  };

  const isGlobalScope = selectedTenantId === 'global';
  const effectiveTenantName = selectedTenant ? selectedTenant.name : 'Platform System';

  return (
    <div className="space-y-6">
      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[200] p-3.5 rounded-2xl border border-emerald-500/40 bg-slate-950/95 text-white shadow-2xl shadow-emerald-950/50 flex items-center gap-3 text-xs animate-in slide-in-from-bottom duration-200 backdrop-blur-xl">
          {notification.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <Info size={18} className="text-teal-400 shrink-0" />
          )}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Header and KPIs */}
      <SuperadminFeaturesOverviewHeaderKpis
        platformStates={platformStates}
        overrides={overrides}
      />

      {/* Scope Selector */}
      <SuperadminFeaturesOverviewScopeSelector
        tenantsList={tenantsList}
        selectedTenantId={selectedTenantId}
        selectedBranchId={selectedBranchId}
        selectedTenant={selectedTenant}
        selectedBranch={selectedBranch}
        onSelectTenant={setSelectedTenantId}
        onSelectBranch={setSelectedBranchId}
        onEnableAll={enableAllForCurrentScope}
        onDisableAll={disableAllForCurrentScope}
        onResetAll={resetAllForCurrentScope}
      />

      {/* Category Tabs & Search Bar */}
      <SuperadminFeaturesOverviewCategoryTabs
        categoryFilter={categoryFilter}
        searchQuery={searchQuery}
        viewMode={viewMode}
        totalCount={computedModules.length}
        filteredCount={filteredModules.length}
        onCategoryChange={setCategoryFilter}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
      />

      {/* View: Cards Grid or Matrix Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map(({ module: mod, state, effective }) => (
            <SuperadminFeaturesOverviewModuleCard
              key={mod.id}
              module={mod}
              state={state}
              effective={effective}
              isGlobalScope={isGlobalScope}
              onTogglePlatformDefault={handleTogglePlatform}
              onToggleLibraryModule={toggleLibraryModule}
              onResetLibraryModule={resetModuleOverride}
              onOpenOverride={openOverrideModalForModule}
              onOpenApiGuard={openApiGuardModalForModule}
            />
          ))}
        </div>
      ) : (
        <SuperadminFeaturesOverviewMatrixTable
          items={filteredModules}
          isGlobalScope={isGlobalScope}
          onTogglePlatformDefault={handleTogglePlatform}
          onTogglePlanEntitlement={togglePlanEntitlement}
          onToggleLibraryModule={toggleLibraryModule}
          onResetLibraryModule={resetModuleOverride}
          onOpenOverride={openOverrideModalForModule}
          onOpenApiGuard={openApiGuardModalForModule}
        />
      )}

      {/* Modals */}
      {isOverrideModalOpen && targetModule && (
        <SuperadminFeaturesOverviewOverrideModal
          module={targetModule}
          tenants={tenantsList}
          overrides={overrides}
          currentTenantId={selectedTenantId}
          onClose={closeOverrideModal}
          onSave={saveOverride}
          onDelete={handleDeleteOverride}
        />
      )}

      {isApiGuardModalOpen && targetModule && (
        <SuperadminFeaturesOverviewApiGuardSimulatorModal
          module={targetModule}
          effective={
            computedModules.find((m) => m.module.id === targetModule.id)?.effective ?? {
              moduleId: targetModule.id,
              moduleName: targetModule.name,
              isPlatformAllowed: true,
              isPlanAllowed: true,
              override: null,
              effectiveAllowed: true,
              reason: 'System default',
            }
          }
          tenantName={effectiveTenantName}
          onClose={closeApiGuardModal}
        />
      )}

      {/* Safe Non-Blocking Confirmation Modal */}
      <SuperadminFeaturesOverviewConfirmModal
        dialogState={dialogState}
        onConfirm={handleConfirmed}
        onCancel={closeConfirm}
      />
    </div>
  );
}