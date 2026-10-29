/** Minimal host infrastructure declarations for standalone module checks; actual implementations remain host-owned. */
declare module '@/lib/api' {
  export function apiFetch(input: string, init?: RequestInit): Promise<Response>;
}
declare module '@/lib/logger' {
  export namespace logger {
    function info(...args: unknown[]): void;
    function warn(...args: unknown[]): void;
    function error(...args: unknown[]): void;
  }
}
declare module '@/lib/socket' {
  export namespace socket {
    function on(event: string, handler: (...args: unknown[]) => void): unknown;
    function off(event: string, handler?: (...args: unknown[]) => void): unknown;
    function emit(event: string, ...args: unknown[]): unknown;
  }
}
declare module '@/lib/display_value' {
  export function displayValue(value: unknown): string;
}
declare module '@/components/ui/*' {
  export default function Component(props: Record<string, unknown>): import('react').ReactElement;
}
