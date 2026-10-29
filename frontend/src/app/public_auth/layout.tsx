import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], display: 'swap', preload: false });

/**
 * Owns auth-subtree font selection and semantic surface inheritance without adding business logic.
 * Dependencies: next-intl's request locale and the global CSS/Tailwind token contract.
 * Edge cases: Hindi uses Devanagari glyphs; its font is not preloaded for other locales. The host must provide a valid next-intl request configuration.
 */
export default async function PublicAuthLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const localeFontClass = locale === 'hi' ? devanagari.className : inter.className;
  return <div className={`${localeFontClass} min-h-screen bg-page text-primary`}>{children}</div>;
}
