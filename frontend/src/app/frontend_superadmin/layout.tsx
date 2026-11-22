// RESPONSIBILITY: Render the navigation/layout boundary for Superadmin; it does not own leaf business workflows.
// FLOW: Domain route -> layout.tsx -> role-level navigation registry and child route content.
import '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellsuperadmin.css';
import '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css';
import SuperadminNavigationMain from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/components/SuperadminNavigationShellMain';
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';

const superadminInter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

/**
 * Performs the super admin root layout operation within the Superadmin role shell; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: { children: React.ReactNode; }.
 */
export default function SuperAdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={superadminInter.variable}><SuperadminNavigationMain>{children}</SuperadminNavigationMain><Toaster position="bottom-right" richColors /></div>;
}
