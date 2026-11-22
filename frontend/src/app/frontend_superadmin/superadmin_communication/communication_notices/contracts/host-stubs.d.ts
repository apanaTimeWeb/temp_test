// RESPONSIBILITY: Declare host boundary contracts for communication notices; ambient stubs provide no runtime implementation or authorization.
// FLOW: TypeScript/static validation -> superadmin_communication/communication_notices/contracts/host-stubs.d.ts -> compile-time host boundary -> feature source.
/** Leaf-local host boundary declarations for standalone ZIP tooling. */
// Declarations mirror only host imports actually consumed by this leaf; they do not implement runtime behavior.
declare module '@/lib/api' { export function apiFetch<T = unknown>(endpoint: string, options?: RequestInit): Promise<import('@/app/frontend_superadmin/superadmin_communication/communication_notices/contracts/SuperadminCommunicationNoticesApiResponse').ApiResponse<T>>; }

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

declare module '@/lib/socket' {
  export interface SocketLike {
    readonly connected: boolean;
    on(event: string, listener: (payload: unknown) => void): SocketLike;
    off(event: string, listener?: (payload: unknown) => void): SocketLike;
    emit(event: string, payload?: unknown): SocketLike;
    disconnect(): SocketLike;
  }
  export const socket: SocketLike;
  export function getSocket(): SocketLike;
}

declare module '@/lib/display_value' {
  export function displayValue<T extends string | number | boolean>(value: T | null | undefined): T | '—';
  export default displayValue;
}
