import { frontendRuntimeConfig } from '@/lib/env';

/** Global, non-business runtime flags shared by the frontend integration. */
export function isFrontendDemoModeEnabled(): boolean {
  return frontendRuntimeConfig.NODE_ENV !== 'production' && frontendRuntimeConfig.NEXT_PUBLIC_FRONTEND_DEMO_MODE === 'true';
}
