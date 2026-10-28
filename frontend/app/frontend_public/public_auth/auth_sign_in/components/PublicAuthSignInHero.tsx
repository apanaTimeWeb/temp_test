import { BookOpen } from 'lucide-react';

interface PublicAuthSignInHeroProps { brand: string; eyebrow: string; heading: string; description: string; footer: string; }

/** RESPONSIBILITY: Display the desktop brand and sign-in introduction. FLOW: localized props -> decorative hero. */
export default function PublicAuthSignInHero({ brand, eyebrow, heading, description, footer }: PublicAuthSignInHeroProps) {
  return (
    <aside className="hidden flex-col justify-between border-r border-border bg-sidebar p-10 lg:flex xl:p-14">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary"><BookOpen size={18} strokeWidth={2} aria-hidden="true" /></span>
        <span className="text-xl font-bold">{brand}</span>
      </div>
      <div className="max-w-xl space-y-5">
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary">{eyebrow}</p>
        <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">{heading}</h1>
        <p className="max-w-lg text-base leading-relaxed text-secondary">{description}</p>
      </div>
      <p className="text-xs text-secondary">{footer}</p>
    </aside>
  );
}
