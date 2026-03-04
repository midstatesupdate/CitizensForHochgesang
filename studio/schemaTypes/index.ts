import {aboutPriorities} from './aboutPriorities'
import {ctaButton} from './ctaButton'
import {event} from './event'
import {eventsPageSettings} from './eventsPageSettings'
import {faqPageSettings} from './faqPageSettings'
import {fundraisingLink} from './fundraisingLink'
import {homePageSettings} from './homePageSettings'
import {htmlEmbed} from './htmlEmbed'
import {infoBox} from './infoBox'
import {mediaLink} from './mediaLink'
import {mediaPageSettings} from './mediaPageSettings'
import {mediaSettings} from './mediaSettings'
import {newsPageSettings} from './newsPageSettings'
import {pageVisuals} from './pageVisuals'
import {pageVisualSettings} from './pageVisualSettings'
import {platformPageSettings} from './platformPageSettings'
import {post} from './post'
import {pullQuote} from './pullQuote'
import {siteSettings} from './siteSettings'
import {supportPageSettings} from './supportPageSettings'
import {videoEmbed} from './videoEmbed'

export const schemaTypes = [
  // Shared object types
  pageVisuals,
  // Singletons
  siteSettings,
  aboutPriorities,
  homePageSettings,
  newsPageSettings,
  eventsPageSettings,
  platformPageSettings,
  mediaPageSettings,
  supportPageSettings,
  faqPageSettings,
  // Legacy (kept for backward compat — no desk item)
  pageVisualSettings,
  // Document types
  post,
  event,
  mediaLink,
  mediaSettings,
  fundraisingLink,
  // Portable Text types
  htmlEmbed,
  videoEmbed,
  ctaButton,
  pullQuote,
  infoBox,
]
