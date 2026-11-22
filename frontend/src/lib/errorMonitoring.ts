export interface AdminErrorMonitoringContext {
  module: string;
  digest?: string;
}

interface AdminErrorMonitoringAdapter {
  captureException: (error: unknown, context: AdminErrorMonitoringContext) => void;
}

type AdminErrorMonitoringGlobal = typeof globalThis & { __ADMIN_ERROR_MONITOR__?: AdminErrorMonitoringAdapter };

export function reportAdminError(error: unknown, context: AdminErrorMonitoringContext): void {
  const globalScope = globalThis as AdminErrorMonitoringGlobal;
  globalScope.__ADMIN_ERROR_MONITOR__?.captureException(error, context);
}
