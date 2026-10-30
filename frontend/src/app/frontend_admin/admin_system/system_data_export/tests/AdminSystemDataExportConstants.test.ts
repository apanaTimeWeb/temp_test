import { describe, expect, it } from 'vitest';
import englishMessages from '@/app/frontend_admin/admin_system/system_data_export/locales/admin_system_data_export_en.json';
import hindiMessages from '@/app/frontend_admin/admin_system/system_data_export/locales/admin_system_data_export_hi.json';
import { ADMIN_SYSTEM_DATA_EXPORT_MODULES, ADMIN_SYSTEM_QUICK_EXPORTS } from '@/app/frontend_admin/admin_system/system_data_export/config/admin_system_data_export_constants';

const english = englishMessages.ADMIN_SYSTEM_DATA_EXPORT;
const hindi = hindiMessages.ADMIN_SYSTEM_DATA_EXPORT;

describe('Admin System Data Export locale/config contract', () => {
  it('contains matching English/Hindi keys', () => {
    expect(Object.keys(english).sort()).toEqual(Object.keys(hindi).sort());
  });

  it('provides localized labels/descriptions for every module and quick export', () => {
    for (const module of ADMIN_SYSTEM_DATA_EXPORT_MODULES) {
      expect(english[module.labelKey]).toBeTruthy();
      expect(hindi[module.labelKey]).toBeTruthy();
      expect(english[module.descriptionKey]).toBeTruthy();
      expect(hindi[module.descriptionKey]).toBeTruthy();
    }
    for (const quickExport of ADMIN_SYSTEM_QUICK_EXPORTS) {
      expect(english[quickExport.labelKey]).toBeTruthy();
      expect(hindi[quickExport.labelKey]).toBeTruthy();
      expect(english[quickExport.descriptionKey]).toBeTruthy();
      expect(hindi[quickExport.descriptionKey]).toBeTruthy();
    }
  });
});
