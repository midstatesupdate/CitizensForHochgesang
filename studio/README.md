# Studio

Sanity Studio for campaign content management.

## Definition
This app is the editorial control plane for campaign content, including posts, events, media links, fundraising links, and site-wide settings.

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

Or from this folder:

```bash
pnpm dev
```

## Build

From repo root:

```bash
pnpm build:studio
```

## Branding Data Apply
From repo root, apply campaign logo + core URLs to Sanity:

```bash
$env:LOGO_PATH="C:\\path\\to\\logo_full_size.png"
pnpm -C studio apply:branding
```

Set a temporary homepage candidate portrait (replace later in Studio → Site Settings):

```bash
pnpm -C studio set:temp-portrait
```

Seed baseline content documents (posts/events/media):

```bash
pnpm -C studio seed:content
```

Seed long-form sample posts that showcase the interactive reading experience:

```bash
pnpm -C studio seed:experience
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

## Post Storytelling Blocks
`post.body` now supports interactive storytelling blocks that are safe for student contributors:
- In the Post editor, use the **Reading Experience** tab and the `Reading Experience Sections` field.
- `Story Scene`: section title, layout (`text`, `split-left`, `split-right`, `highlight`), scene content, optional media, and per-scene animation controls.
- `Stat Callout`: headline + 1-4 stat items with per-block animation controls.
- All scene blocks include `animationPreset`, `animationDelayMs`, and `animationDurationMs` for scroll-driven reveal behavior.
