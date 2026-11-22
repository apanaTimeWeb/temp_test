// contracts/host-stubs.d.ts
declare module '@/lib/api' {
  export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message?: string;
    errorCode?: string;
    requestId?: string;
  }
  export function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>>;
}
