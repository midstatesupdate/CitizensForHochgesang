# Schema Types Dictionary

## Definition
Sanity content model definitions for the campaign CMS. This folder controls what editors can create and what the website can query.

## Files
- [`index.ts`](index.ts): Exports all registered schema types.
- [`siteSettings.ts`](siteSettings.ts): Global campaign settings (site title, tagline, full-size campaign logo upload, homepage candidate portrait, selectable home hero layout variant, press resource timestamp, donate/volunteer URLs, contact and social links).
- [`pageVisualSettings.ts`](pageVisualSettings.ts): Per-route visual controls for textured background style (5 options), container width, descriptive tone accents, motion presets, text-link animation, page background animation, and scroll reveal behavior.
- [`post.ts`](post.ts): News/article documents with title, slug, excerpt, publish date, image, tags, plus scene-based body blocks (`Story Scene`, `Stat Callout`, inline images) for interactive reading experiences.
- [`event.ts`](event.ts): Event documents with scheduling, location, description, and RSVP URL.
- [`mediaLink.ts`](mediaLink.ts): External media links, including YouTube/Facebook/audio.
- [`fundraisingLink.ts`](fundraisingLink.ts): Donation links (ActBlue and similar) with priority, description, and optional image upload.

## Modeling Guidelines
- Keep field names stable once consumed by frontend queries.
- Add validations for required campaign publishing workflows.
- Prefer explicit field semantics over generic objects.
- Keep editor UX simple for student contributors: one `pageVisualSettings` doc per route (`home`, `news`, `news-detail`, `events`, `faq`, `media`, `press`, `support`).
- When adding a schema, update:
  1. `index.ts` exports
  2. Frontend query/render logic in `web/`
  3. Relevant README files and `.github/copilot-instructions.md`
