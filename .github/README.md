# .github Area

## Definition
Repository governance, CI/CD automation, and agent-facing instruction area. Files here define how AI agents, workflows, and branch protections should behave in this project.

## Contents

### Governance & Instructions
- [`copilot-instructions.md`](copilot-instructions.md): Canonical AI collaborator context, priorities, constraints, doc index, and agentic workflow overview.
- [`CODEOWNERS`](CODEOWNERS): Review routing. Currently sole owner: `@midstatesupdate`.
- [`PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md): Required PR evidence structure (intent, requirements mapping, screenshots, QA checklist).

### Issue Templates
- [`ISSUE_TEMPLATE/feature_request.yml`](ISSUE_TEMPLATE/feature_request.yml): Structured feature/change ticket with forced intent, success criteria, and screenshot flags.
- [`ISSUE_TEMPLATE/bug_report.yml`](ISSUE_TEMPLATE/bug_report.yml): Structured bug report with reproduction steps and severity.

### Agent Prompts
- [`agent-prompts/requirements-agent.md`](agent-prompts/requirements-agent.md): Prompt for the planning/refinement agent. Produces implementation plans on issues labeled `agent:refine`.
- [`agent-prompts/qa-agent.md`](agent-prompts/qa-agent.md): Reference QA review prompt. Context for the Copilot code review instructions.
- [`copilot-review-instructions.md`](copilot-review-instructions.md): Copilot code review configuration. Read automatically by the GitHub Copilot reviewer via branch ruleset.

### Workflows (CI/CD)
- [`workflows/web-quality.yml`](workflows/web-quality.yml): Push/PR quality checks for lint, build, Sanity verification, link and freshness checks.
- [`workflows/pr-qa-gate.yml`](workflows/pr-qa-gate.yml): PR gate — template enforcement, build/lint, and docs checks. AI review is handled by Copilot code review ruleset (not a workflow job).
- [`workflows/agent-requirements-refiner.yml`](workflows/agent-requirements-refiner.yml): Fires on `agent:refine`, dispatches in order `@claude` → `@codex` → `@copilot`, waits for a structured plan response, and escalates automatically if no response is detected.

## Agentic Workflow Summary
1. **Issue intake** → structured templates force context, intent, success criteria.
2. **Refinement** → label `agent:refine` triggers workflow, which dispatches `@claude` first, then `@codex`, then `@copilot` until a structured plan is posted.
3. **Implementation** → assign agent (`@copilot`, `@claude`, `@codex`) to the issue.
4. **QA gate** → automated checks + AI review on every PR.
5. **Human approval** → branch protection requires human review before merge.
6. **Merge** → human merges after verifying agent work.

See [`copilot-instructions.md`](copilot-instructions.md) § "Agentic Workflow" for full details.

## Setup: Branch Protection / Rulesets (Manual)
After pushing these files, configure in GitHub repo Settings → Rules → Rulesets (or Branch protection):
- **Require pull request** before merging to `main`.
- **Require status checks**: `PR Template Enforcement`, `Build & Lint`, `Documentation Checks`.
- **Require approving review(s)**: at least 1 (CODEOWNER).
- **Require conversation resolution** (optional but recommended).
- **Automatically request Copilot code review**: enable, with "Review draft pull requests" and "Review new pushes" checked.
- **Do not allow bypassing** for strictness (or allow for emergency fixes).

## Maintenance Rules
- Keep instruction files concise, factual, and current.
- Add links to any new major docs created elsewhere in the repo.
- Update definitions when project scope changes.
- When adding new workflows, register them in this README.
