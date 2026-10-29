import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Vault | Library OS',
  description: 'Secure digital repository for member KYC verification documents, ID proofs, and compliance records',
};

export default function ManagerFeatureLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-document-vault-theme">{children}</div>;
}
