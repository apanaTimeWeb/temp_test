// RESPONSIBILITY: Declare host boundary contracts for security audit logs; ambient stubs provide no runtime implementation or authorization.
// FLOW: TypeScript/static validation -> superadmin_security/security_audit_logs/contracts/host-stubs.d.ts -> compile-time host boundary -> feature source.
/** Leaf-local host boundary declarations for standalone ZIP tooling. */

declare module '@/lib/api' {
  type HostApiSuccess<T> = { success: true; message: string; data: T; requestId: string; meta?: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean } };
  type HostApiFailure = { success: false; message: string; data: null; error?: string; errorCode: string; statusCode: number; requestId: string; validationErrors?: Array<{ field: string; message: string }> };
  export function apiFetch<T = unknown>(endpoint: string, options?: RequestInit): Promise<HostApiSuccess<T> | HostApiFailure>;
}

declare module '@/lib/logger' {
  export type LogContext = Readonly<Record<string, unknown>>;
  export interface Logger {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
  }
  export const logger: Logger;
  export function logError(error: unknown, context?: LogContext): void;
  export function logInfo(message: string, context?: LogContext): void;
  export function logWarn(message: string, context?: LogContext): void;
  export function logDebug(message: string, context?: LogContext): void;
}

declare module '@/components/ui/*' {
  import type { ComponentType } from 'react';
  const HostUiComponent: ComponentType<Record<string, unknown>>;
  export default HostUiComponent;
}
