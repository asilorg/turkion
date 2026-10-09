import { articleMetadataNodes } from '../utils/article-metadata'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', (_event, doc) => {
    doc.body = { ...doc.body, value: [...doc.body.value, ...articleMetadataNodes(doc)] }
  })
})
