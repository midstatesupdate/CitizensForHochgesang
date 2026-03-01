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
- Remove unused/dead code introduced by refactors in the same change (functions, routes, queries, and stale config paths).
- Add concise, high-value comments where behavior is non-obvious (for example: fallback chains, route-linking assumptions, and data-shape constraints); avoid noisy comments that restate code.
- **Keep lockfiles in sync.** After adding, removing, or updating any dependency in a `package.json`, run `pnpm install` from the repo root so `pnpm-lock.yaml` is regenerated. Verify with `pnpm install --frozen-lockfile` before committing. CI uses `--frozen-lockfile` and will fail if the lockfile is stale.

## Unit Testing Standards (Required)
- **Write unit tests for all new code where possible.** Every new utility function, helper, formatter, data transform, or pure function must have a corresponding `*.test.ts` file.
- Test files live next to the code they test (e.g., `format.ts` → `format.test.ts`).
- Use **Vitest** as the test framework (`vitest.config.ts` in `web/`). Run with `pnpm test` or `pnpm -C web test`.
- All tests must pass before merge. CI enforces this in both `web-quality.yml` and `pr-qa-gate.yml`.
- When modifying existing code, **do not remove or weaken existing tests** unless the underlying requirement has changed. If requirements changed, update tests to cover all new behavior while still catching regressions from the original functionality.
- When changing a function's behavior, existing test cases that validated the prior behavior must either (a) still pass if the prior behavior is preserved, or (b) be explicitly updated with a comment explaining why the old expectation no longer applies.
- Prefer testing edge cases, error paths, and boundary conditions — not just happy paths.
- Components with complex logic (conditional rendering, data transforms) should have tests for that logic, extracted into testable utilities where practical.
- Include unit test expectations in issue success criteria. "Tests pass" is not sufficient — criteria should specify **what** is tested (e.g., "Unit tests cover date formatting edge cases including invalid input").

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

## Agentic Workflow

This repository uses a GitHub-native agentic workflow for issue-to-merge automation.

### Workflow Overview
1. **Issue intake** → structured templates force context, intent, success criteria, and screenshot flags.
2. **Requirements refinement** → label `agent:refine` triggers a planning agent that posts an implementation plan.
3. **Implementation** → assign an agent (`@copilot`, `@claude`, `@codex`) to the issue; agent opens a PR.
4. **QA gate** → automated checks + AI QA review run on every PR. Advisory review checks intent alignment, requirements coverage, regressions, standards, and docs.
5. **Human approval** → branch protection requires at least one human approval before merge.
6. **Merge** → human merges after reviewing agent work and QA results.

### Key Files
- `.github/ISSUE_TEMPLATE/feature_request.yml` — structured feature/change ticket.
- `.github/ISSUE_TEMPLATE/bug_report.yml` — structured bug report.
- `.github/PULL_REQUEST_TEMPLATE.md` — PR evidence template (intent, requirements mapping, screenshots).
- `.github/CODEOWNERS` — review routing (currently sole owner: `@midstatesupdate`).
- `.github/agent-prompts/requirements-agent.md` — prompt for the planning/refinement agent.
- `.github/agent-prompts/qa-agent.md` — prompt for the QA review agent.
- `.github/workflows/pr-qa-gate.yml` — PR template enforcement + markdown/build checks.
- `.github/workflows/agent-requirements-refiner.yml` — requirements refinement on `agent:refine` label.

### PR Expectations for Agents
- Include "Intent Check" explaining how the change satisfies business/user intent.
- Include "Requirements Coverage" mapping each success criterion to evidence.
- Include screenshots when the issue flags a visual/UI change.
- Update markdown docs if behavior, routes, or schemas changed.
- **Include unit tests** for all new or changed logic. List new/modified test files in the PR summary.
- If existing tests were modified, explain why and confirm regression coverage is maintained.
- Do not claim success without mapping changes to the issue's success criteria.
- Do not fabricate campaign facts, endorsements, or statistics.

### QA Review Priorities (in order)
1. Intent alignment — does the change serve the stated purpose?
2. Requirements completeness — are all success criteria satisfied with evidence?
3. **Test coverage** — are unit tests present for new/changed logic? Are existing tests preserved or updated with justification?
4. Regression risk — what existing features could break? Were prior test cases weakened without explanation?
5. Standards and documentation quality.

## Best Practices Checklist
- Keep docs and code synchronized in the same change.
- Write for fast scan: short headers, task-based sections, and direct links.
- Use clear definitions for each area to reduce ambiguity for future agents.
- Prefer deterministic workflows (repeatable commands, stable schema names).
- Document breaking changes, migration steps, and operational caveats immediately.
