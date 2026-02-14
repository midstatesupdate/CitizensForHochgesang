# Studio

Sanity Studio for campaign content management.

## Definition
This app is the editorial control plane for campaign content, including posts, events, media links, fundraising links, About & Priorities page content, and site-wide settings.

## Quick Links
- [`../README.md`](../README.md): Repository root and docs index.
- [`schemaTypes/README.md`](schemaTypes/README.md): Field-by-field schema dictionary.
- [`../web/README.md`](../web/README.md): Frontend app that consumes this content.
- [`chat-content/README.md`](chat-content/README.md): Prompt templates for chat-driven content creation.

## Current Studio Target
- Project ID: `n2oyijjv`
- Dataset: `production`

The Studio and CLI configs now support environment overrides:
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET`

Examples:

```bash
$env:SANITY_STUDIO_PROJECT_ID='n2oyijjv'
$env:SANITY_STUDIO_DATASET='development'
pnpm -C studio dev
```

## VS Code Launch Profiles
Use Run and Debug with the workspace launch configurations in `.vscode/launch.json`:
- `Campaign Stack (Production)`
- `Campaign Stack (Development)`
- `Web: Dev (Production)` / `Web: Dev (Development)`
- `Studio: Dev (Production)` / `Studio: Dev (Development)`

## Development

From repo root:

```bash
pnpm dev:studio
```

Preferred fixed local port:

```bash
pnpm -C studio dev -- --port 3333
```

Or from this folder:

```bash
pnpm dev
```

## Build

From repo root:

```bash
pnpm build:studio
```

## Dependency Changes (Important)
If you add/update/remove dependencies for Studio, always sync lockfiles from repository root:

```bash
pnpm install
pnpm install --frozen-lockfile
```

Commit `pnpm-lock.yaml` together with any `studio/package.json` changes. Cloudflare/CI runs install with frozen lockfile and will fail if the root lockfile is stale.

## Branding Data Apply
From repo root, apply campaign logo + core URLs to Sanity:

```bash
$env:LOGO_PATH="C:\\path\\to\\logo_full_size.png"
pnpm -C studio apply:branding
```

`apply:branding` now sets both `siteSettings.campaignLogo` and `siteSettings.headerLogoSmall` from the uploaded asset by default (you can later replace `headerLogoSmall` in Studio with a purpose-built small-format logo).

Set a temporary homepage candidate portrait (replace later in Studio → Site Settings):

```bash
pnpm -C studio set:temp-portrait
```

Seed baseline content documents (posts/events/media):

```bash
pnpm -C studio seed:content
```

Quick one-command debug reseed alias (development dataset defaults):

```bash
pnpm -C studio seed:debug
```

Wipe development content docs and fully replace with fresh debug seed content:

```bash
pnpm -C studio seed:debug:reset
```

`seed:content` now creates 24 upcoming sample events with mixed card layouts, uploaded sample images, broad tag coverage for events-page infinite-scroll/tag-filter QA, event slugs + event detail-body/link content for `/events/details#slug`, and end date/times so automatic passed-state behavior can be tested.

It also seeds 10 sample news posts for richer debug/article-list testing in development datasets.

It also seeds the `aboutPriorities` singleton with article-style `bioBody` content and per-priority detail slugs/body/links for `/platform/[slug]` drill-down pages.

Seed production `siteSettings` defaults for only missing home hero/list fields (never overwrites existing values):

```bash
pnpm -C studio seed:site-settings:production
```

This command only uses `setIfMissing` for:
- `homeHeroActions`
- `homeHeroBadges`
- `homeFocusItems`
- `homeSectionCards`

Normalize `siteSettings` shape/defaults (forces `homeHeroLayout` to `clean-split` and converts legacy rich-text lockup blocks to HTML markup):

```bash
pnpm -C studio normalize:site-settings
```

Seed long-form sample posts that showcase the interactive reading experience:

```bash
pnpm -C studio seed:experience
```

Seed news-list layout samples (uploads generated mixed-ratio sample images and creates posts covering layout/aspect/animation combinations):

```bash
pnpm -C studio seed:news-layout-samples
```

Sync per-page visual settings to current website defaults:

```bash
pnpm -C studio sync:page-visuals
```

This also ensures default values for:
- `pageVisualSettings.motionPreset`
- `pageVisualSettings.textLinkAnimation`
- `pageVisualSettings.pageBackgroundAnimation`
- `pageVisualSettings.scrollRevealAnimation`

Current option sets:
- `motionPreset`: `still`, `calm`, `balanced`, `lively`, `energetic`
- `textLinkAnimation`: `none`, `subtle`, `sweep`, `glint`
- `pageBackgroundAnimation`: `none`, `drift`, `tracers`, `drift-tracers`, `pulse`
- `scrollRevealAnimation`: `none`, `soft`, `dynamic`, `cascade`

The Studio desk now includes **Visual Preset Quick Guide** for maintainers.

## Troubleshooting: Missing Array Keys
If Studio reports "Missing keys" for array items:

```bash
pnpm -C studio fix:keys
```

This patches `siteSettings.socialLinks` with stable `_key` values.

## Best Practices
- Add/modify schema fields with backward compatibility in mind.
- Favor clear editor labels and validations for fast publishing.
- Avoid model drift: when schema changes, update docs and consuming frontend code.
- Homepage hero portrait is controlled by `siteSettings.candidatePortrait` and `siteSettings.candidatePortraitAlt`.
- Studio information architecture is critical: organize major settings into clear field groups/tabs and keep field order aligned to editor workflow.

## Post Storytelling Blocks
`post.body` now supports interactive storytelling blocks that are safe for student contributors:
- In the Post editor, use the **Reading Experience** tab and the `Reading Experience Sections` field.
- `Story Scene`: section title, layout (`text`, `split-left`, `split-right`, `highlight`), scene content, optional media, and per-scene animation controls.
- `Stat Callout`: headline + 1-4 stat items with per-block animation controls.
- All scene blocks include `animationPreset`, `animationDelayMs`, and `animationDurationMs` for scroll-driven reveal behavior.
