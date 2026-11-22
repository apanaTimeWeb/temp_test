# superadmin_navigation — Aggregated Theme Contract

This domain contract aggregates tokens observed in the current leaf source. It does not authorize new palette values.

| Token/class | Owning leaf modules |
|---|---|
| `CSS variable --bg-card` | `navigation_shell` |
| `CSS variable --bg-floating` | `navigation_shell` |
| `CSS variable --bg-header` | `navigation_shell` |
| `CSS variable --bg-input` | `navigation_shell` |
| `CSS variable --bg-overlay` | `navigation_shell` |
| `CSS variable --bg-page` | `navigation_shell` |
| `CSS variable --bg-sidebar` | `navigation_shell` |
| `CSS variable --border` | `navigation_shell` |
| `CSS variable --border-focus` | `navigation_shell` |
| `CSS variable --danger` | `navigation_shell` |
| `CSS variable --danger-bg` | `navigation_shell` |
| `CSS variable --danger-text` | `navigation_shell` |
| `CSS variable --focus-ring` | `navigation_shell` |
| `CSS variable --font-inter` | `navigation_shell` |
| `CSS variable --font-size-body` | `navigation_shell` |
| `CSS variable --font-size-caption` | `navigation_shell` |
| `CSS variable --font-size-section-title` | `navigation_shell` |
| `CSS variable --info` | `navigation_shell` |
| `CSS variable --info-bg` | `navigation_shell` |
| `CSS variable --info-text` | `navigation_shell` |
| `CSS variable --layout-content-padding` | `navigation_shell` |
| `CSS variable --layout-header-height` | `navigation_shell` |
| `CSS variable --layout-sidebar-width` | `navigation_shell` |
| `CSS variable --overlay-backdrop` | `navigation_shell` |
| `CSS variable --primary` | `navigation_shell` |
| `CSS variable --primary-hover` | `navigation_shell` |
| `CSS variable --primary-subtle` | `navigation_shell` |
| `CSS variable --purple-text` | `navigation_shell` |
| `CSS variable --radius-full` | `navigation_shell` |
| `CSS variable --radius-md` | `navigation_shell` |
| `CSS variable --radius-sm` | `navigation_shell` |
| `CSS variable --radius-xl` | `navigation_shell` |
| `CSS variable --sb-muted` | `navigation_shell` |
| `CSS variable --shadow-card` | `navigation_shell` |
| `CSS variable --shadow-dialog` | `navigation_shell` |
| `CSS variable --shadow-popover` | `navigation_shell` |
| `CSS variable --success` | `navigation_shell` |
| `CSS variable --success-bg` | `navigation_shell` |
| `CSS variable --success-text` | `navigation_shell` |
| `CSS variable --surface-highlight` | `navigation_shell` |
| `CSS variable --surface-hover` | `navigation_shell` |
| `CSS variable --surface-zebra` | `navigation_shell` |
| `CSS variable --table-row-height-compact` | `navigation_shell` |
| `CSS variable --text-disabled` | `navigation_shell` |
| `CSS variable --text-on-danger` | `navigation_shell` |
| `CSS variable --text-on-primary` | `navigation_shell` |
| `CSS variable --text-on-success` | `navigation_shell` |
| `CSS variable --text-primary` | `navigation_shell` |
| `CSS variable --text-secondary` | `navigation_shell` |
| `CSS variable --warning` | `navigation_shell` |
| `CSS variable --warning-bg` | `navigation_shell` |
| `CSS variable --warning-text` | `navigation_shell` |
| `bg-card` | `navigation_shell` |
| `bg-floating` | `navigation_shell` |
| `bg-header` | `navigation_shell` |
| `bg-input` | `navigation_shell` |
| `bg-overlay` | `navigation_shell` |
| `bg-page` | `navigation_shell` |
| `bg-primary-subtle` | `navigation_shell` |
| `bg-sidebar` | `navigation_shell` |
| `bg-surface-highlight` | `navigation_shell` |
| `bg-surface-hover` | `navigation_shell` |
| `bg-warning` | `navigation_shell` |
| `bg-warning-bg` | `navigation_shell` |
| `border-border` | `navigation_shell` |
| `border-bottom` | `navigation_shell` |
| `border-box` | `navigation_shell` |
| `border-collapse` | `navigation_shell` |
| `border-color` | `navigation_shell` |
| `border-focus` | `navigation_shell` |
| `border-left` | `navigation_shell` |
| `border-left-color` | `navigation_shell` |
| `border-r` | `navigation_shell` |
| `border-radius` | `navigation_shell` |
| `border-right` | `navigation_shell` |
| `border-right-color` | `navigation_shell` |
| `border-top` | `navigation_shell` |
| `border-top-color` | `navigation_shell` |
| `fill-opacity` | `navigation_shell` |
| `from-top-2` | `navigation_shell` |

