## Summary
<!-- What changed and why? Keep it brief. -->

## Linked Issue(s)
- Closes #

## Intent Check
<!-- Explain how this PR satisfies the *intent* of the ticket — not just the literal checklist.
     What user/business outcome does this deliver? -->

## Requirements Coverage
<!-- Map each success criterion from the issue to evidence in this PR.
     Copy criteria from the issue and add evidence for each. -->
- [ ] Criterion 1:
  - Evidence:
- [ ] Criterion 2:
  - Evidence:

## Testing Performed
- [ ] `pnpm build:web` passes (no type/build errors)
- [ ] `pnpm -C web lint` passes
- [ ] `pnpm -C web test` passes (all unit tests green)
- [ ] `pnpm build:studio` passes
- [ ] Manual test performed
- [ ] Edge cases reviewed

### Unit Tests
<!-- List new or modified test files. Explain what is tested and why.
     If existing tests were changed, explain what changed and confirm
     regression coverage is maintained. -->
- [ ] New test file(s) added: <!-- e.g., format.test.ts -->
- [ ] Existing test file(s) updated: <!-- explain why -->
- [ ] No testable logic added (explain why)

### Test Details
<!-- Commands run, manual verification steps, notable observations -->

## Visual Evidence (required for UI changes)
<!-- Attach screenshots, video, or GIF when the issue flags a visual change.
     Use before/after comparisons for layout or style changes. -->
- [ ] N/A (no UI change)
- [ ] Screenshot(s) attached
- [ ] Before/After included (if applicable)

## Documentation Updates
- [ ] Not needed
- [ ] Updated relevant README / markdown docs
- [ ] Verified linked markdown references still valid
- [ ] Updated `.github/copilot-instructions.md` if behavior changed

## Risks / Rollback
<!-- Any notable risk and rollback plan. "None" is fine for low-risk changes. -->

## QA Agent Checklist (do not remove)
<!-- Agents and reviewers verify these before approval -->
- [ ] Meets all issue success criteria
- [ ] Meets the stated intent (not just literal requirements)
- [ ] Coding standards followed (see `.github/copilot-instructions.md`)
- [ ] **Unit tests present** for all new/changed logic (not just "tests pass")
- [ ] **Existing tests preserved** or updated with justification for changes
- [ ] **Test quality**: edge cases, error paths, and boundary conditions covered
- [ ] No obvious regressions to existing features
- [ ] Documentation is current and consistent with code changes
- [ ] No fabricated campaign facts, endorsements, or statistics
