# Citizens For Hochgesang — Homepage Blueprint

**Document type:** Architecture & Content Specification  
**Author:** Campaign Strategy AI (Claude)  
**Date:** March 2, 2026  
**For:** Brad Hochgesang, Claude Code implementation  
**Status:** Ready for implementation

---

## How to Use This Document

This is a **blueprint, not code.** It contains everything needed to implement the redesigned homepage:

1. **Campaign identity & messaging** — the words that go on the site
2. **Homepage section-by-section spec** — what goes where, with content
3. **Sanity CMS field values** — exact values to enter in Studio
4. **Design direction** — visual guidance and reference images
5. **Schema change proposals** — where the current CMS needs extension
6. **District research intel** — background for future content pages

Hand this document to Claude Code in VS Code. It has the context to implement against your existing `CitizensForHochgesang-main` codebase.

---

## 1. Campaign Identity

### Candidate
**Brad Hochgesang** (D), age 46  
Running for **Indiana State Senate, District 48**  
General election: **November 2026** vs. incumbent Daryl Schmitt (R)

### District
Six counties in southwest Indiana: Crawford, Dubois, Gibson, Perry, Pike, Spencer

### Core Message
> Data-driven, constituent-first, willing to stand up to power and fight for the people.

### Tagline
> **"Do the homework. Ask the people. Fight for their answer. I intend to prove it."**

This is the campaign's primary tagline and should appear in the hero section, meta descriptions, and Open Graph tags.

### Why Not Hide the Democrat Label
Brad is not hiding that he's a Democrat, but he's not leading with it. The message is: "We need two healthy parties for accountability." The purple branding represents everyone — not typical Democrat, not Republican. The strategy targets frustrated Republicans who feel taken for granted by local GOP incumbents.

### Candidate Voice & Tone
Based on analysis of three source documents (county council speech, teleprompter script, podcast script):

- **Conversational but prepared** — explains complex topics without condescension
- **Teacher-mode** — breaks down polling methodology, Indiana Code, cost analysis
- **Confrontational but fair** — "We're not vindictive, but we're not going anywhere"
- **Data-first, then emotion** — leads with numbers, closes with family/community impact
- **Humor when effective** — soup analogy for polling, dry wit about suspicious coincidences
- **Direct punches** — "81% of this county said no. They built it anyway. That's why I'm running."

**Voice shorthand:** Sounds like a sharp neighbor who got mad enough to do something about it.

---

## 2. Branding & Color

### Purple Color Scheme (Existing — Keep)
The existing CSS token system is correct. Purple/gold represents bipartisan approach.

**Dark theme (default):**
- Canvas: `#0f0a1b`
- Surface: `#1a1229`
- Ink: `#f6f2ff`
- Accent: `#b896ff` (purple)
- Accent-2: `#f2c45a` (gold)

**Light theme:**
- Canvas: `#f7f3fb`
- Ink: `#2f1854`
- Accent: `#4a2778`
- Accent-2: `#e2ad33`

### Typography (Existing — Keep)
- Display: Newsreader
- Body: Source Sans 3
- Mono: JetBrains Mono

---

## 3. External Links & Assets

### Social & Donation Links

| Platform | URL | Notes |
|----------|-----|-------|
| **ActBlue (Donate)** | `https://secure.actblue.com/donate/brad-hochgesang-1` | Already in CAMPAIGN_PLAYBOOK.md |
| **Facebook** | `https://www.facebook.com/bradhochesangforindianastatesenate` | Already in CAMPAIGN_PLAYBOOK.md |
| **YouTube** | **PENDING — Brad to provide** | Needs to be added to siteSettings.socialLinks |
| **Volunteer (NGP VAN)** | `https://www.ngpvan.com/` | Already in CAMPAIGN_PLAYBOOK.md |
| **Campaign Anthem** | **PENDING — Brad to upload MP3** | See Section 8 for placement spec |

### Photos Needed

Brad will provide photos for the hero section. The design supports time-of-day rotation (see Section 5), but the MVP implementation should use a single hero image. The four photo concepts for eventual rotation:

