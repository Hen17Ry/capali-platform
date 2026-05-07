import { load } from 'cheerio'

interface ScrapedData {
  title: string
  description: string
  content: string
  image: string
  platform: string
  type: string
}

/**
 * Detect platform from URL
 */
function detectPlatform(url: string): string {
  const host = new URL(url).hostname.toLowerCase()
  if (host.includes('instagram.com')) return 'Instagram'
  if (host.includes('linkedin.com')) return 'LinkedIn'
  if (host.includes('tiktok.com')) return 'TikTok'
  if (host.includes('youtube.com') || host.includes('youtu.be')) return 'YouTube'
  if (host.includes('twitter.com') || host.includes('x.com')) return 'X (Twitter)'
  if (host.includes('facebook.com')) return 'Facebook'
  return 'Web'
}

/**
 * Detect resource type from platform
 */
function detectType(platform: string, url: string): string {
  if (['YouTube', 'TikTok'].includes(platform)) return 'video'
  if (url.includes('webinar') || url.includes('live') || url.includes('event')) return 'webinar'
  return 'article'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const url = body?.url as string

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL manquante.' })
  }

  // Validate URL
  try {
    new URL(url)
  } catch {
    throw createError({ statusCode: 400, message: 'URL invalide.' })
  }

  const platform = detectPlatform(url)

  try {
    // Fetch the page HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CapALIBot/1.0; +https://capali.com)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw createError({ statusCode: 422, message: `Impossible de récupérer la page (HTTP ${response.status}).` })
    }

    const html = await response.text()
    const $ = load(html)

    // Extract Open Graph / meta data
    const ogTitle = $('meta[property="og:title"]').attr('content')
      || $('meta[name="twitter:title"]').attr('content')
      || $('title').text()
      || ''

    const ogDescription = $('meta[property="og:description"]').attr('content')
      || $('meta[name="twitter:description"]').attr('content')
      || $('meta[name="description"]').attr('content')
      || ''

    const ogImage = $('meta[property="og:image"]').attr('content')
      || $('meta[name="twitter:image"]').attr('content')
      || ''

    // Try to extract main content
    let mainContent = ''

    // Platform-specific content extraction
    if (platform === 'LinkedIn') {
      // LinkedIn posts usually have the content in og:description
      mainContent = ogDescription
        ? `<p>${ogDescription.replace(/\n/g, '</p><p>')}</p>`
        : ''
    } else if (platform === 'Instagram') {
      mainContent = ogDescription
        ? `<p>${ogDescription.replace(/\n/g, '</p><p>')}</p>`
        : ''
    } else if (platform === 'YouTube') {
      // YouTube description
      const videoDesc = $('meta[name="description"]').attr('content') || ogDescription
      mainContent = videoDesc
        ? `<p>${videoDesc.replace(/\n/g, '</p><p>')}</p>`
        : ''
      // Also include embed
      const videoId = extractYouTubeId(url)
      if (videoId) {
        mainContent = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;border-radius:12px;"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>\n${mainContent}`
      }
    } else {
      // Generic: try to find article content
      const articleEl = $('article').first()
      if (articleEl.length) {
        // Clean up: remove scripts, styles, nav, footer
        articleEl.find('script, style, nav, footer, .ads, .sidebar').remove()
        mainContent = articleEl.html() || ''
      } else {
        // Fallback: use og:description formatted as HTML
        mainContent = ogDescription
          ? `<p>${ogDescription.replace(/\n/g, '</p><p>')}</p>`
          : ''
      }
    }

    // Build result
    const result: ScrapedData = {
      title: ogTitle.trim(),
      description: ogDescription.trim().slice(0, 500),
      content: mainContent.trim(),
      image: resolveImageUrl(ogImage, url),
      platform,
      type: detectType(platform, url),
    }

    return { data: result }
  } catch (err: any) {
    if (err.statusCode) throw err
    console.error('[scrape] Error:', err.message)
    throw createError({
      statusCode: 422,
      message: 'Impossible de récupérer le contenu de ce lien. Vérifiez l\'URL et réessayez.',
    })
  }
})

/**
 * Extract YouTube video ID from various URL formats
 */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

/**
 * Resolve relative image URLs to absolute
 */
function resolveImageUrl(imageUrl: string, pageUrl: string): string {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  try {
    return new URL(imageUrl, pageUrl).toString()
  } catch {
    return ''
  }
}
