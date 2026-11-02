# Theme Contract — Admin Assets Register

## Consumed Design Tokens

| UI Surface / Element | Token Class | Purpose |
| :--- | :--- | :--- |
| Page Canvas | `bg-canvas` | Top-level background |
| Cards & Table Container | `bg-card`, `border-border` | Layer 1 surface elevation |
| Table Header Row | `bg-muted/60`, `text-muted-foreground` | Header differentiation |
| Table Row Hover | `hover:bg-muted/30` | Subtle interactive hover |
| Focus Rings | `focus-visible:ring-2 focus-visible:ring-primary` | Accessible focus state |
| Active AMC Badge | `bg-success-bg`, `text-success-text`, `border-success/30` | Active vendor contract |
| OEM Warranty Badge | `bg-blue-500/10`, `text-blue-600`, `border-blue-500/30` | Manufacturer warranty |
| Expired / No AMC Badge | `bg-destructive/15`, `text-destructive`, `border-destructive/30` | Unprotected asset alert |
| Expiring Soon Alert | `bg-amber-500/15`, `text-amber-700` | <= 30 days to warranty expiry |
| Primary Action Buttons | `bg-primary`, `text-primary-foreground`, `hover:bg-primary/90` | Main interactive actions |
| Skeleton Loaders | `bg-surface-highlight`, `motion-safe:animate-pulse` | Loading layout skeleton |

