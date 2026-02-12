import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './desk-structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'n2oyijjv'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'default',
  title: 'Citizens For Hochgesang',

  projectId,
  dataset,

  plugins: [structureTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
