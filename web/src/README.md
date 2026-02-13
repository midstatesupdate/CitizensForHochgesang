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
- [`app/faq/page.tsx`](app/faq/page.tsx): Interactive FAQ route shell.
- [`app/press/page.tsx`](app/press/page.tsx): Press resources and media access route.
- [`app/sitemap.ts`](app/sitemap.ts): XML sitemap route for search discovery.
- [`app/robots.ts`](app/robots.ts): Robots rules route.
- [`app/news/page.tsx`](app/news/page.tsx): News/article listing.
- [`app/news/[slug]/page.tsx`](app/news/[slug]/page.tsx): Article detail route.
- [`app/events/page.tsx`](app/events/page.tsx): Event listing.
- [`app/media/page.tsx`](app/media/page.tsx): Media link listing.
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
- Header nav items are CMS-driven from `siteSettings.headerNavItems` (label, link, icon).
- Header logo circle uses Sanity crop/hotspot-aware image URLs to keep face/logo framing aligned with Studio image settings.
- Homepage hero supports CMS control of district label, summary copy, action buttons (label/link/icon/style), bubble badges with placement (`text`/`media`/`proof`), focus list items, candidate portrait caption, and large section cards via `siteSettings`.
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
