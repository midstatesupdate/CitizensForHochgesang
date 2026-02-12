# Accessibility Checklist

Use this checklist before shipping route-level UI changes.

## Global
- [ ] Page has one clear `h1`
- [ ] Heading order is sequential (`h1` -> `h2` -> `h3`)
- [ ] All interactive controls are keyboard reachable
- [ ] Focus states are visible and high contrast
- [ ] Skip link works (`Skip to content`)
- [ ] Color contrast is acceptable for text and controls
- [ ] Motion respects `prefers-reduced-motion`

## Media
- [ ] All meaningful images include descriptive `alt` text
- [ ] Decorative images have empty alt where appropriate
- [ ] Videos have supporting text context and clear labels

## Links and Buttons
- [ ] Link text is descriptive out of context
- [ ] External links are clearly signposted where needed
- [ ] No dead links (`#`) in published content

## Route Validation
- [ ] Home (`/`)
- [ ] News list/detail (`/news`, `/news/[slug]`)
- [ ] Events (`/events`)
- [ ] FAQ (`/faq`)
- [ ] Media (`/media`)
- [ ] Press (`/press`)
- [ ] Support (`/support`)
- [ ] Not Found (`/404`)
