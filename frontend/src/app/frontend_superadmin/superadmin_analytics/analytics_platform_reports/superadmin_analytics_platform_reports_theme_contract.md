# Superadmin Analytics Platform Reports — Theme Contract

## Consumed Design Tokens

This autonomous sub-module consumes the following CSS variable tokens defined in `globals.css` and mapped via `@theme inline`:

### Surface & Background Tokens
- `var(--bg-page)` / `bg-background`: Main container canvas.
- `var(--bg-card)` / `bg-card`: Metric cards, chart containers, table shells.
- `var(--bg-muted)` / `bg-muted`: Input backgrounds, skeleton loaders, row hover states.

### Border & Divider Tokens
- `var(--border)` / `border-border`: Subtle structural card and table dividers.
- `var(--border-focus)` / `focus:ring-sky-500`: Focused input and select borders.

### Typography Tokens
- `var(--text-primary)` / `text-foreground`: Primary titles, table headings, and data values.
- `var(--text-secondary)` / `text-muted-foreground`: Subtitles, field labels, metadata.

### Status Accent Tokens
- `text-emerald-400`, `bg-emerald-500/10`, `border-emerald-500/30`: Active account and paid badges.
- `text-amber-400`, `bg-amber-500/10`, `border-amber-500/30`: Suspended and pending badges.
- `text-rose-400`, `bg-rose-500/10`, `border-rose-500/30`: Churned and failed badges.
- `text-sky-400`, `bg-sky-500/10`, `border-sky-500/30`: Platform branding and active navigation indicators.
