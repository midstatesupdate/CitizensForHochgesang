# Web App

Next.js campaign website for Citizens for Hochgesang.

## Definition
This app renders the public campaign experience: candidate messaging, news/articles, events, media links (YouTube/Facebook), and fundraising calls to action.

## Implemented Routes
- `/`: Campaign homepage with CMS-backed sections for recent news, events, media, and support.
- `/news`: News and article listing.
- `/news/[slug]`: Individual article pages with scene-based storytelling blocks (animated on scroll).
- `/events`: Campaign events listing.
- `/faq`: Interactive FAQ experience with category filters, search, and accordion controls.
- `/media`: External media links (YouTube/Facebook/audio/other).
- `/press`: Press contacts, logo access, and recent updates.
- `/support`: Volunteer, contact, fundraising, district map, voter registration tools, and engagement checklist.
- Route-level loading states: `app/loading.tsx` plus per-route `loading.tsx` files.
- Custom 404 page: `app/not-found.tsx`.
- Homepage hero includes campaign logo when `siteSettings.campaignLogo` is available.
- Homepage hero portrait uses `siteSettings.candidatePortrait` (fallback to campaign logo).
- Homepage hero composition is CMS-selectable via `siteSettings.homeHeroLayout` (`clean-split`, `portrait-left`, `immersive-overlay`).

## Quick Links
- [`../README.md`](../README.md): Repository root and cross-project docs index.
- [`src/README.md`](src/README.md): Web source map for routes/components/styles.
- [`../studio/schemaTypes/README.md`](../studio/schemaTypes/README.md): Sanity content model definitions used by this app.

## Development

From repo root:

```bash
pnpm dev:web
```

Or from this folder:

```bash
pnpm dev
```

### Environment Profiles (Non-VS Code)

Production profile:

```bash
Copy-Item .env.production.local.example .env.local
pnpm dev
```

Development profile:

```bash
Copy-Item .env.development.local.example .env.local
pnpm dev
```

Profile templates:
- `.env.production.local.example`
- `.env.development.local.example`

Cloudflare production variables for web runtime:
- `NEXT_PUBLIC_SANITY_PROJECT_ID=n2oyijjv`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19`

Note: `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` are Studio variables and are not read by the Next.js web app.

## Build

From repo root:

```bash
pnpm build:web
```

Verify Sanity published content status:

```bash
pnpm verify:sanity
```

Run published-link integrity checks:

```bash
pnpm check:links
```

Run freshness checks for events/posts:

```bash
pnpm check:freshness
```

## Operations Docs
- `ACCESSIBILITY_CHECKLIST.md`: Route-by-route accessibility QA checklist.
- `IMAGE_GUIDELINES.md`: Image dimensions, crop guidance, and route usage.
- `ANALYTICS_PLAN.md`: Neutral measurement and reporting plan.
- `PUBLISHING_CHECKLIST.md`: Pre/post publish operational runbook.

## Best Practices
- Prefer Sanity-backed content over hardcoded UI copy.
- Keep route components small and move shared logic to reusable modules.
- Preserve mobile-first readability and clear campaign CTAs.
- Keep metadata accurate (page title/description) for shareability and search.
- Tailwind theming lives in `src/app/globals.css` with semantic dark/light palettes.
- Theme preference persists in browser local storage (`cfh-theme`) via `ThemeToggle` in the header; default is dark mode.
- Shared interaction affordances (hover, cursor, focus, button lift states, badges) are centralized in `src/app/globals.css` utility classes.
- Primary navigation now highlights the current menu item and a subtle global breadcrumb bar appears under the header for route context.
- Header/navigation is responsive across common viewport sizes; desktop nav now switches to a hamburger panel earlier (below large widths) to preserve a fixed two-line brand lockup in the home link.
- Theme toggle in the header is intentionally icon-only across all breakpoints.
- Home hero variant styling keeps portrait reordering at `md+` only, keeps the proof strip full-width in split layouts, and scopes immersive overlay positioning to the hero frame.
- `siteSettings` and `pageVisualSettings` fetch with `cache: 'no-store'` during local runtime (`next dev`) so visual toggles (like homepage hero layout) reflect immediately after publish.
- During static production builds, those same queries automatically use revalidated fetch to avoid falling back to mock content.
- When previewing via static export output (`web/out`), CMS changes only appear after rebuilding/exporting the site.
- Per-page background/tone/container visuals are controlled in Sanity via `pageVisualSettings` and consumed in route shells.
- Full-page background animation, text-link animation, motion intensity, and scroll reveal dynamics are controlled per route via `pageVisualSettings`.
- Background animations are disabled by default for low-noise operation.
- Set `NEXT_PUBLIC_ENABLE_BG_ANIMATIONS=1` to re-enable per-page CMS background animation classes (`drift`, `tracers`, `pulse`, etc.).
- Set `NEXT_PUBLIC_BG_ANIM_STEPPED=1` (with background animations enabled) to reduce visual update frequency via stepped timing while keeping each animation's total duration unchanged.
- Long-form article storytelling controls are authored in Sanity `post.body` via `Story Scene` and `Stat Callout` blocks with per-element animation presets, delay, and duration.
- Site statistics tracking is enabled via Vercel Analytics (`@vercel/analytics`) in the root layout.
- Repository calls in `src/lib/cms/repository.ts` intentionally fall back to
	`src/lib/cms/mockData.ts` when Sanity content is unavailable, so local UI
	development remains functional.
- Link handling is normalized through `src/components/cms-link.tsx`: internal
	paths stay in-app while external URLs open in a new tab.
- Site branding pulls from `siteSettings.campaignLogo` and related image fields
	in Sanity when available.
- SEO/discovery infrastructure includes metadata templates, `sitemap.xml`, and
	`robots.txt` routes.
