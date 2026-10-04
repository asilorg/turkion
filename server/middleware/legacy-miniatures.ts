// Keep existing public image links usable after archiving the large originals.
export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  if (['GET', 'HEAD'].includes(event.method) && url.pathname.startsWith('/miniatures/')) {
    return sendRedirect(event, `${url.pathname.replace('/miniatures/', '/miniatures-web/')}.webp${url.search}`, 301)
  }
})
