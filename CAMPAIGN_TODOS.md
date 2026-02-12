# Campaign TODOs

## Purpose
Execution plan for building a high-quality, trustworthy, discoverable campaign website experience.

## Priority Legend
- P0 = immediate
- P1 = high
- P2 = medium

## Phase 1: Foundation (Now)
### UX / Accessibility
- [x] (P0) Add campaign logo-forward homepage hero.
- [x] (P0) Add route-level loading states and custom 404 page.
- [x] (P0) Add skip-to-content link and visible keyboard focus states.
- [x] (P1) Add reduced-motion-safe reveal animation utility.
- [x] (P1) Add explicit accessibility QA checklist per route (headings, links, contrast, keyboard, motion).

### Search and Discoverability
- [x] (P0) Improve global metadata (`title` template, `description`, Open Graph, Twitter card).
- [x] (P0) Add `sitemap.xml` route and `robots.txt` route.
- [x] (P1) Set production `NEXT_PUBLIC_SITE_URL` guidance for canonical URLs (`web/.env.example`).
- [ ] (P1) Add route-specific Open Graph images and share copy standards.

### Press Access
- [x] (P0) Add `/press` page with contact, logo download, and latest updates/events.
- [x] (P1) Add downloadable press kit bundle (bio/contact/logo guidance placeholders in `web/public/press-kit`).
- [x] (P1) Add an update timestamp field for press resources in Studio.

### Link and Data Integrity
- [x] (P0) Normalize internal vs external link behavior with `CmsLink`.
- [x] (P0) Remove placeholder hash links from published/fallback content.
- [x] (P1) Add automated Sanity link checker (`pnpm -C web check:links`).
- [x] (P1) Add CI task for sanity checks (`verify:sanity`, `check:links`) before deploy.

## Phase 2: Content System (Next)
### Content Quality
- [ ] (P0) Source-verify all high-impact factual claims in `PLATFORM_README.md`.
- [ ] (P0) Finalize canonical candidate biography variants (short/medium/long).
- [ ] (P1) Build issue explainer templates with required citation block.
- [ ] (P1) Add FAQ section route and seed initial Q&A entries.
- [ ] (P2) Add glossary for recurring policy/infrastructure terms.

### Media and Visuals
- [x] (P1) Render available images on news/event/media/support cards.
- [ ] (P0) Publish official YouTube channel URL in `siteSettings.socialLinks`.
- [x] (P1) Add image guidance doc for crops, alt text, and minimum dimensions.
- [ ] (P1) Add responsive image variants for key hero and social cards.

## Phase 3: Performance and Operations
### Performance
- [ ] (P1) Add Lighthouse baseline audit and track scores monthly.
- [ ] (P1) Optimize largest content image loading and image dimensions per route.
- [ ] (P2) Add route-level performance budgets (JS/CSS/image thresholds).

### Publishing Workflow
- [x] (P0) Seed initial published content (posts/events/media/fundraising/site settings).
- [ ] (P1) Add weekly editorial calendar automation to `studio/chat-content/README.md`.
- [x] (P1) Add monthly content freshness review checklist (`web/PUBLISHING_CHECKLIST.md`).
- [x] (P2) Add stale-content alerts for events and expired links (`pnpm -C web check:freshness`).
- [ ] (P1) Temporarily disable the agent preflight "changed files" step when running visual QA loops; continue with explicit build + viewport-matrix checks until fixed.
- [ ] (P1) Debug and fix the intermittent agent/tooling hang during "read changed files" / "preparing" phases, then re-enable the preflight step.

### Monitoring and Reporting
- [x] (P1) Add analytics/tracking implementation plan for page views and referral channels.
- [ ] (P1) Add monthly summary template (top pages, top links, broken links, content gaps).
- [ ] (P2) Add press response SLA and triage workflow docs.

## Opponent Research and Verification Ops
- [ ] (P0) Fill `OPPO_README.md` with source-backed timeline and citations.
- [ ] (P1) Add source confidence labels for each opponent claim.
- [ ] (P1) Add a publication gate checklist before any comparison content is posted.

## Ready-to-Run Commands
- `pnpm -C web verify:sanity`
- `pnpm -C web check:links`
- `pnpm -C studio seed:content`
- `pnpm -C studio fix:keys`