1. **Morning:** Professional / sweater vest — "I'm a serious candidate"
2. **Afternoon:** Action shot at county council or town hall — "I show up and fight"
3. **Evening:** Casual / Carhartt with neighbors — "I'm one of you"
4. **Late night:** Working at computer with data — "I do the homework"

**MVP:** Use whichever single photo Brad provides first. Time-of-day rotation is a Phase 2 enhancement.

---

## 4. Homepage Structure — Section by Section

The homepage flows top to bottom as follows:

```
┌─────────────────────────────────────────┐
│  STICKY TOP BAR (Donate + Volunteer)    │
├─────────────────────────────────────────┤
│  HAMBURGER NAV (all other pages)        │
├─────────────────────────────────────────┤
│  HERO SECTION                           │
│  Portrait + Name + Tagline + CTAs       │
│  Proof badges strip                     │
├─────────────────────────────────────────┤
│  "WHY I'M RUNNING" section              │
│  Short personal story (emotional hook)  │
├─────────────────────────────────────────┤
│  PRIORITIES CARDS (6 cards)             │
│  Issue cards with icons                 │
├─────────────────────────────────────────┤
│  "PROOF" / CREDIBILITY section          │
│  MSC fight as evidence of values        │
├─────────────────────────────────────────┤
│  MID-PAGE CTA                           │
│  Donate + Volunteer buttons             │
├─────────────────────────────────────────┤
│  NEWS / UPDATES feed (when enabled)     │
├─────────────────────────────────────────┤
│  FOOTER                                 │
│  Donate, Volunteer, Social, Contact     │
└─────────────────────────────────────────┘
```

---

## 5. Section Specs with Content

### 5.1 Sticky Top Bar

**Purpose:** Donate and Volunteer buttons visible at all times during scroll.

**Behavior:**
- Fixed to top of viewport
- Two badge-style buttons: **"Donate"** and **"Volunteer"**
- Compact — single row, minimal height (~40px)
- Semi-transparent background matching canvas color
- Z-index above all other content

**Implementation note:** This is a NEW component. The current `site-header.tsx` has navigation but not a persistent action bar. Add a `<StickyActionBar />` component above or integrated into the header.

**Sanity fields used:**
- `siteSettings.donateUrl` → Donate button href
- `siteSettings.volunteerUrl` → Volunteer button href

---

### 5.2 Navigation

**Current state:** Full nav bar with links.  
**New design:** Collapse to **hamburger menu** on all screen sizes.

**Rationale:** Fewer distractions. The only persistent visible navigation elements should be the Donate/Volunteer sticky bar and the home link/logo. Everything else (News, Events, Platform, Media, FAQ, Support) goes into the hamburger.

**Implementation:** Modify `site-nav.tsx` to always render in collapsed/mobile mode. The hamburger icon opens a slide-out or overlay menu showing all `headerNavItems`.

---

### 5.3 Hero Section

**Layout:** `clean-split` (text left, portrait right) — this is the current default and works well.

**Content for Sanity `siteSettings` fields:**

| Field | Value |
|-------|-------|
| `siteTitle` | `Brad Hochgesang` |
| `tagline` | `Do the homework. Ask the people. Fight for their answer. I intend to prove it.` |
| `homeDistrictLabel` | `Indiana State Senate · District 48` |
| `homeHeroSummary` | `Software engineer. Small business owner. Your neighbor. Running to bring data-driven, constituent-first representation to southwest Indiana.` |
| `homeHeroLayout` | `clean-split` |
| `candidatePortrait` | **[Upload photo when available]** |
| `candidatePortraitAlt` | `Brad Hochgesang, candidate for Indiana State Senate District 48` |
| `candidatePortraitCaption` | `Jasper, Indiana` |

**Hero Actions (buttons):**

| Label | URL | Icon | Style |
|-------|-----|------|-------|
| `Donate` | `https://secure.actblue.com/donate/brad-hochgesang-1` | `donate` | `accent` |
| `Volunteer` | `https://www.ngpvan.com/` | `hands-helping` | `primary` |

