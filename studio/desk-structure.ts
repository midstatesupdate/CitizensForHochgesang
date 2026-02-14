import type {StructureResolver} from 'sanity/structure'

import {VisualQuickGuide} from './components/visual-quick-guide'

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Campaign Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('About & Priorities')
        .child(S.document().schemaType('aboutPriorities').documentId('aboutPriorities')),
      S.listItem().title('Page Visual Settings').child(S.documentTypeList('pageVisualSettings')),
      S.divider(),
      S.listItem().title('Posts').child(S.documentTypeList('post')),
      S.listItem().title('Events').child(S.documentTypeList('event')),
      S.listItem().title('Media Links').child(S.documentTypeList('mediaLink')),
      S.listItem().title('Fundraising Links').child(S.documentTypeList('fundraisingLink')),
      S.divider(),
      S.listItem()
        .title('Visual Preset Quick Guide')
        .child(S.component(VisualQuickGuide).title('Visual Preset Quick Guide')),
    ])
