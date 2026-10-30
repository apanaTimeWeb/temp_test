import { ADMIN_BRAND_CONFIG } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminBrandConfig';
/** Non-sensitive default identity for the local-only branding preview. */
export const ADMIN_SYSTEM_BRANDING_PREVIEW_DEFAULTS = {
  libraryName: ADMIN_BRAND_CONFIG.displayName,
  tagline: 'Your Knowledge Hub',
} as const;
