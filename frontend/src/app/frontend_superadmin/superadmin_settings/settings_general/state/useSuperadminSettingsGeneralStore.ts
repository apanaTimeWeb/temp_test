// RESPONSIBILITY: Module-scoped Zustand store for settings general transient UI state only; no API server data cached here.
// DATA FLOW: User UI interaction -> useSuperadminSettingsGeneralStore -> Component view state updates
import { create } from 'zustand';
import type { SettingsSectionId } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export interface SuperadminSettingsGeneralUIState {
  activeSection: SettingsSectionId;
  searchFilter: string;
  selectedTemplateKey: 'WELCOME' | 'PASSWORD_RESET' | 'DUE_REMINDER' | 'ANNOUNCEMENT';
  resetModalOpen: boolean;
  exportModalOpen: boolean;
  activePreviewMode: 'form' | 'summary';
  setActiveSection: (section: SettingsSectionId) => void;
  setSearchFilter: (query: string) => void;
  setSelectedTemplateKey: (templateKey: 'WELCOME' | 'PASSWORD_RESET' | 'DUE_REMINDER' | 'ANNOUNCEMENT') => void;
  setResetModalOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
  setActivePreviewMode: (mode: 'form' | 'summary') => void;
  resetAllUIState: () => void;
}

export const useSuperadminSettingsGeneralStore = create<SuperadminSettingsGeneralUIState>((set) => ({
  activeSection: 'all',
  searchFilter: '',
  selectedTemplateKey: 'WELCOME',
  resetModalOpen: false,
  exportModalOpen: false,
  activePreviewMode: 'form',
  setActiveSection: (activeSection) => set({ activeSection }),
  setSearchFilter: (searchFilter) => set({ searchFilter }),
  setSelectedTemplateKey: (selectedTemplateKey) => set({ selectedTemplateKey }),
  setResetModalOpen: (resetModalOpen) => set({ resetModalOpen }),
  setExportModalOpen: (exportModalOpen) => set({ exportModalOpen }),
  setActivePreviewMode: (activePreviewMode) => set({ activePreviewMode }),
  resetAllUIState: () => set({
    activeSection: 'all',
    searchFilter: '',
    selectedTemplateKey: 'WELCOME',
    resetModalOpen: false,
    exportModalOpen: false,
    activePreviewMode: 'form',
  }),
}));
