# Analytics Plan

## Purpose
Track site quality and operational outcomes with privacy-respecting, actionable metrics.

## Active Integration
- Provider: Vercel Analytics (`@vercel/analytics`)
- Mount point: `src/app/layout.tsx` via `<Analytics />`
- Coverage: all Next.js App Router routes
- Primary manager surface: Vercel project Analytics dashboard

## Core KPIs
- Sessions and unique visitors by route
- Traffic sources (direct, search, social, referral)
- Top CTA clicks (donate, volunteer, RSVP, media)
- 404 frequency and broken link incidents
- Press page visits and asset downloads

## Manager Workflow
- Weekly: Review route-level traffic and top entry pages in Vercel Analytics.
- Monthly: Compare campaign windows (events, media pushes, fundraising drives) against traffic changes.
- Publishing review: cross-check `/news`, `/events`, and `/support` trend movement after major content updates.

## Event Tracking Targets
- `cta_click` (label: donate/volunteer/rsvp)
- `media_open`
- `press_asset_download`
- `social_link_click`

Event targets above remain optional future work; current implementation provides route/session analytics out of the box.

## Reporting Cadence
- Weekly dashboard snapshot
- Monthly trend summary with actions taken

## QA Checklist
- Verify analytics script loads on all routes
- Verify events fire once per action
- Verify no PII in tracked payloads
- Verify consent/compliance requirements are met
