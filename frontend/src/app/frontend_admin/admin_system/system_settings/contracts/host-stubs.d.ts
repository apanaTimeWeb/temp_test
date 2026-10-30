/** Standalone declarations for architecture-approved host infrastructure used by this autonomous sub-module. */
declare module '@/lib/api' {
  export function apiFetch<TResponse = unknown>(path: string, options?: RequestInit): Promise<TResponse>;
}
declare module '@/lib/logger' {
  export const logger: { debug?: (...args: unknown[]) => void; info?: (...args: unknown[]) => void; warn?: (...args: unknown[]) => void; error?: (...args: unknown[]) => void };
}
declare module '@/components/ui/*' {
  import type { ComponentType, HTMLAttributes } from 'react';
  const HostUiPrimitive: ComponentType<HTMLAttributes<HTMLElement>>;
  export default HostUiPrimitive;
}
declare module '@/lib/socket' {
  export function getSocket(): unknown;
}
declare module '@/lib/display_value' {
  export function displayValue(value: string | number | boolean | null | undefined, fallback?: string): string;
}
