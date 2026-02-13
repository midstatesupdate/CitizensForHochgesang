export type SocialLink = {
  label: string
  url: string
}

export type IconName =
  | 'bullhorn'
  | 'calendar'
  | 'hands-helping'
  | 'newspaper'
  | 'question-circle'
  | 'reg-newspaper'
  | 'video'
  | 'vote-yea'

export type SanityImageSource = {
  _type?: 'image'
  asset?: {
    _ref: string
    _type?: 'reference'
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export type SiteSettings = {
  siteTitle: string
  tagline: string
  homeDistrictLabel?: string
  homeHeroSummary?: string
  homeLinkMarkup?: string
  campaignLogo?: SanityImageSource
  campaignLogoUrl?: string
  campaignLogoAlt?: string
  candidatePortraitUrl?: string
  candidatePortraitAlt?: string
  candidatePortraitCaption?: string
  homeHeroLayout?: 'clean-split' | 'portrait-left' | 'immersive-overlay'
  homeHeroActions: Array<{
    label: string
    url: string
    icon?: IconName
    style?: 'primary' | 'outline' | 'accent'
  }>
  homeHeroBadges: Array<{
    label: string
    url?: string
    icon?: IconName
    placement?: 'text' | 'media' | 'proof'
  }>
  homeFocusItems: string[]
  homeSectionCards: Array<{
    title: string
    copy: string
    href: string
    icon?: IconName
    ctaLabel?: string
  }>
  headerNavItems: Array<{
    label: string
    href: string
    icon?: IconName
  }>
  pressUpdatedAt?: string
  donateUrl?: string
  volunteerUrl?: string
  contactEmail?: string
  socialLinks: SocialLink[]
}

export type PageVisualPageKey =
  | 'home'
  | 'news'
  | 'news-detail'
  | 'events'
  | 'faq'
  | 'media'
  | 'press'
  | 'support'

export type PageVisualSettings = {
  pageKey: PageVisualPageKey
  backgroundVariant: 'stately-gradient' | 'civic-fabric' | 'diagonal-wash' | 'signal-grid' | 'topo-lines'
  containerVariant: 'standard' | 'narrow' | 'wide'
  toneVariant: 'default' | 'news' | 'events' | 'media' | 'support'
  motionPreset: 'still' | 'calm' | 'balanced' | 'lively' | 'energetic'
  textLinkAnimation: 'none' | 'subtle' | 'sweep' | 'glint'
  pageBackgroundAnimation: 'none' | 'drift' | 'tracers' | 'drift-tracers' | 'pulse'
  scrollRevealAnimation: 'none' | 'soft' | 'dynamic' | 'cascade'
}

export type PostSummary = {
  title: string
  slug: string
  excerpt?: string
  bodyPreview?: string
  coverImage?: SanityImageSource
  publishedAt: string
  coverImageUrl?: string
  newsCardLayout?: 'stacked' | 'image-left' | 'image-right' | 'feature-split' | 'no-photo'
  newsImageOrientation?: 'landscape' | 'portrait'
  newsImageAspectRatio?: '3:2' | '4:3' | '16:9' | '1:1' | '4:5' | '3:4' | '2:3' | '9:16'
  newsCardAnimation?: 'fade-up' | 'slide-up' | 'slide-left' | 'slide-right' | 'none'
  newsBodyPreviewChars?: number
  tags: string[]
}

export type PortableSpan = {
  _type: 'span'
  _key?: string
  text: string
  marks?: string[]
}

export type PortableLinkMarkDef = {
  _key: string
  _type: 'link'
  href: string
}

export type PortableBlock = {
  _type: 'block'
  _key?: string
  style?: string
  children: PortableSpan[]
  markDefs?: PortableLinkMarkDef[]
}

export type StorySceneLayout = 'text' | 'split-left' | 'split-right' | 'highlight'

export type StorySceneAnimation = 'none' | 'fade-up' | 'slide-left' | 'slide-right' | 'zoom-soft'

export type StorySceneBody = {
  _type: 'storyScene'
  _key?: string
  sceneTitle?: string
  layout?: StorySceneLayout
  animationPreset?: StorySceneAnimation
  animationDelayMs?: number
  animationDurationMs?: number
  body: PortableBlock[]
  mediaUrl?: string
  mediaAlt?: string
}

export type StatCalloutItem = {
  _key?: string
  value: string
  label: string
  note?: string
}

export type StatCalloutBody = {
  _type: 'statCallout'
  _key?: string
  headline: string
  animationPreset?: StorySceneAnimation
  animationDelayMs?: number
  animationDurationMs?: number
  items: StatCalloutItem[]
}

export type ImageBody = {
  _type: 'image'
  _key?: string
  alt?: string
  asset?: {
    url?: string
  }
}

export type PostBodyNode = PortableBlock | StorySceneBody | StatCalloutBody | ImageBody

export type PostDetail = PostSummary & {
  body: PostBodyNode[]
  storyTimeline?: Array<StorySceneBody | StatCalloutBody>
}

export type CampaignEvent = {
  id: string
  title: string
  startDate: string
  endDate?: string
  location: string
  description?: string
  rsvpLink?: string
  scheduleImageUrl?: string
}

export type MediaType = 'youtube' | 'facebook' | 'audio' | 'other'

export type MediaLink = {
  id: string
  title: string
  mediaType: MediaType
  url: string
  publishedAt?: string
  thumbnailUrl?: string
}

export type FundraisingLink = {
  id: string
  title: string
  url: string
  description?: string
  imageUrl?: string
  priority: number
}
