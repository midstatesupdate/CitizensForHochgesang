# Publishing Checklist

## Before Publish
- [ ] Content facts verified and source-backed where required
- [ ] Links validated (`pnpm -C web check:links`)
- [ ] Freshness check reviewed (`pnpm -C web check:freshness`)
- [ ] Images present and appropriate dimensions
- [ ] Accessibility checklist reviewed

## Build and Validation
- [ ] `pnpm -C web lint`
- [ ] `pnpm -C web build`
- [ ] `pnpm -C web verify:sanity`
- [ ] Temporary: skip agent preflight "read changed files" step (known intermittent hang) and run explicit validation commands directly until debug item is resolved.

## After Publish
- [ ] Spot check homepage, news, events, media, press, support
- [ ] Confirm canonical/sitemap/robots outputs
- [ ] Confirm CTA destination pages are reachable
