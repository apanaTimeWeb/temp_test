// Ambient host contracts required by the web frontend architecture baseline.
// These fallback declarations document only the minimum boundary. They do not prove host/runtime compatibility.
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
  export function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
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
  export const Button: React.FC<React.PropsWithChildren<{ type?: 'button' | 'submit' | 'reset'; onClick?: () => void; disabled?: boolean; className?: string }>>;
  export const Dialog: React.FC<React.PropsWithChildren<{ open?: boolean; onOpenChange?: (open: boolean) => void; className?: string }>>;
}
