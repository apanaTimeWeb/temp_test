// contracts/host-stubs.d.ts
// Ambient host contracts enabling 100% standalone compilation & execution when zipped
declare module '@/lib/api' {
  export interface ApiSuccess<T> {
    success: true;
    message: string;
    data: T;
    meta?: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
    requestId: string;
  }
  export interface ApiFailure {
    success: false;
    message: string;
    data: null;
    error?: string;
    errorCode: string;
    statusCode: number;
    requestId: string;
    validationErrors?: Array<{ field: string; message: string }>;
  }
  export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
  export interface ApiFetchOptions extends RequestInit {
    idempotencyKey?: string;
    locale?: string;
  }
  export function apiFetch<T>(endpoint: string | URL | Request, options?: ApiFetchOptions): Promise<ApiResponse<T>>;
  export function createIdempotencyKey(): string;
}

declare module '@/lib/logger' {
  export const logger: {
    info: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    debug: (message: string, ...args: unknown[]) => void;
  };
}

declare module '@/lib/socket' {
  export const socketService: {
    subscribe: <T>(event: string, callback: (data: T) => void) => () => void;
    emit: (event: string, payload: unknown) => void;
  };
}

declare module '@/lib/display_value' {
  export function displayValue(value: unknown, fallback?: string): string;
}

declare module '@/components/ui/*' {
  import type React from 'react';
  export type StubComponentProps = React.PropsWithChildren<Record<string, unknown>>;
  const Component: React.FC<StubComponentProps>;
  export default Component;
  export const Button: React.FC<StubComponentProps>;
  export const Dialog: React.FC<StubComponentProps>;
  export const Input: React.FC<StubComponentProps>;
  export const Card: React.FC<StubComponentProps>;
}
