// FLOW: Appearance preview controls -> local validation schema -> preview-only local state; no server mutation contract is supplied.
/** Runtime validation for the two appearance preview controls owned by this leaf. */
import { z } from 'zod';

export const SUPERADMIN_SETTINGS_APPEARANCE_PREVIEW_SCHEMA = z.object({
  previewDensity: z.enum(['comfortable', 'compact']),
  previewAccent: z.enum(['neutral', 'highlighted']),
});
