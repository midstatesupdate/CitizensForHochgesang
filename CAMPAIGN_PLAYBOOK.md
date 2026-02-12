# Campaign Playbook

## Purpose
Use this file as the canonical context for AI-assisted campaign content creation and UX consistency.

## Core Campaign Facts
- Candidate: Brad Hochgesang
- Race: Indiana State Senate, District 48
- Campaign project: Citizens For Hochgesang
- Primary campaign CTA themes: Volunteer, Donate, Attend Events, Read Updates

## Primary Channels
- Website: Citizens For Hochgesang site (`web/` app)
- CMS: Sanity Studio (`studio/` app)
- Donation flow: ActBlue (`https://secure.actblue.com/donate/brad-hochgesang-1`)
- Volunteer flow: NGP VAN (`https://www.ngpvan.com/`)
- Facebook: `https://www.facebook.com/bradhochesangforindianastatesenate`
- YouTube: TODO (official channel URL pending)

## Content Voice Guidelines
- Tone: direct, practical, community-first, respectful
- Reading level: broad public audience; avoid policy jargon when simpler wording is possible
- Messaging structure:
  1. Community issue
  2. Practical response
  3. Clear next step / CTA
- Avoid speculative claims or unverified endorsements/statistics

## Content Pillars
- Community safety and constituent service
- Local economic growth and small business support
- Education and family stability
- Infrastructure and transportation priorities
- Transparent campaign updates and event recaps

## Required Content Metadata
When drafting content for Sanity, include:
- `title`
- `slug`
- `excerpt`
- `publishedAt` (ISO datetime)
- body copy (portable text)
- relevant tags
- image recommendation (if available)

## AI Generation Inputs Checklist
Before generating a post/event/media item, confirm:
- Location and date details are verified
- URLs are final and production-ready
- CTA target is explicit (`/support`, ActBlue, NGP VAN, event RSVP)
- Any legal/compliance-sensitive language has been reviewed

## UX Look and Feel Spec
Use these design constraints for consistent frontend output.

### Brand Direction
- Visual tone: trustworthy, clean, civic, modern
- Primary brand references: campaign logo (purple/gold), high contrast text, clear CTAs

### Color Tokens (Tailwind/CSS Variable Driven)
Defined in `web/src/app/globals.css`:
- `--color-canvas`: `#f7f3fb`
- `--color-surface`: `#ffffff`
- `--color-ink`: `#2f1854`
- `--color-muted`: `#5c4a77`
- `--color-border`: `#ded1ee`
- `--color-accent`: `#4a2778`
- `--color-accent-2`: `#e2ad33`
- `--color-highlight`: `#f7e9b5`

### Typography
- Display font: Newsreader (`--font-display`)
- Body font: Source Sans 3 (`--font-body`)
- Mono font: JetBrains Mono (`--font-mono`)

### Core UI Patterns
- Page wrapper: `.page-shell`
- Standard card container: `.card`
- CTA classes: `.btn`, `.btn-primary`, `.btn-outline`, `.btn-accent`
- Section labels: `.eyebrow`
- Large headline: `.hero-title`

### Interaction Rules
- Internal links should stay in-app (`next/link` or `CmsLink` with path)
- External links should open in a new tab
- Avoid placeholder links (`#`) in published content
- Keep content blocks scan-friendly (short paragraphs, clear headings)

### Visual Controls in Studio
- `pageVisualSettings` (one per route):
  - `backgroundVariant`: `stately-gradient`, `civic-fabric`, `diagonal-wash`, `signal-grid`, `topo-lines`
  - `containerVariant`: `standard`, `narrow`, `wide`
  - `toneVariant`: `default`, `news`, `events`, `media`, `support`
  - `motionPreset`: `calm`, `balanced`, `energetic`
  - `textLinkAnimation`: `sweep`, `subtle`, `none`
  - `pageBackgroundAnimation`: `none`, `drift`, `tracers`, `drift-tracers`
  - `scrollRevealAnimation`: `none`, `soft`, `dynamic`

## Operational Notes
- If Studio shows missing keys in arrays, run:

```bash
pnpm -C studio fix:keys
```

- To reapply brand links/logo data:

```bash
$env:LOGO_PATH="C:\\path\\to\\logo_full_size.png"
pnpm -C studio apply:branding
```

- To seed baseline content:

```bash
pnpm -C studio seed:content
```

## TODO
- Add official campaign YouTube URL to `siteSettings.socialLinks`
- Add additional logo exports (2048/1024/512 + transparent PNG)
- Add approved talking points per issue area for faster AI drafting
