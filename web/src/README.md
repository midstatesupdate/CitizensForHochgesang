# Web Source Map

## Definition
Primary frontend source area for the public campaign site.

## Structure
- [`app/`](app): Next.js App Router entrypoint and route UI.
- [`components/`](components): Shared server-rendered layout primitives.
- [`lib/cms/`](lib/cms): Sanity query client, repository accessors, types, and formatting utilities.

## Current Key Files
- [`app/layout.tsx`](app/layout.tsx): Root HTML shell and global metadata.
- [`app/page.tsx`](app/page.tsx): Homepage using CMS-backed sections.
- [`app/globals.css`](app/globals.css): Global styles, dark/light color tokens, and shared interactive utility classes.
- [`app/loading.tsx`](app/loading.tsx): Root route loading state.
- [`app/not-found.tsx`](app/not-found.tsx): Global 404 page.
- [`app/icon.png`](app/icon.png): Campaign-branded PNG favicon source used by Next.js App Router.
- [`app/apple-icon.png`](app/apple-icon.png): Campaign-branded PNG Apple touch icon.
- [`app/faq/page.tsx`](app/faq/page.tsx): Interactive FAQ route shell.
- [`app/press/page.tsx`](app/press/page.tsx): Redirect route that forwards legacy press URLs to `app/media/page.tsx`.
- [`app/sitemap.ts`](app/sitemap.ts): XML sitemap route for search discovery.
- [`app/robots.ts`](app/robots.ts): Robots rules route.
- [`app/news/page.tsx`](app/news/page.tsx): News/article listing.
- [`app/news/[slug]/page.tsx`](app/news/[slug]/page.tsx): Article detail route.
- [`app/events/page.tsx`](app/events/page.tsx): Event listing.
- [`app/events/details/page.tsx`](app/events/details/page.tsx): Event drill-down detail route with rich body content and related links from CMS.
- [`app/platform/page.tsx`](app/platform/page.tsx): CMS-backed About & Priorities route using `aboutPriorities` content and `pageVisualSettings` for `platform`.
- [`app/platform/[slug]/page.tsx`](app/platform/[slug]/page.tsx): Priority drill-down detail route using per-priority slug/body/link content from CMS.
- [`app/media/page.tsx`](app/media/page.tsx): Combined Media & Press hub (media links, press assets, contact, and newsroom context).
- [`app/support/page.tsx`](app/support/page.tsx): Volunteer, voter tools, district map, and fundraising CTAs.
- [`components/cms-link.tsx`](components/cms-link.tsx): Smart internal/external link renderer for CMS URLs.
- [`components/site-header.tsx`](components/site-header.tsx): Primary navigation header.
- [`components/site-footer.tsx`](components/site-footer.tsx): Footer with contact/social links.
- [`components/route-loading.tsx`](components/route-loading.tsx): Reusable loading skeleton UI.
- [`components/theme-toggle.tsx`](components/theme-toggle.tsx): Browser-persistent dark/light mode selector.
- [`components/faq-accordion.tsx`](components/faq-accordion.tsx): Category-filtered searchable FAQ accordion.
- [`components/voter-action-hub.tsx`](components/voter-action-hub.tsx): District map and localStorage-backed voter checklist.
- [`components/scroll-dynamics.tsx`](components/scroll-dynamics.tsx): Client-side intersection observer for scroll reveal dynamics.
- [`components/article-content.tsx`](components/article-content.tsx): Portable Text renderer for long-form article scenes, stat callouts, and media blocks.
- [`components/article-scene-observer.tsx`](components/article-scene-observer.tsx): Intersection observer for per-scene article animation reveal.
- [`lib/site.ts`](lib/site.ts): Site URL/name metadata constants.
- [`lib/cms/page-visuals.ts`](lib/cms/page-visuals.ts): Default per-page visual presets and page shell class mapping.

## Scripts and Runbooks
- `../scripts/check-links.mjs`: Published-link integrity checker.
- `../scripts/check-content-freshness.mjs`: Freshness sanity checker for events/posts.
- `../ACCESSIBILITY_CHECKLIST.md`: Accessibility QA checklist.
- `../IMAGE_GUIDELINES.md`: Image and media standards.
- `../ANALYTICS_PLAN.md`: Measurement plan.
- `../PUBLISHING_CHECKLIST.md`: Pre/post-publish operational checklist.

## Styling & Theming
- Tailwind v4 is configured via `app/globals.css` using semantic CSS variables
	and `@theme inline` tokens.
