// Ambient stubs for contracts and external modules.
declare module '@/lib/api' {
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errorCode?: string;
  }
}
