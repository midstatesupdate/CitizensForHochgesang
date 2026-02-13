# Copilot Instructions: Citizens For Hochgesang

## Documentation Contract (Required)
- Keep this file and impacted `README.md` files up to date for every meaningful feature, schema, route, automation, or workflow change.
- Always update documentation after every change when necessary; treat docs as part of the implementation, not a follow-up.
- Treat documentation updates as part of done criteria, not optional follow-up.
- If code and docs disagree, update docs in the same change.
- Prefer short, precise sections that optimize fast indexing by future agents.

## Execution Preference
- Do not ask for confirmation before making normal code or documentation edits.
- Apply all reasonable requested changes directly in one pass.
- Only stop to ask when:
  - a destructive or irreversible action is required,
  - requirements are ambiguous enough to risk incorrect implementation,
  - elevated permissions are required by the environment.
- After edits, provide a concise summary and touched file list.

## Project Purpose
This repository powers an AI-first political campaign website and content system for **Brad Hochgesang**, a candidate for **Indiana State Senate District 48**.

Campaign context:
- Candidate: Brad Hochgesang
- Race: Indiana State Senate, District 48
- Opponent/incumbent: Daryl Schmitt

Agents should assume this is production-oriented campaign software, built and operated by the candidate.

## Knowledge Index
Use this section as the main navigation map. Each link includes a definition so agents can pick the right doc quickly.

- [`README.md`](../README.md): Repository entrypoint. High-level architecture, core commands, and top-level documentation map.
- [`CAMPAIGN_PLAYBOOK.md`](../CAMPAIGN_PLAYBOOK.md): Canonical campaign context, AI content drafting guardrails, and UX design spec.
- [`PLATFORM_README.md`](../PLATFORM_README.md): Platform narrative working draft and fact-verification tracker.
- [`OPPO_README.md`](../OPPO_README.md): Opponent profile research worksheet with source requirements.
- [`CAMPAIGN_TODOS.md`](../CAMPAIGN_TODOS.md): Campaign operations backlog and delivery checklist.
- [`web/README.md`](../web/README.md): Frontend app guide. Next.js scope, run/build commands, and web-specific implementation rules.
- [`web/src/README.md`](../web/src/README.md): Frontend code map. Where routes/components/styles live and how to extend UI safely.
- [`studio/README.md`](../studio/README.md): CMS app guide. Sanity Studio purpose, local workflow, and content operations context.
- [`studio/schemaTypes/README.md`](../studio/schemaTypes/README.md): Content model dictionary. Document types, field intent, and schema extension guidance.
- [`studio/chat-content/README.md`](../studio/chat-content/README.md): Chat-first playbook for creating/updating Studio content.
- [`.github/README.md`](./README.md): Automation and agent docs map. Purpose of files under `.github/` and governance expectations.

## Task Routing (Fast Index)
- Need run/build commands: start with [`README.md`](../README.md), then app-specific README.
- Need campaign facts, voice, or UX style rules: open [`CAMPAIGN_PLAYBOOK.md`](../CAMPAIGN_PLAYBOOK.md).
- Need platform message drafts: open [`PLATFORM_README.md`](../PLATFORM_README.md).
- Need opponent research structure: open [`OPPO_README.md`](../OPPO_README.md).
- Need campaign operations backlog: open [`CAMPAIGN_TODOS.md`](../CAMPAIGN_TODOS.md).
- Need frontend route/component location: open [`web/src/README.md`](../web/src/README.md).
- Need CMS field definitions: open [`studio/schemaTypes/README.md`](../studio/schemaTypes/README.md).
- Need chat prompt patterns for content entry: open [`studio/chat-content/README.md`](../studio/chat-content/README.md).
- Need governance/agent behavior: open [`.github/README.md`](./README.md), then this file.
- Need campaign scope and product intent: use this file as source of truth.

## Product Scope
The site and CMS should support:
- Campaign website pages and messaging
- News and self-published articles
- Event publishing and event detail pages
- Video publishing (especially YouTube embeds)
- Links to Facebook posts and social content
- Fundraising links and flows (ActBlue and similar platforms)
- Media/newsroom style content organization

## Technical Direction
- `web/`: Next.js App Router frontend
- `studio/`: Sanity Studio content management
- Prefer structured content in Sanity over hardcoded copy in UI.
- Keep frontend components modular, reusable, and strongly typed.
- Prioritize simple, reliable deployment and easy local development.

## AI-First Campaign Expectations
When implementing features, optimize for:
- Fast publishing workflows for a small team (or one-person operation)
- Automation-friendly content structures and metadata
- Reusable templates for news, events, and media
- Clear data models for ranking, filtering, and summarizing content
- Future AI usage (summaries, drafting support, content tagging, scheduling)
- Studio information architecture that keeps editing flows simple and predictable (clear groups/tabs, concise labels, and editor-first ordering)

## Content Model Priorities
When extending schemas, prefer models for:
- `post` / article with title, slug, summary, body, publish date, hero image, tags
- `event` with date/time, location, description, RSVP/donation links
- `mediaLink` for YouTube/Facebook/external media references
- `fundraisingLink` for ActBlue and related donation destinations
- global `siteSettings` for campaign-wide text, links, and social profiles

## UX Priorities
- Mobile-first and highly readable for voters
- Clear calls to action: Volunteer, Donate, Attend Events, Read Updates
- Trust signals: consistent branding, transparent dates/sources, clean layout
- Accessibility basics are required (semantic HTML, alt text, keyboard support)

## Engineering Standards
- Keep changes focused and incremental.
- Do not remove existing user-authored content without instruction.
- Preserve compatibility with existing schemas and routes when possible.
- Update this file and relevant README/docs when behavior or setup changes.
- Add lightweight tests or validation where practical.

## Studio Organization (Critical)
- Treat Studio organization as a required part of implementation quality.
- For meaningful schema additions, group fields into clear tabs/sections (for example: Header, Hero, Home Cards, Metadata) to reduce editor confusion.
- Keep labels plain-language and task-oriented; avoid vague or overly technical field names.
- Order fields by publishing workflow, not by technical dependency.
- Update Studio docs when field groups or editor flows change.

## Local Dev Ports
- Preferred local ports are fixed:
  - Web: `3000`
  - Studio: `3333`
- Before starting either app, stop existing local dev processes that hold these ports to keep URLs stable for review.

## Compliance and Safety Notes
- Do not fabricate endorsements, quotes, statistics, or event facts.
- Flag legal/compliance-sensitive changes (fundraising disclaimers, election rules).
- Prefer neutral, factual defaults in generated content scaffolding.
- If campaign facts are ambiguous, ask before hardcoding.

## Decision Heuristics for Agents
If there is a tradeoff, prefer:
1. Shipping a usable campaign feature quickly
2. Content-editability via Sanity
3. Reliability and clarity over cleverness
4. Maintainable code that one developer can run and evolve

## Best Practices Checklist
- Keep docs and code synchronized in the same change.
- Write for fast scan: short headers, task-based sections, and direct links.
- Use clear definitions for each area to reduce ambiguity for future agents.
- Prefer deterministic workflows (repeatable commands, stable schema names).
- Document breaking changes, migration steps, and operational caveats immediately.
