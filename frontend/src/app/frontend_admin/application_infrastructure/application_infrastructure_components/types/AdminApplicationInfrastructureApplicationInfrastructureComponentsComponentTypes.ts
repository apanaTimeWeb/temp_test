import type { ReactNode } from 'react';

export interface AdminQueryProviderProps {
  children: ReactNode;
}

export interface AdminShellHeaderProps {
  onMobileOpen?: () => void;
}
