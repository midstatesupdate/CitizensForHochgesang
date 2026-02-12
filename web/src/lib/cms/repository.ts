import {sanityQuery} from './client'
import {
  mockEvents,
  mockFundraisingLinks,
  mockMediaLinks,
  mockPosts,
  mockSiteSettings,
} from './mockData'
import type {
  CampaignEvent,
  FundraisingLink,
  MediaLink,
  PageVisualPageKey,
  PageVisualSettings,
  PostDetail,
  PostSummary,
  SiteSettings,
} from './types'
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

export async function getSiteSettings(): Promise<SiteSettings> {
  const query = `*[_type=="siteSettings"][0]{
    "siteTitle": coalesce(siteTitle, "Citizens For Hochgesang"),
    "tagline": coalesce(tagline, "Practical leadership for Indiana State Senate District 48."),
    "campaignLogoUrl": campaignLogo.asset->url,
    "campaignLogoAlt": campaignLogoAlt,
    "candidatePortraitUrl": candidatePortrait.asset->url,
    "candidatePortraitAlt": candidatePortraitAlt,
    "homeHeroLayout": coalesce(homeHeroLayout, "clean-split"),
    pressUpdatedAt,
    donateUrl,
    volunteerUrl,
    contactEmail,
    "socialLinks": coalesce(socialLinks[]{
      label,
      url
    }, [])
  }`

  const settings = await sanityQuery<SiteSettings>(query, undefined, {revalidateSeconds: 0})
  return settings ?? mockSiteSettings
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const query = `*[_type=="post"] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "coverImageUrl": coverImage.asset->url,
    "tags": coalesce(tags, [])
  }`

  const posts = await sanityQuery<PostSummary[]>(query)
  if (!posts || posts.length === 0) {
    return sortByDateDesc(
      mockPosts.map(({title, slug, excerpt, publishedAt, coverImageUrl, tags}) => ({
        title,
        slug,
        excerpt,
        publishedAt,
        coverImageUrl,
        tags,
      }))
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
    startDate,
    endDate,
    location,
    description,
    rsvpLink,
    "scheduleImageUrl": scheduleImage.asset->url
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
