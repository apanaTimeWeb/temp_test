/**
 * Host authentication and session helper.
 */

export function clearAuthState(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_user');
      sessionStorage.clear();
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    } catch {
      // Storage access resilience
    }
  }
}

export function getCurrentUser(): { role?: string; [key: string]: unknown } | null {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('user') || localStorage.getItem('admin_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
  }
  return null;
}
