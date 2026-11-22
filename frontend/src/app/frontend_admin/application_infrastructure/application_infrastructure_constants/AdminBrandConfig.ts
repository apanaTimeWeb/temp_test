/** Single source for the configured application brand; components must not duplicate the literal. */
const name = 'Smart Library';
const suffix = 'Management';

export const ADMIN_BRAND_CONFIG = {
  name,
  suffix,
  displayName: `${name} ${suffix}`,
} as const;
