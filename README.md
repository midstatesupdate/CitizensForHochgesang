# Citizens For Hochgesang

Campaign website and AI-first publishing system for Indiana State Senate District 48.

This repository is the project knowledge store for future human and AI contributors. Keep docs current as the system evolves.

## Apps
- web: Next.js (App Router) site
- studio: Sanity Studio

## Current Web Feature Coverage
- Homepage with campaign messaging and CMS-backed summary sections
- News listing and article detail routes
- Scene-based long-form article experiences with per-element animation controls authored in Sanity
- Events listing route
- About & Priorities route with CMS-backed bio/platform content
- Interactive FAQ route with search, filtering, and accordion behavior
- Media links route (YouTube/Facebook/audio/other)
- Support route for volunteer/contact/fundraising calls to action
- Voter action hub with district map, registration links, and browser-persistent checklist
- Browser-persistent dark/light theme selector (defaults to dark mode)
- CMS-driven per-page visual controls (background style, tone accents, container width)
- Site analytics integration via Vercel Analytics for manager dashboards

## Documentation Index
- [`.github/copilot-instructions.md`](.github/copilot-instructions.md): Canonical agent instructions and project context.
- [`.github/README.md`](.github/README.md): What lives in `.github/` and how it should be maintained.
- [`CAMPAIGN_PLAYBOOK.md`](CAMPAIGN_PLAYBOOK.md): AI-ready campaign facts, content guidance, and UX look-and-feel spec.
- [`PLATFORM_README.md`](PLATFORM_README.md): Platform narrative draft and verification checklist.
- [`OPPO_README.md`](OPPO_README.md): Neutral, source-backed opponent research sheet.
- [`CAMPAIGN_TODOS.md`](CAMPAIGN_TODOS.md): Operational backlog for UX, content, links, social workflows, and execution readiness.
- [`web/README.md`](web/README.md): Frontend app guide and workflow.
- [`web/src/README.md`](web/src/README.md): Frontend source code map and extension rules.
- [`web/ACCESSIBILITY_CHECKLIST.md`](web/ACCESSIBILITY_CHECKLIST.md): Accessibility QA checklist.
- [`web/IMAGE_GUIDELINES.md`](web/IMAGE_GUIDELINES.md): Image and media implementation rules.
- [`web/ANALYTICS_PLAN.md`](web/ANALYTICS_PLAN.md): Analytics and reporting plan.
- [`web/PUBLISHING_CHECKLIST.md`](web/PUBLISHING_CHECKLIST.md): Operational publish checklist.
- [`studio/README.md`](studio/README.md): Sanity Studio workflow.
- [`studio/schemaTypes/README.md`](studio/schemaTypes/README.md): Content schema dictionary and modeling guidance.
- [`studio/chat-content/README.md`](studio/chat-content/README.md): Chat-driven content authoring workflow for Sanity.

## Agentic Workflow
This repo uses a GitHub-native agentic workflow: structured issue templates → requirements refinement → agent implementation → automated QA gate → human approval → merge. See [`.github/README.md`](.github/README.md) for the full workflow and setup instructions, and [`.github/copilot-instructions.md`](.github/copilot-instructions.md) § "Agentic Workflow" for details.

## Development

Install dependencies:

```bash
pnpm install
```

Lockfile discipline (required for CI/Cloudflare):
- When changing dependencies in any workspace package (`web/` or `studio/`), run `pnpm install` from repo root.
- Commit the updated root lockfile `pnpm-lock.yaml` in the same change as the `package.json` edit.
- Validate exactly what CI enforces before pushing:

```bash
pnpm install --frozen-lockfile
```

Run apps from the repo root:

```bash
pnpm dev:web
pnpm dev:studio
```

Preferred local ports:
- Web app: `http://localhost:3000`
- Studio: `http://localhost:3333`

When restarting locally, stop existing processes first so ports stay consistent:

```powershell
# Stop existing Next.js / Studio node processes if needed
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start with fixed ports
pnpm -C web dev -- -p 3000
pnpm -C studio dev -- --port 3333
```

Build the website:

```bash
pnpm build:web
```

Run unit tests:

```bash
pnpm test
```

Verify published Sanity content counts consumed by the web app:

```bash
pnpm -C web verify:sanity
```

Run link and freshness checks:

```bash
pnpm -C web check:links
pnpm -C web check:freshness
```

## Link Verification
- Internal CMS URLs (example: `/events`) stay in-app.
- External CMS URLs (example: `https://...`) open in a new tab.
- Placeholder links (`#`) should not be published.

## TODO: Campaign Image Assets Needed
- Provide full-size campaign logo source file for Studio upload (`siteSettings.campaignLogo`).
- Provide additional export sizes if available for campaign operations:
	- 2048px square (primary master)
	- 1024px square (web fallback)
	- 512px square (social/profile)
	- transparent PNG variant if available

## TODO: Social URL Follow-up
- Replace placeholder YouTube URL in `siteSettings.socialLinks` once the official campaign channel URL is available.

Build the studio:

```bash
pnpm build:studio
```

Apply campaign branding content to Sanity:

```bash
$env:LOGO_PATH="C:\\path\\to\\logo_full_size.png"
pnpm -C studio apply:branding
```

Seed baseline published content in Sanity:

```bash
pnpm -C studio seed:content
```
