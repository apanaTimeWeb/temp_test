declare module '@/lib/runtimeFeatures' {
  export function isFrontendDemoModeEnabled(): boolean;
}
declare module '@/lib/errorMonitoring' {
  export function reportAdminError(error: Error, context?: Record<string, unknown>): void;
}
export {};