- Theme preference is initialized in `app/layout.tsx` and persisted client-side with `components/theme-toggle.tsx`.
- Vercel Analytics is mounted in `app/layout.tsx` for route-level traffic measurement.
- Default experience is dark mode (`data-theme='dark'`) with `light` as a user-selectable variant.
- Route-level visuals are CMS-driven from `pageVisualSettings` and mapped through `lib/cms/page-visuals.ts`.
- Homepage hero composition is CMS-driven from `siteSettings.homeHeroLayout` (`clean-split`, `portrait-left`, `immersive-overlay`).
- Header brand lockup is CMS-driven from HTML in `siteSettings.homeLinkMarkup`.
- Header nav items are CMS-driven from `siteSettings.headerNavItems` (label, link, icon). Nav items for disabled pages are automatically hidden from the navigation bar.
- **Page visibility**: Each non-home page (`news`, `events`, `platform`, `faq`, `media`, `support`) has an enable/disable toggle in the `Site Settings → Page Visibility` group in Sanity Studio. Disabled pages return a 404 (via Next.js `notFound()`), their nav items are hidden, and all child routes (e.g. `/news/[slug]` when news is disabled) also return 404. Defaults to disabled (`false`) in Sanity so new pages can be staged before publishing. Mock data defaults all pages to enabled so local development is unaffected. The utility `isPageEnabled(settings, pageKey)` in `lib/cms/repository.ts` encapsulates this check and defaults to `true` when `pageSettings` is absent (backward compatibility for existing documents).
- Header logo circle uses Sanity crop/hotspot-aware image URLs to keep face/logo framing aligned with Studio image settings.
- Header logo source prioritizes `siteSettings.headerLogoSmall` (for optimized small-format branding), then falls back to `siteSettings.campaignLogo`.
- Homepage hero supports CMS control of district label, summary copy, action buttons (label/link/icon/style), bubble badges with placement (`text`/`media`/`proof`), focus list items, candidate portrait caption, and large section cards via `siteSettings`.
- News list cards are CMS-configurable per article from `post` fields: card layout (`stacked`/`image-left`/`image-right`/`feature-split`/`no-photo`), image orientation, image aspect ratio (DSLR/phone-friendly options), card animation preset, and body preview character limit.
- News list UX includes clickable images, titles, and body previews (open article detail), compact inline `Read article →` cues above tags, mobile-friendly media insets for `16:9` and tall `9:16` cards, searchable tags in a responsive two-row capped rail sorted by article count (count labels shown only when a tag appears in 2+ articles), top-right sorting (`Newest`, `Oldest`, `Title A-Z`), and intersection-observer infinite scroll to avoid heavy render work.
- Events list cards are CMS-configurable per event from `event` fields: card layout (`stacked`/`image-left`/`image-right`/`feature-split`/`no-photo`), image orientation, image aspect ratio, animation preset, description preview character limit, and tags.
- Events list UX now supports drill-down links from event images/titles to `/events/details#slug` (with RSVP fallback when needed), compact inline `RSVP →` cues, mobile-friendly media insets for `16:9` and tall `9:16` cards, a compact tag search plus tag filtering in a responsive two-row capped rail sorted by event count (count labels shown only when a tag appears in 2+ events), top-right sorting (`Soonest`, `Latest`, `Title A-Z`), crop-aware image rendering, intersection-observer infinite scroll for efficient rendering, and automatic `Passed` badges when an event's `endDate` (or fallback `startDate`) is earlier than current Eastern time.
- CMS visual setting queries use `no-store` in local dev/runtime, but switch to revalidated fetch during production static builds so published values are embedded correctly.
- Hero variant CSS keeps portrait media/text reorder at `md+`, keeps split-layout proof badges full-width, and scopes immersive overlay positioning to the immersive frame.
- `pageVisualSettings` now controls: background style, container width, tone accents, motion preset, text-link animation, page background animation, and scroll reveal behavior.
- Link interaction utilities are centralized in `app/globals.css`:
	- `nav-link`: animated navigation pill behavior.
	- `link-soft`: subtle underline sweep for inline links.
	- Plain-text anchors (non-pill/non-button/non-nav controls) inherit the same `link-soft`-style animation automatically.
	- `link-pill` + variants (`link-pill-news`, `link-pill-events`, `link-pill-media`, `link-pill-support`): stronger pill-style link animations.
- Route tone classes (`tone-news`, `tone-events`, `tone-media`, `tone-support`) provide subtle section variety while preserving shared tokens.
- Site header and global spacing are tuned for large desktop, tablet, and phone orientations, including an earlier hamburger transition (`components/site-nav.tsx`, below `lg`), a fixed two-line brand lockup, and an icon-only theme toggle.

## Extension Guidance
- Put new routes under `app/` using App Router conventions.
- Keep data-fetching and presentation concerns cleanly separated as complexity grows.
- Prefer typed interfaces for CMS-backed data.
- Update this file when new major folders/patterns are introduced.