**Hero Badges (proof strip):**

| Label | Icon | Placement | URL |
|-------|------|-----------|-----|
| `81% of Dubois County said no to MSC` | `chart-bar` | `proof` | _(none)_ |
| `8 Town Halls organized` | `users` | `proof` | _(none)_ |
| `2 Professional Polls commissioned` | `clipboard-check` | `proof` | _(none)_ |
| `15+ years software engineering` | `laptop` | `proof` | _(none)_ |

**Focus Items (bullet list):**

1. `Property taxes & government spending`
2. `Infrastructure done right — roads, bridges, broadband`
3. `Housing families can afford`
4. `Jobs & small business — keeping young people here`
5. `Government accountability & transparency`
6. `Utility costs — your electric bill matters`

---

### 5.4 "Why I'm Running" Section

**This is NEW content not currently in the schema.** It should live between the hero and the priority cards.

**Implementation options (choose one):**
- **Option A:** Use `homeSectionCards` array with a single full-width card styled differently
- **Option B (recommended):** Add a new `homeWhyRunningBody` rich text field to `siteSettings` schema
- **Option C:** Create this as the first "post" and feature it prominently

**Draft content (written in Brad's voice):**

> ### Why I'm Running
>
> I moved back to Jasper in 2023. Within months, I learned a billion-dollar highway was being pushed through our county — and almost nobody knew about it. The more I dug, the worse it got: no real public input, manipulated polling, costs that didn't add up.
>
> So I did what I do. I pulled the data. I commissioned a real poll — 636 registered voters, conducted by a professional firm. The result: 81% of Dubois County opposed the project. Not a slim margin. Not ambiguous. Eighty-one percent.
>
> I organized eight town halls across the county. I spoke at council meetings. I presented the numbers and asked for a vote.
>
> Somewhere along the way, I realized this wasn't just about one highway. It was about a pattern. Decisions being made without the people who live here. Representatives who stopped representing. A government that forgot who it works for.
>
> That's why I'm running. Not because I've always wanted to be a politician — I haven't. Because the people of District 48 deserve someone who will do the homework, ask the hard questions, and fight for their answer. I intend to prove it.

**Design direction:** This section should feel personal and grounded. No fancy cards or icons — just clean typography, maybe a subtle background shift. A photo of Brad at a town hall or council meeting would work well here if available.

---

### 5.5 Priority Cards Section

**Uses existing `homeSectionCards` array in `siteSettings`.**

Six cards, displayed in a 2×3 or 3×2 grid depending on viewport.

| Title | Copy (max 160 chars) | Icon | Href | CTA Label |
|-------|---------------------|------|------|-----------|
| Property Taxes & Spending | Your taxes should fund your community — not billion-dollar boondoggles. I'll fight for transparent budgets and accountable spending. | `receipt` | `/platform#property-taxes` | `Read more` |
| Infrastructure Done Right | Our roads, bridges, and broadband need real investment — not political pet projects. Data should drive where every dollar goes. | `road` | `/platform#infrastructure` | `Read more` |
| Housing Affordability | Young families can't stay if there's nowhere to live. We need smart housing policy that builds communities, not just developments. | `home` | `/platform#housing` | `Read more` |
| Jobs & Small Business | I'm a small business owner. I know what it takes. We need to keep young people here with real opportunity, not empty promises. | `store` | `/platform#jobs` | `Read more` |
| Government Accountability | 81% of Dubois County opposed the Mid-States Corridor. They built it anyway. That's why I'm running. Accountability starts with showing up. | `clipboard-check` | `/platform#accountability` | `Read more` |
| Utility Costs | Indiana has the steepest electric rate increases in the country. Utility CEOs earn $18 million while 174,000 households get disconnected. That stops. | `lightbulb` | `/platform#utilities` | `Read more` |

**Note:** The `href` values use anchor links to the `/platform` page. When the platform page is enabled and built, these should deep-link to each priority's section. For now, they can link to `/platform` or stay as `#` placeholders (but remember: no hash-only links in production per project rules).

---

### 5.6 "Proof" / Credibility Section

**Purpose:** Show that Brad isn't just making promises — he's already been fighting. The Mid-States Corridor activism is the PROOF of his values, not the centerpiece of the campaign.

**This section is NEW and needs either a schema addition or creative use of existing fields.**

**Recommended implementation:** A visually distinct section with a stat callout feel. Could reuse the `statCallout` pattern from the post schema, or be a static component.

**Content:**

**Section heading:** `I didn't wait to run for office to start fighting for you.`

**Stats row:**

| Value | Label |
|-------|-------|
| `81%` | `of Dubois County voters oppose the Mid-States Corridor` |
| `8` | `public town halls organized across the county` |
| `$65M` | `per percentage point — the real cost of highway polling accuracy` |
| `18%` | `Governor Braun's approval rating in our district` |

**Supporting paragraph:**

> Before I asked for a single vote, I spent two years doing the work: commissioning professional polls, organizing town halls, presenting data to county councils, and holding officials accountable. The Mid-States Corridor fight proved what constituent-first representation looks like. Now I'm bringing that same approach to every issue that matters to District 48.

**Design direction:** Dark background panel or distinct visual treatment to set this apart from the priority cards above. The stats should be large and bold — this is the "receipts" section.

---

### 5.7 Mid-Page CTA

**Simple donate + volunteer call to action.** Breaks up the page and catches visitors who've scrolled past the hero.

**Heading:** `Ready to help?`

**Copy:** `This campaign runs on people, not PACs. Every dollar and every door knock makes a difference.`

**Buttons:**
- Donate (accent style) → ActBlue URL
- Volunteer (primary style) → NGP VAN URL

---

### 5.8 News/Updates Feed

**Already implemented.** Uses existing `getRecentPosts(3)` and renders recent news cards.

**When `pageVisibility.news` is `false`:** Hide this section entirely from homepage.  
**When `true`:** Show the 3 most recent posts with the current card layout.

No changes needed to this section — it works as designed.

---

### 5.9 Events Section

**Already implemented.** Uses existing `getUpcomingEvents()`.

Same visibility logic as news: show only when `pageVisibility.events` is `true`.

---

### 5.10 Media Section

**Already implemented.** Uses existing `getMediaLinks(3)`.

**Future addition:** When the campaign anthem MP3 is available, add it as a `mediaLink` document with `mediaType: 'audio'`. The media section should be able to play/link audio content.

**YouTube and Facebook links** should also be added as `mediaLink` documents as content is produced.

---

### 5.11 Footer

**Existing footer (`site-footer.tsx`) needs these additions:**

- **Social links:** Facebook, YouTube (when available)
- **Donate button** (accent style)
- **Volunteer button** (primary style)
- **Contact email**
- **Legal disclaimer:** "Paid for by Citizens For Hochgesang" (required by Indiana campaign finance law)

**Sanity fields:**
- `siteSettings.socialLinks` — add Facebook and YouTube entries
- `siteSettings.donateUrl`
- `siteSettings.volunteerUrl`
- `siteSettings.contactEmail`

---

## 6. Sanity CMS Content to Enter

This section provides exact values to enter in Sanity Studio. These map to existing schema fields.

### 6.1 Site Settings

**Header group:**
- `siteTitle`: `Brad Hochgesang`
- `homeLinkMarkup`: `<span class="home-link-line">Brad Hochgesang</span><span class="home-link-line">For State Senate</span>`

**Hero group:**
- `tagline`: `Do the homework. Ask the people. Fight for their answer. I intend to prove it.`
- `homeDistrictLabel`: `Indiana State Senate · District 48`
- `homeHeroSummary`: `Software engineer. Small business owner. Your neighbor. Running to bring data-driven, constituent-first representation to southwest Indiana.`
- `homeHeroLayout`: `clean-split`
- `candidatePortrait`: **[Upload when available]**
- `candidatePortraitAlt`: `Brad Hochgesang, candidate for Indiana State Senate District 48`

**Hero Actions:** (see Section 5.3 table)

**Hero Badges:** (see Section 5.3 table)

**Focus Items:** (see Section 5.3 list)

**Home Cards:** (see Section 5.5 table — all 6 cards)

**Contact & Social group:**
- `donateUrl`: `https://secure.actblue.com/donate/brad-hochgesang-1`
- `volunteerUrl`: `https://www.ngpvan.com/`
- `contactEmail`: **[Brad to provide]**
- `socialLinks`:
  - `{ label: "Facebook", url: "https://www.facebook.com/bradhochesangforindianastatesenate" }`
  - `{ label: "YouTube", url: "[PENDING]" }`

**Page Visibility:** (all `false` until content is ready — homepage functions independently)

### 6.2 About & Priorities

When the platform page is enabled, create priority entries matching the 6 homepage cards. Each priority should have:

- `title` matching the card title
- `slug` matching the anchor fragment (e.g., `property-taxes`)
- `summary` matching the card copy
- `body` — detailed policy position (to be drafted)
- `links` — supporting evidence, data sources

**This content will be drafted in a separate session.** The homepage cards can link to `/platform` generically until priority detail pages are built.

---

## 7. Schema Changes Needed

The current Sanity schema handles most of the homepage redesign. These additions would improve it:

### 7.1 "Why I'm Running" Section (Recommended)

Add to `siteSettings` schema, `hero` group:

```
Field: homeWhyRunningHeading
Type: string
Default: "Why I'm Running"
Max: 80

Field: homeWhyRunningBody  
Type: array of block (portable text)
Description: Personal narrative section shown below hero. 
             Supports rich text with inline images.

Field: homeWhyRunningImage
Type: image (with hotspot)
Description: Optional photo for the Why I'm Running section.
```

### 7.2 "Proof" / Credibility Section (Recommended)

Add to `siteSettings` schema, new group `proof`:

```
Field: homeProofHeading
Type: string
Default: "I didn't wait to run for office to start fighting for you."
Max: 160

Field: homeProofStats
Type: array of objects
  - value: string (max 16) — e.g., "81%"
  - label: string (max 120) — e.g., "of Dubois County voters oppose MSC"
Max items: 4

Field: homeProofBody
Type: text (rows: 4)
Max: 500
Description: Supporting paragraph below the stats.
```

### 7.3 Mid-Page CTA (Recommended)

Add to `siteSettings` schema, new group or existing `hero` group:

```
Field: homeMidCtaHeading
Type: string
Default: "Ready to help?"
Max: 80

Field: homeMidCtaCopy
Type: text (rows: 2)
Default: "This campaign runs on people, not PACs..."
Max: 200
```

### 7.4 Campaign Anthem (Optional — Phase 2)

The `mediaLink` schema already supports `mediaType: 'audio'`. No schema change needed. When Brad uploads the MP3:

1. Host the MP3 (Sanity asset, or external host like S3/Cloudflare R2)
2. Create a `mediaLink` document with `mediaType: 'audio'` and the hosted URL
3. The frontend media section can render an `<audio>` player for audio-type media links

### 7.5 Sticky Action Bar (No Schema Change)

This is a frontend-only component. It reads `donateUrl` and `volunteerUrl` from `siteSettings` — both fields already exist.

---

## 8. Campaign Anthem Placement Spec

When the MP3 is available:

**Primary placement:** Media section of homepage (when enabled) as an embedded audio player.

**Secondary placement:** A small "play" button in the hero section or proof section — a subtle way to let visitors hear it without it dominating the page.

**Technical approach:**
- Host MP3 as a Sanity file asset or on external CDN
- Create `mediaLink` document: `{ title: "Campaign Anthem", mediaType: "audio", url: "..." }`
- Frontend renders `<audio controls>` element for audio-type media links
- Optional: Add a `featuredAudio` field to `siteSettings` that references a `mediaLink` document for homepage embedding

---

## 9. Design Direction & Visual References

### Overall Feel
- **Clean and uncluttered** — fewer distractions, more whitespace
- **Some animations/fly-ins** — but not everything. Selective use.
- **Containers with subtle depth** — cards should feel like they lift off the page
- **Purple as unifying color** — bipartisan identity, not party identity

### Animation Guidelines
- **Hero:** Subtle fade-in on load (text first, then portrait)
- **Priority cards:** Staggered fade-up on scroll reveal
- **Proof stats:** Counter-style number animation on scroll into view
- **CTAs:** Gentle hover scale/glow
- **Everything else:** Static or minimal transition

**Use existing motion presets:** The `pageVisualSettings` system already has motion controls. Set homepage to:
- `motionPreset`: `balanced`
- `scrollRevealAnimation`: `soft`
- `pageBackgroundAnimation`: `drift`
- `backgroundVariant`: `stately-gradient`

### Mobile Considerations
- Sticky action bar must work on mobile (fixed bottom instead of top?)
- Hero portrait stacks above or below text on narrow screens
- Priority cards go single-column
- Hamburger nav is already the design intent for all breakpoints

---

## 10. Opponent Contrast (For Content, Not Homepage)

This is background context for future content pages, not homepage content. Never attack by name on the homepage.

**Daryl Schmitt (R, incumbent):**
- Appointed September 2024 via caucus (not elected)
- Fifth-generation farmer, Dubois County Council member
- Publicly stated goal: bring "Christian values into government and schools"
- Seen as Mike Braun ally (Braun polls at 18% approval in district)

**Contrast frame (for future use):**

| Brad | Schmitt |
|------|---------|
| Data-driven | Ideology-driven |
| Elected accountability | Appointed insider |
| Constituent-first | Party-first |
| Commissioned polls, organized town halls | Silence on MSC |
| Software engineer + small business | Career politician path |

---

## 11. District Research Summary

Full research report was generated separately (see "The Real Pain Points Across Indiana Senate District 48" artifact). Key findings for homepage messaging:

### Universal Pain Points Across All 6 Counties

1. **Electric bills** — Indiana has the steepest rate increases in the country. CenterPoint (serves most of district) raised bills ~25%. Utility CEOs earn $18M while 174,000 households get disconnected.

2. **Coal plant transition** — Three of the nation's largest coal plants sit in the district (Gibson, Rockport, Petersburg). Workers lose jobs while ratepayers foot the bill for coal-to-gas conversion. No workforce transition plan exists.

3. **Healthcare deserts** — Three counties have NO hospital. Perry County lost OB services. Provider ratios are 3-4x worse than state average. 14 OB units closed statewide in 5 years.

4. **Population decline** — All five non-Dubois counties are losing people. Spencer County lost 5.4% in a decade. Young people leave because there's no housing, limited childcare, and shrinking opportunity.

5. **Housing shortage** — Pike County hadn't built a new subdivision in 35+ years. Holiday World in Spencer County had to build employee housing. Crawford County held its first-ever housing summit.

6. **Infrastructure** — Gibson County lost $1.5M in road funding due to a clerical error. Crawford County roads are expensive due to terrain. Broadband improving but not complete.

7. **School funding** — SB 1 property tax relief may gut rural school budgets. Cannelton Schools (Perry) nearly dissolved. Crawford County exploring 4-day school week.

8. **Opioids** — Persistent crisis. 80% of settlement funds remain unallocated statewide.

### County-Specific Messaging Hooks

| County | Key Hook | Message |
|--------|----------|---------|
| **Crawford** | Poorest, most isolated, highest unemployment | "You've been forgotten by Indianapolis." |
| **Gibson** | Economic engine (Toyota) but can't retain residents | "You deserve leaders who don't drop the ball on basics." |
| **Perry** | Innovative but fragile (MakeMyMove, lost OB services) | "Your innovation deserves state support, not state neglect." |
| **Pike** | Ground zero for coal transition (AES $1.1B investment) | "Energy workers built this state — they deserve a real transition plan." |
| **Spencer** | Rockport plant closure = $7M tax revenue loss by 2028 | "You shouldn't have to choose between clean air and a funded school system." |
| **Dubois** | MSC fight, strong economy, Brad's home base | "81% spoke. I listened. That's how this should work." |

---

## 12. Cannabis Position (For Platform Page, Not Homepage)

Cannabis legalization is part of Brad's platform but intentionally excluded from the homepage priority cards. It should appear on the `/platform` page when enabled.

**Position:** Full recreational legalization, well-regulated.

**Framing (economic, not culture war):**
> We're shipping money to Illinois, Michigan, Ohio, and Kentucky. Prohibition has never worked — it destroys families and wastes police resources. Full legalization means tax revenue for roads, bridges, and schools. Let's stop pretending this isn't happening and start profiting from it like our neighbors do.

**Disclosure:** Brad's wife Maggie Marystone does cannabis consulting. They own small stakes in two dispensaries (one in Indiana, one in Illinois). This should be disclosed proactively on the platform page.

---

## 13. Implementation Priorities

### Phase 1 (Now — Homepage MVP)
1. ☐ Update `siteSettings` content in Sanity with values from Section 6
2. ☐ Add sticky action bar component
3. ☐ Implement hamburger-only navigation
4. ☐ Add "Why I'm Running" section (schema + component)
5. ☐ Configure 6 priority cards with content from Section 5.5
6. ☐ Add "Proof" / credibility section (schema + component)
7. ☐ Add mid-page CTA section
8. ☐ Update footer with social links and legal disclaimer
9. ☐ Upload candidate photo when available
10. ☐ Add YouTube URL when available

### Phase 2 (Soon — Content & Polish)
- ☐ Build out `/platform` page with full priority detail content
- ☐ Add campaign anthem audio player
- ☐ Implement time-of-day hero image rotation
- ☐ Add county-specific landing page content
- ☐ Enable News, Events, Media pages with initial content
- ☐ Create first batch of news posts (MSC fight recap, campaign announcement, issue explainers)

### Phase 3 (Campaign Ramp)
- ☐ A/B test hero messaging variants
- ☐ Add endorsements section
- ☐ Add volunteer signup form integration
- ☐ Social media auto-post integration
- ☐ Event RSVP flow optimization

---

## 14. File Reference

### Existing Files to Modify
- `web/src/app/page.tsx` — Homepage component (major restructure)
- `web/src/components/site-header.tsx` — Add sticky action bar
- `web/src/components/site-nav.tsx` — Convert to hamburger-only
- `web/src/components/site-footer.tsx` — Add social links, legal
- `studio/schemaTypes/siteSettings.ts` — Add new fields (Sections 7.1-7.3)
- `studio/schemaTypes/index.ts` — Register any new schemas
- `web/src/lib/cms/types.ts` — Add TypeScript types for new fields
- `web/src/lib/cms/repository.ts` — Add queries for new fields
- `web/src/app/globals.css` — Any new section styles

### New Files to Create
- `web/src/components/sticky-action-bar.tsx`
- `web/src/components/why-running-section.tsx`
- `web/src/components/proof-section.tsx`
- `web/src/components/mid-page-cta.tsx`

### Config Files (No Changes)
- `sanity.config.ts` — No changes
- `next.config.ts` — No changes
- `package.json` — No new dependencies expected

---

## 15. Open Items

| Item | Owner | Status |
|------|-------|--------|
| YouTube channel URL | Brad | Pending |
| Campaign anthem MP3 | Brad | Pending — will upload |
| Candidate photos (hero section) | Brad | Pending — will provide |
| Contact email for footer | Brad | Pending |
| Other county allies/connections | Brad | Needs field research |
| Volunteer form URL (if different from NGP VAN) | Brad | Confirm |
| Legal review of campaign finance disclaimer text | Brad | Verify with compliance |

---

*End of blueprint. Hand this to Claude Code and let it build.*