# Copilot Code Review Instructions

## Project Context
This is a production campaign website for Brad Hochgesang, candidate for Indiana State Senate District 48. PRs are often opened by AI coding agents (Copilot, Codex, Claude). Review with the same rigor as human-authored code.

## Review Priorities (in order)

### 1. Intent Alignment
- Does the change solve the problem stated in the linked issue?
- Would a voter visiting the affected page get the intended experience?
- Are campaign facts accurate? Flag any fabricated endorsements, quotes, statistics, or event details.

### 2. Requirements Coverage
- Check each success criterion in the linked issue — is it satisfied with evidence in the diff?
- Flag unaddressed criteria as blocking.

### 3. Unit Test Coverage (Blocking)
- Every new utility, helper, formatter, or pure function needs a `*.test.ts` file next to it.
- Tests must cover edge cases and error paths, not just happy paths.
- If existing tests were removed or weakened, require a justification comment.
- If a function's behavior changed, verify tests cover both new behavior and preserved prior behavior.

### 4. Regression Risk
- What existing routes, components, or Sanity content could break?
- Check for mobile/accessibility regressions in UI changes.
- Check for Sanity schema changes that could break existing production content.

### 5. Standards Compliance
- TypeScript: strongly typed, no `any` unless justified.
- Components: modular, reusable, following existing patterns in `web/src/components/`.
- Sanity schemas: grouped into tabs/sections, plain-language labels, workflow-ordered fields.
- Lockfile: if `package.json` changed, `pnpm-lock.yaml` must be updated in the same PR.
- Dead code: refactors should remove unused functions, routes, queries, and config in the same change.

### 6. Documentation Sync
- If routes, schemas, or workflows changed, corresponding README files must be updated.
- Markdown links must be valid.
- `.github/copilot-instructions.md` must stay current.

### 7. Visual Evidence
- If the linked issue flagged a UI change, the PR should include screenshots.
- Check for both mobile and desktop if layout changed.

## What to Flag as Blocking
- Missing unit tests for new logic
- Fabricated campaign content (facts, endorsements, statistics)
- Broken existing tests without justification
- Missing lockfile updates when dependencies changed
- Unaddressed success criteria from the linked issue

## What to Flag as Advisory (non-blocking)
- Style/naming suggestions
- Optional refactoring opportunities
- Performance improvements that aren't regressions
- Documentation improvements beyond minimum requirements

## Review Style
- Be direct and specific. Reference file paths and line numbers.
- Never rubber-stamp — verify intent alignment even when code looks clean.
- Distinguish blocking from advisory clearly.
- Your review is advisory — a human must still approve before merge.
