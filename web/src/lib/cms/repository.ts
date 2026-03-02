import {sanityQuery} from './client'
import {
  mockAboutPriorities,
  mockEvents,
  mockFundraisingLinks,
  mockMediaLinks,
  mockPosts,
  mockSiteSettings,
} from './mockData'
import type {
  AboutPriorities,
  CampaignEvent,
  FundraisingLink,
  MediaLink,
  PageVisibilityKey,
  PageVisualPageKey,
  PageVisualSettings,
  PostDetail,
  PostSummary,
  SiteSettings,
} from './types'
import {isPageEnabled} from './types'
import {getDefaultPageVisual} from './page-visuals'

function sortByDateDesc<T extends {publishedAt?: string}>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
    return bTime - aTime
  })
}

function sortByDateAsc<T extends {startDate: string}>(items: T[]): T[] {
  return [...items].sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
}

export async function getAboutPriorities(): Promise<AboutPriorities> {
  const query = `*[_type=="aboutPriorities"][0]{
    "pageEyebrow": coalesce(pageEyebrow, "About & Priorities"),
    "pageTitle": coalesce(pageTitle, "Who Brad is and what this campaign stands for"),
    pageIntro,
    "bioHeading": coalesce(bioHeading, "Candidate bio"),
    "bioBody": coalesce(bioBody[]{
      ...,
      _type == "image" => {
        ...,
        "asset": {
          "url": asset->url
        }
      }
    }, []),
    "valuesHeading": coalesce(valuesHeading, "Campaign values"),
    "values": coalesce(values, []),
    "prioritiesHeading": coalesce(prioritiesHeading, "Core priorities"),
    "priorities": coalesce(priorities[]{
      title,
      "slug": slug.current,
      summary,
      "body": coalesce(body[]{
        ...,
        _type == "image" => {
          ...,
          "asset": {
            "url": asset->url
          }
        }
      }, []),
      "links": coalesce(links[]{label, url}, [])
    }, []),
    "ctaHeading": coalesce(ctaHeading, "Get involved"),
    ctaCopy,
    "primaryCtaLabel": coalesce(primaryCtaLabel, "Volunteer & donate"),
    "primaryCtaUrl": coalesce(primaryCtaUrl, "/support"),
    "secondaryCtaLabel": coalesce(secondaryCtaLabel, "Attend an event"),
    "secondaryCtaUrl": coalesce(secondaryCtaUrl, "/events")
  }`

  const about = await sanityQuery<AboutPriorities>(query, undefined, {revalidateSeconds: 0})
  if (!about) {
    return mockAboutPriorities
  }

  return {
    ...mockAboutPriorities,
    ...about,
    bioBody: about.bioBody?.length ? about.bioBody : mockAboutPriorities.bioBody,
    values: about.values?.length ? about.values : mockAboutPriorities.values,
    priorities: about.priorities?.length
      ? about.priorities.map((priority) => ({
          ...priority,
          body: priority.body?.length ? priority.body : [{_type: 'block', children: [{_type: 'span', text: priority.summary, marks: []}]}],
          links: priority.links ?? [],
        }))
      : mockAboutPriorities.priorities,
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const query = `*[_type=="siteSettings"][0]{
    "siteTitle": coalesce(siteTitle, "Citizens For Hochgesang"),
    "tagline": coalesce(tagline, "Practical leadership for Indiana State Senate District 48."),
    "homeDistrictLabel": coalesce(homeDistrictLabel, "Indiana State Senate District 48"),
    homeHeroSummary,
    "homeLinkMarkup": coalesce(homeLinkMarkup, "<span class='home-link-line'>Brad Hochgesang</span><span class='home-link-line'>For State Senate</span>"),
    campaignLogo,
    headerLogoSmall,
    "campaignLogoUrl": campaignLogo.asset->url,
    "headerLogoSmallUrl": headerLogoSmall.asset->url,
    "campaignLogoAlt": campaignLogoAlt,
    "candidatePortraitUrl": candidatePortrait.asset->url,
    "candidatePortraitAlt": candidatePortraitAlt,
    candidatePortraitCaption,
    "homeHeroLayout": coalesce(homeHeroLayout, "clean-split"),
    "headerNavItems": coalesce(headerNavItems[]{
      label,
      href,
      icon
    }, []),
    "homeHeroActions": coalesce(homeHeroActions[]{
      label,
      url,
      icon,
      style
    }, []),
    "homeHeroBadges": coalesce(homeHeroBadges[]{
      label,
      url,
      icon,
      placement
    }, []),
    "homeFocusItems": coalesce(homeFocusItems, []),
    "homeSectionCards": coalesce(homeSectionCards[]{
      title,
      copy,
      href,
      icon,
      ctaLabel
    }, []),
    pressUpdatedAt,
    donateUrl,
    volunteerUrl,
    contactEmail,
    "socialLinks": coalesce(socialLinks[]{
      label,
      url
    }, []),
    "pageVisibility": coalesce(
      pageVisibility{
        news,
        events,
        faq,
        platform,
        media,
        support
      },
      {
        "news": false,
        "events": false,
        "faq": false,
        "platform": false,
        "media": false,
        "support": false
      }
    )
  }`

  const settings = await sanityQuery<SiteSettings>(query, undefined, {revalidateSeconds: 0})
  if (!settings) {
    return mockSiteSettings
  }

  return {
    ...mockSiteSettings,
    ...settings,
    socialLinks: settings.socialLinks?.length ? settings.socialLinks : mockSiteSettings.socialLinks,
    headerNavItems: settings.headerNavItems?.length ? settings.headerNavItems : mockSiteSettings.headerNavItems,
    homeHeroActions: settings.homeHeroActions?.length ? settings.homeHeroActions : mockSiteSettings.homeHeroActions,
    homeHeroBadges: settings.homeHeroBadges?.length ? settings.homeHeroBadges : mockSiteSettings.homeHeroBadges,
    homeFocusItems: settings.homeFocusItems?.length ? settings.homeFocusItems : mockSiteSettings.homeFocusItems,
    homeSectionCards: settings.homeSectionCards?.length ? settings.homeSectionCards : mockSiteSettings.homeSectionCards,
  }
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const query = `*[_type=="post"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    "bodyPreview": coalesce(pt::text(body), ""),
    publishedAt,
    coverImage,
    "coverImageUrl": coverImage.asset->url,
    "newsCardLayout": coalesce(newsCardLayout, "stacked"),
    "newsImageOrientation": coalesce(newsImageOrientation, "landscape"),
    "newsImageAspectRatio": coalesce(newsImageAspectRatio, "3:2"),
    "newsCardAnimation": coalesce(newsCardAnimation, "fade-up"),
    "newsBodyPreviewChars": coalesce(newsBodyPreviewChars, 2000),
    "tags": coalesce(tags, [])
  }`

  const posts = await sanityQuery<PostSummary[]>(query)
  if (!posts || posts.length === 0) {
    return sortByDateDesc(
      mockPosts.map(
        ({
          title,
          slug,
          excerpt,
          bodyPreview,
          coverImage,
          publishedAt,
          coverImageUrl,
          newsCardLayout,
          newsImageOrientation,
          newsImageAspectRatio,
          newsCardAnimation,
          newsBodyPreviewChars,
          tags,
        }) => ({
        title,
        slug,
        excerpt,
        bodyPreview,
        coverImage,
        publishedAt,
        coverImageUrl,
        newsCardLayout,
        newsImageOrientation,
        newsImageAspectRatio,
        newsCardAnimation,
        newsBodyPreviewChars,
        tags,
      })
      )
    )
  }

  return posts
}

export async function getRecentPosts(limit = 3): Promise<PostSummary[]> {
  const posts = await getAllPosts()
  return posts.slice(0, limit)
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const query = `*[_type=="post" && slug.current==$slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "coverImageUrl": coverImage.asset->url,
    "tags": coalesce(tags, []),
    "body": coalesce(body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": {
          "url": asset->url
        }
      },
      _type == "storyScene" => {
        ...,
        "mediaUrl": media.asset->url
      }
    }, [])
    ,"storyTimeline": coalesce(storyTimeline[]{
      ...,
      _type == "storyScene" => {
        ...,
        "mediaUrl": media.asset->url
      }
    }, [])
  }`

  const post = await sanityQuery<PostDetail>(query, {slug})
  if (post) {
    return post
  }

  return mockPosts.find((item) => item.slug === slug) ?? null
}

export async function getUpcomingEvents(): Promise<CampaignEvent[]> {
  const query = `*[_type=="event"] | order(startDate asc){
    "_id": _id,
    title,
    "slug": slug.current,
    startDate,
    endDate,
    location,
    description,
    "detailBody": coalesce(detailBody[]{
      ...,
      _type == "image" => {
        ...,
        "asset": {
          "url": asset->url
        }
      }
    }, []),
    "detailLinks": coalesce(detailLinks[]{label, url}, []),
    scheduleImage,
    rsvpLink,
    "scheduleImageUrl": scheduleImage.asset->url,
    "eventCardLayout": coalesce(eventCardLayout, "stacked"),
    "eventImageOrientation": coalesce(eventImageOrientation, "landscape"),
    "eventImageAspectRatio": coalesce(eventImageAspectRatio, "3:2"),
    "eventCardAnimation": coalesce(eventCardAnimation, "fade-up"),
    "eventDescriptionPreviewChars": coalesce(eventDescriptionPreviewChars, 2000),
    "tags": coalesce(tags, [])
  }`

  const events = await sanityQuery<Array<Omit<CampaignEvent, 'id'> & {_id: string}>>(query)
  if (!events || events.length === 0) {
    return sortByDateAsc(mockEvents)
  }

  return sortByDateAsc(events.map(({_id, ...event}) => ({id: _id, ...event})))
}

export async function getMediaLinks(limit?: number): Promise<MediaLink[]> {
  const query = `*[_type=="mediaLink"] | order(publishedAt desc){
    "_id": _id,
    title,
    mediaType,
    url,
    publishedAt,
    "thumbnailUrl": thumbnail.asset->url
  }`

  const media = await sanityQuery<Array<Omit<MediaLink, 'id'> & {_id: string}>>(query)
  const normalized =
    media && media.length > 0
      ? sortByDateDesc(media.map(({_id, ...item}) => ({id: _id, ...item})))
      : sortByDateDesc(mockMediaLinks)

  return typeof limit === 'number' ? normalized.slice(0, limit) : normalized
}

export async function getFundraisingLinks(): Promise<FundraisingLink[]> {
  const query = `*[_type=="fundraisingLink"] | order(priority desc){
    "_id": _id,
    title,
    url,
    description,
    "imageUrl": image.asset->url,
    "priority": coalesce(priority, 0)
  }`

  const links = await sanityQuery<Array<Omit<FundraisingLink, 'id'> & {_id: string}>>(query)
  if (!links || links.length === 0) {
    return [...mockFundraisingLinks].sort((a, b) => b.priority - a.priority)
  }

  return links
    .map(({_id, ...link}) => ({id: _id, ...link}))
    .sort((a, b) => b.priority - a.priority)
}

export async function getPageVisualSettings(pageKey: PageVisualPageKey): Promise<PageVisualSettings> {
  const query = `*[_type=="pageVisualSettings" && pageKey==$pageKey][0]{
    pageKey,
    "backgroundVariant": coalesce(backgroundVariant, "stately-gradient"),
    "containerVariant": coalesce(containerVariant, "standard"),
    "toneVariant": coalesce(toneVariant, "default"),
    "motionPreset": coalesce(motionPreset, "balanced"),
    "textLinkAnimation": coalesce(textLinkAnimation, "sweep"),
    "pageBackgroundAnimation": coalesce(pageBackgroundAnimation, "drift"),
    "scrollRevealAnimation": coalesce(scrollRevealAnimation, "soft")
  }`

  const settings = await sanityQuery<PageVisualSettings>(query, {pageKey}, {revalidateSeconds: 0})
  return settings ?? getDefaultPageVisual(pageKey)
}

/**
 * Fetches site settings and calls Next.js `notFound()` if the given page key
 * is disabled. Call this at the top of every non-home server page component.
 */
export async function assertPageEnabled(pageKey: PageVisibilityKey): Promise<void> {
  const {notFound} = await import('next/navigation')
  const settings = await getSiteSettings()
  if (!isPageEnabled(settings.pageVisibility, pageKey)) {
    notFound()
  }
}
