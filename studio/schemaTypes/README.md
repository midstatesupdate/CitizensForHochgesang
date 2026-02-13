# Schema Types Dictionary

## Definition
Sanity content model definitions for the campaign CMS. This folder controls what editors can create and what the website can query.

## Files
- [`index.ts`](index.ts): Exports all registered schema types.
- [`siteSettings.ts`](siteSettings.ts): Global campaign settings (site title, tagline, HTML header lockup editor, editable header nav label/link/icon items with an expanded searchable campaign icon catalog using dropdown icon pickers, full-size campaign logo upload, homepage candidate portrait + caption, selectable home hero layout variant with `clean-split` as the default, editable district label/hero actions/hero bubbles/focus list/home cards, press resource timestamp, donate/volunteer URLs, contact and social links).
- [`pageVisualSettings.ts`](pageVisualSettings.ts): Per-route visual controls for textured background style (5 options), container width, descriptive tone accents, motion presets, text-link animation, page background animation, and scroll reveal behavior.
- [`post.ts`](post.ts): News/article documents with title, slug, excerpt, publish date, image, tags, plus per-article news list controls (card layout variant including a text-only `no-photo` option, image orientation, image aspect ratio, card animation preset, and body preview character limit) and scene-based body blocks (`Story Scene`, `Stat Callout`, inline images) for interactive reading experiences.
- [`event.ts`](event.ts): Event documents with scheduling, location, description, RSVP URL, and per-event list card controls (layout variant, image orientation, image aspect ratio, animation preset, description preview character limit, and tags for related-event filtering). Includes `endDate` validation (`>= startDate`) so the website can automatically mark events as passed after the configured end timestamp.
- [`mediaLink.ts`](mediaLink.ts): External media links, including YouTube/Facebook/audio.
- [`fundraisingLink.ts`](fundraisingLink.ts): Donation links (ActBlue and similar) with priority, description, and optional image upload.

## Modeling Guidelines
- Keep field names stable once consumed by frontend queries.
- Add validations for required campaign publishing workflows.
- Prefer explicit field semantics over generic objects.
- For meaningful schema additions, use clear groups/tabs/sections so editors can navigate by task (for example: Header, Hero, Home Cards, Metadata).
- Keep editor UX simple for student contributors: one `pageVisualSettings` doc per route (`home`, `news`, `news-detail`, `events`, `faq`, `media`, `press`, `support`).
- When adding a schema, update:
  1. `index.ts` exports
  2. Frontend query/render logic in `web/`
  3. Relevant README files and `.github/copilot-instructions.md`
