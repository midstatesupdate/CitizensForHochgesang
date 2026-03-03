# Schema Types Dictionary

## Definition
Sanity content model definitions for the campaign CMS. This folder controls what editors can create and what the website can query.

## Files
- [`index.ts`](index.ts): Exports all registered schema types.
- [`siteSettings.ts`](siteSettings.ts): Global campaign settings (site title, tagline, HTML header lockup editor, editable header nav label/link/icon items with an expanded searchable campaign icon catalog using dropdown icon pickers, full-size campaign logo upload plus optional small optimized header logo variant, homepage candidate portrait + caption, selectable home hero layout variant with `clean-split` as the default, editable district label/hero actions/hero bubbles/focus list/home cards, per-section `pageVisibility` toggles for all non-home sections with default disabled behavior, multi-timer election countdown array (each with enabled toggle, heading, target date, block-content body with rich embed support, and optional all-done title/body shown with a zeroed clock when every timer has passed), press resource timestamp, donate/volunteer URLs, contact and social links). All rich-text body fields support the shared block types: `htmlEmbed`, `videoEmbed`, `ctaButton`, `pullQuote`, and `infoBox`.
- [`htmlEmbed.ts`](htmlEmbed.ts): Reusable inline HTML block type for any rich-text array field. Use for badges, buttons, or embedded widgets that can't be expressed with standard block content.
- [`videoEmbed.ts`](videoEmbed.ts): Responsive YouTube / Vimeo video embed block. Accepts a URL and optional caption; the frontend converts standard watch/share links to privacy-enhanced iframes.
- [`ctaButton.ts`](ctaButton.ts): Inline call-to-action button block with label, URL, and style variant (primary / outline / accent). Useful for Donate, Volunteer, and RSVP links mid-article.
- [`pullQuote.ts`](pullQuote.ts): Attributed testimonial / endorsement quote block with styled left-border callout treatment.
- [`infoBox.ts`](infoBox.ts): Tone-based callout box (info / tip / warning / note) with optional heading. Ideal for policy explainers and voter FAQ context.
- [`aboutPriorities.ts`](aboutPriorities.ts): Singleton content model for `/platform` plus `/platform/[slug]` detail pages with editable header copy, article-style rich bio body, campaign values, priority cards (title/slug/summary/detail body/detail links), and CTA labels/URLs.
- [`pageVisualSettings.ts`](pageVisualSettings.ts): Per-route visual controls for textured background style (5 options), container width, descriptive tone accents, motion presets, text-link animation, page background animation, and scroll reveal behavior across `home`, `news`, `news-detail`, `events`, `events-detail`, `faq`, `platform`, `platform-detail`, `media`, `press`, and `support`.
- [`post.ts`](post.ts): News/article documents with title, slug, excerpt, publish date, image, tags, plus per-article news list controls (card layout variant including a text-only `no-photo` option, image orientation, image aspect ratio, card animation preset, and body preview character limit; default `2000`) and scene-based body blocks (`Story Scene`, `Stat Callout`, inline images) for interactive reading experiences.
- [`event.ts`](event.ts): Event documents with scheduling, location, description, slug, RSVP URL, event detail-page rich body/link fields, and per-event list card controls (layout variant, image orientation, image aspect ratio, animation preset, description preview character limit; default `2000`, and tags for related-event filtering). Includes `endDate` validation (`>= startDate`) so the website can automatically mark events as passed after the configured end timestamp.
- [`mediaLink.ts`](mediaLink.ts): External media links, including YouTube/Facebook/audio.
- [`fundraisingLink.ts`](fundraisingLink.ts): Donation links (ActBlue and similar) with priority, description, and optional image upload.

## Modeling Guidelines
- Keep field names stable once consumed by frontend queries.
- Add validations for required campaign publishing workflows.
- Prefer explicit field semantics over generic objects.
- For meaningful schema additions, use clear groups/tabs/sections so editors can navigate by task (for example: Header, Hero, Home Cards, Metadata).
- Keep editor UX simple for student contributors: one `pageVisualSettings` doc per route (`home`, `news`, `news-detail`, `events`, `events-detail`, `faq`, `platform`, `platform-detail`, `media`, `press`, `support`).
- When adding a schema, update:
  1. `index.ts` exports
  2. Frontend query/render logic in `web/`
  3. Relevant README files and `.github/copilot-instructions.md`
