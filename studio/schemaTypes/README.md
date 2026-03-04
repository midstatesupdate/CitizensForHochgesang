# Schema Types Dictionary

## Definition
Sanity content model definitions for the campaign CMS. This folder controls what editors can create and what the website can query.

## Architecture: Per-Page Settings Singletons
Visual settings and page-specific content are managed through **per-page settings singletons** rather than a centralized settings document. Each page has its own singleton document type with an embedded `pageVisuals` object for visual controls. Pages with detail routes (news, events, platform) have both `visuals` (listing page) and `detailVisuals` (detail page override; inherits from listing visuals when unset).

## Files

### Shared Object Types
- [`pageVisuals.ts`](pageVisuals.ts): Reusable Sanity `object` type with 9 visual fields (backgroundVariant, containerVariant, toneVariant, motionPreset, textLinkAnimation, pageBackgroundAnimation, scrollProgressBar, magneticButtons, scrollRevealAnimation). Embedded in every page settings singleton.
- [`iconOptions.ts`](iconOptions.ts): Shared icon picker options array (~80 icons) used by siteSettings and page settings schemas.

### Site-Wide Settings
- [`siteSettings.ts`](siteSettings.ts): Global campaign settings (site title, tagline, HTML header lockup editor, editable header nav items with icon pickers, full-size campaign logo + optional small header logo, per-section `pageVisibility` toggles, press resource timestamp, donate/volunteer URLs, contact and social links). Does **not** contain home page content — that lives in `homePageSettings`.

### Page Settings Singletons
- [`homePageSettings.ts`](homePageSettings.ts): Homepage content and visuals. Groups: hero, whyRunning, cards, proof, countdown, visuals. Fields include hero layout variant, candidate portrait, district label, hero actions/badges/focus items, "Why I'm Running" section, proof/credibility section, mid-page CTA, section cards, countdown timers, and embedded visual settings.
- [`newsPageSettings.ts`](newsPageSettings.ts): News listing + detail page visuals (two `pageVisuals` fields: `visuals` and `detailVisuals`).
- [`eventsPageSettings.ts`](eventsPageSettings.ts): Events listing + detail page visuals (two `pageVisuals` fields).
- [`platformPageSettings.ts`](platformPageSettings.ts): Platform listing + detail page visuals (two `pageVisuals` fields).
- [`mediaPageSettings.ts`](mediaPageSettings.ts): Media page visuals (single `pageVisuals` field).
- [`supportPageSettings.ts`](supportPageSettings.ts): Support/donate page visuals (single `pageVisuals` field).
- [`faqPageSettings.ts`](faqPageSettings.ts): FAQ page visuals (single `pageVisuals` field).

### Portable Text Block Types
- [`htmlEmbed.ts`](htmlEmbed.ts): Reusable inline HTML block type for any rich-text array field.
- [`videoEmbed.ts`](videoEmbed.ts): Responsive YouTube / Vimeo video embed block.
- [`ctaButton.ts`](ctaButton.ts): Inline call-to-action button block with label, URL, and style variant.
- [`pullQuote.ts`](pullQuote.ts): Attributed testimonial / endorsement quote block.
- [`infoBox.ts`](infoBox.ts): Tone-based callout box (info / tip / warning / note).

### Document Types
- [`aboutPriorities.ts`](aboutPriorities.ts): Singleton content model for `/platform` plus `/platform/[slug]` detail pages.
- [`pageVisualSettings.ts`](pageVisualSettings.ts): Legacy per-route visual controls (kept for backward compatibility; no longer shown in Studio desk).
- [`post.ts`](post.ts): News/article documents with title, slug, excerpt, publish date, image, tags, and scene-based body blocks.
- [`event.ts`](event.ts): Event documents with scheduling, location, description, slug, and per-event list card controls.
- [`mediaLink.ts`](mediaLink.ts): External media links, including YouTube/Facebook/audio.
- [`mediaSettings.ts`](mediaSettings.ts): Media/press page settings singleton.
- [`fundraisingLink.ts`](fundraisingLink.ts): Donation links (ActBlue and similar) with priority, description, and optional image.

## Visual Settings Inheritance
Detail pages inherit their parent listing page's visual settings unless overridden:
```
detailVisuals (if set) → visuals (listing page) → hardcoded defaults
```

## Modeling Guidelines
- Keep field names stable once consumed by frontend queries.
- Add validations for required campaign publishing workflows.
- Prefer explicit field semantics over generic objects.
- For meaningful schema additions, use clear groups/tabs/sections so editors can navigate by task.
- When adding a schema, update:
  1. `index.ts` exports
  2. Frontend query/render logic in `web/`
  3. Relevant README files and `.github/copilot-instructions.md`