## Constraints

- Preserve semantic token pairing, contrast, focus-visible states, responsive behavior, and reduced-motion support.
- No arbitrary hex colors were found by static source scan.
- Theme token presence is a static inventory, not a visual contrast/accessibility pass; browser verification remains deferred.

## Module Semantic Token Inventory (source-reconciled v19)

This inventory is derived from exact source observations in this leaf. Each row cites the local source file and 1-based line where the token is consumed. This is source evidence only; it does not establish that the host stylesheet maps the token.

| Semantic Tailwind token | Exact local source evidence |
|---|---|
| `bg-card` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:38`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:70` |
| `bg-primary-subtle` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:49` |
| `bg-surface-highlight` | `navigation_shell/components/SuperadminNavigationShellMain.tsx:30` |
| `bg-surface-hover` | `navigation_shell/components/SuperadminNavigationShellMain.tsx:31` |
| `bg-warning` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:87` |
| `bg-warning-bg` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:45` |
| `border-border` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:38`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:45`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:49`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:70`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:85` |
| `ring-primary` | `navigation_shell/components/SuperadminNavigationShellSidebar.tsx:85` |
| `text-info` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:75` |
| `text-primary` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:36`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:49`, `navigation_shell/components/SuperadminNavigationShellSidebar.tsx:57`, `navigation_shell/components/SuperadminNavigationShellSidebar.tsx:87` |
| `text-secondary` | `navigation_shell/components/SuperadminNavigationShellCommandPalette.tsx:19`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:36`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:37`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:39`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:71`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:74`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:77`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:89` |
| `text-success` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:72` |
| `text-warning` | `navigation_shell/components/SuperadminNavigationShellHeader.tsx:45`, `navigation_shell/components/SuperadminNavigationShellHeader.tsx:78` |

### Unverified semantic-like classes and source-level hazards

The following observations are not silently treated as canonical tokens. Review against the host `globals.css` / `@theme inline` mapping and repair source violations where indicated.

| Observed utility | Exact local source evidence |
|---|---|
| `border-bottom` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1171`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1303`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1306`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1330`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1954`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1981`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1988`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:226`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:445`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:589`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:43` |
| `border-box` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:16`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:25` |
| `border-collapse` | `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:140` |
| `border-color` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:112`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1135`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1138`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:116`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1192`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1228`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1261`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1431`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1434`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:145`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:153`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:155`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:158`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:163`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:201`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:202`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:203`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:204`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:205`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2157`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2162`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:411`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:427`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:429`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:462`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:464`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:52`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:577`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:582`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:684`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:689`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:694`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:699`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:70`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:73`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:895`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:979`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:986`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:987`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:988`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:989`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:73` |
| `border-left` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1095`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:285`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:612`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:999` |
| `border-left-color` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1002`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1003` |
| `border-radius` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1011`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1041`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1052`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:105`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1112`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1124`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1145`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1151`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1157`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1186`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1215`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1238`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1253`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1266`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1313`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1325`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:134`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1352`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1372`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1381`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1413`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1424`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1510`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1670`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1711`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:173`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1837`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1850`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1865`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1931`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:196`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1999`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2050`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2086`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2119`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:211`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2170`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2195`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2199`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2205`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2212`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2221`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2225`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:248`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:273`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:332`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:365`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:368`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:369`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:370`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:376`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:389`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:405`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:420`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:434`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:456`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:469`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:47`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:509`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:544`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:571`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:598`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:60`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:628`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:639`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:657`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:672`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:705`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:712`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:718`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:729`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:758`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:784`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:808`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:820`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:838`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:857`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:880`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:902`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:925`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:951`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:964`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:976`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:997`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:115`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:33`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:66`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:83` |
| `border-right` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1486`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:279`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:522` |
| `border-right-color` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:286` |
| `border-top` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1030`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1644`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2057` |
| `border-top-color` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:378`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:786` |
| `text-align` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1652`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:116`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:118`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:69`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:75`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:83` |
| `text-decoration` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1000`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1134`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1658`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1983`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:277`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:143`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:9` |
| `text-overflow` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1597`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1605`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1906`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1913`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:2040`, `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:74` |
| `text-shadow` | `navigation_shell/components/SuperadminNavigationShellsuperadmin_navigation.css:139` |
| `text-transform` | `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1058`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1291`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1395`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1579`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1629`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:1705`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:231`, `navigation_shell/components/SuperadminNavigationShellsuperadmin.css:84` |

- Host token mapping: `NOT_VERIFIED` (host `globals.css`/Tailwind mapping is outside this role ZIP).
