// RESPONSIBILITY: Define stable module-owned constants for system backup configuration; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_system/system_backup_configuration/constants/SuperadminBackupConfigurationStaticConstants.ts -> typed constants -> component/hook/config behavior.



/** Static module-owned options/status mapping extracted from SuperadminBackupConfigurationBadge.tsx. */
export const SUPERADMIN_SYSTEM_BADGE_VARIANT_CLASS = {
  default: 'sys-badge--outline', primary: 'sys-badge--primary', success: 'sys-badge--success',
  warning: 'sys-badge--warning', danger: 'sys-badge--danger', info: 'sys-badge--info', outline: 'sys-badge--outline',
};


/** Static module-owned options/status mapping extracted from SuperadminBackupConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_SIZE = { sm: 'sys-btn--sm', md: '', lg: 'sys-btn--lg', icon: 'sys-btn--icon' };


/** Static module-owned options/status mapping extracted from SuperadminBackupConfigurationButton.tsx. */
export const SUPERADMIN_SYSTEM_BUTTON_VARIANT = {
  primary: 'sys-btn-primary', ghost: 'sys-btn-ghost', destructive: 'sys-btn-danger',
  secondary: 'sys-btn-ghost', link: 'sys-btn-link',
};

export const SUPERADMIN_BACKUP_PROVIDER_OPTIONS = [
  { value: 'Google Drive', labelKey: 'COPY.GOOGLE_DRIVE' },
  { value: 'AWS S3', labelKey: 'COPY.AWS_S3' },
  { value: 'Dropbox', labelKey: 'COPY.DROPBOX' },
  { value: 'Custom S3 Compatible', labelKey: 'COPY.CUSTOM_S3_COMPATIBLE' },
] as const;
