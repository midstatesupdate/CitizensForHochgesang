# Chat Content Workflow

## Purpose
This guide explains how to add campaign content to Sanity Studio by using chat prompts with Copilot.

## Current Studio Target
- Project ID: `scos8zjw`
- Dataset: `citizens-for-hochgesang`

## Content Types You Can Ask Chat To Create
- `siteSettings`: site title, tagline, campaign logo image, donate/volunteer URLs, contact email, social links
- `siteSettings`: site title, tagline, campaign logo image, donate/volunteer URLs, contact email, social links
- `pageVisualSettings`: route-level visual controls (background, container width, tone, and interaction/animation behavior)
- `post`: title, slug, excerpt, publish date, body, tags, plus interactive body blocks (`storyScene`, `statCallout`)
- `event`: title, start/end date, location, description, RSVP link
- `mediaLink`: title, type (`youtube`, `facebook`, `audio`, `other`), URL, publish date
- `fundraisingLink`: title, URL, description, priority, image

## Recommended Prompt Pattern
Use one of these prompt styles in chat:

1. "Create a new `post` in Sanity with:
   - title: ...
   - slug: ...
   - excerpt: ...
   - publishedAt: ...
   - body: ...
   - tags: [...]
   Then publish it."

2. "Create an `event` with:
   - title: ...
   - startDate: ...
   - location: ...
   - description: ...
   - rsvpLink: ...
   Then show me the created document ID."

3. "Update `siteSettings` so:
   - siteTitle: ...
   - tagline: ...
   - campaignLogo: upload [filename]
   - campaignLogoAlt: ...
   - donateUrl: ...
   - volunteerUrl: ...
   Then publish changes."

4. "Create a `fundraisingLink` with:
   - title: ...
   - url: ...
   - description: ...
   - priority: ...
   - image: upload [filename]
   Then publish it."

5. "Set `pageVisualSettings` for `/faq` with:
   - pageKey: `faq`
   - backgroundVariant: `stately-gradient`, `civic-fabric`, `diagonal-wash`, `signal-grid`, or `topo-lines`
   - containerVariant: `narrow`, `standard`, or `wide`
   - toneVariant: `default` (Civic Neutral), `news` (Policy Brief Blue), `events` (Community Action Green), `media` (Media Spotlight Magenta), or `support` (Volunteer Gold)
   - motionPreset: `still`, `calm`, `balanced`, `lively`, or `energetic`
   - textLinkAnimation: `none`, `subtle`, `sweep`, or `glint`
   - pageBackgroundAnimation: `none`, `drift`, `tracers`, `drift-tracers`, or `pulse`
   - scrollRevealAnimation: `none`, `soft`, `dynamic`, or `cascade`
   Then publish it."

6. "Create a `post` designed for scroll storytelling:
    - title: ...
    - slug: ...
    - excerpt: ...
    - publishedAt: ...
    - body includes:
       - regular intro paragraph blocks (main article content)
    - storyTimeline includes:
       - one `storyScene` with layout (`text` / `split-left` / `split-right` / `highlight`),
          animationPreset (`none`, `fade-up`, `slide-left`, `slide-right`, `zoom-soft`),
          animationDelayMs, animationDurationMs, and scene body text
       - one `statCallout` with headline, 2-4 stat items (`value`, `label`, optional `note`),
          plus animationPreset, animationDelayMs, and animationDurationMs
    - tags: [...]
    Then publish it."

## Data Quality Tips
- Provide explicit ISO date values (example: `2026-03-02T18:30:00.000Z`).
- Include a unique slug for each post.
- Keep excerpt lengths concise to fit homepage/news cards.
- Use full URLs with `https://` for external links.

## Verify Content Is Published
Run this from repo root:

```bash
pnpm -C web verify:sanity
```

If counts are all `0`, the website falls back to mock data.

## Apply Branding Script
For the logo and primary link fields, run:

```bash
$env:LOGO_PATH="C:\\path\\to\\logo_full_size.png"
pnpm -C studio apply:branding
```

This script updates:
- `siteSettings.siteTitle`
- `siteSettings.tagline`
- `siteSettings.campaignLogo`
- `siteSettings.campaignLogoAlt`
- `siteSettings.donateUrl`
- `siteSettings.volunteerUrl`
- primary `fundraisingLink` with ActBlue URL and image

## Link Quality Checklist
- Donation links should point to the final ActBlue contribution URL.
- Volunteer/RSVP links should use internal paths (`/events`) or full `https://` URLs.
- Avoid placeholder links such as `#` in published documents.
- Replace `https://www.youtube.com/` with the official campaign YouTube URL when available.
