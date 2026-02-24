import * as cheerio from 'cheerio'
import { YoutubeTranscript } from 'youtube-transcript'

const IGNORED_DOMAINS = [
  'instagram.com', 'facebook.com', 'twitter.com', 'x.com', 'tiktok.com',
  'patreon.com', 'ko-fi.com', 'amazon.com', 'amzn.to', 'youtube.com',
  'youtu.be', 'paypal.com', 'venmo.com', 'linktr.ee', 'seed.com', 'bit.ly',
  'goo.gl', 'tinyurl.com', 'merch', 'shop'
]

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex)
  return matches || []
}

/**
 * Tries to fetch the transcript for a YouTube video.
 * Returns empty string if it fails (common due to YouTube anti-bot).
 */
export async function fetchTranscriptSafe(videoIdOrUrl: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoIdOrUrl)
    if (!transcript || transcript.length === 0) return ""
    return transcript.map(t => t.text).join(' ')
  } catch (e) {
    console.warn("Could not fetch transcript:", e instanceof Error ? e.message : String(e))
    return ""
  }
}

/**
 * Looks for links in the description that might be the full recipe.
 * Fetches the content of the first likely link.
 */
export async function fetchRecipeLinkIfNeeded(description: string): Promise<string> {
  // If the description already contains a substantial amount of text and "ingredients", 
  // we might not need to fetch an external link to save time/errors.
  const hasIngredients = /ingredients/i.test(description)
  if (hasIngredients && description.length > 500) {
    return "" // Assume description has enough info
  }

  const urls = extractUrls(description)
  const candidateUrls = urls.filter(url => {
    try {
      const parsed = new URL(url)
      const domain = parsed.hostname.toLowerCase()
      // ensure domain is not in the ignored list
      return !IGNORED_DOMAINS.some(ignored => domain.includes(ignored))
    } catch {
      return false
    }
  })

  // Try fetching the candidates until we get a substantial payload
  for (const url of candidateUrls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      if (!res.ok) continue

      const html = await res.text()
      const $ = cheerio.load(html)
      
      // Remove noisy elements
      $('script, style, nav, header, footer, iframe, img, svg, noscript, [role="navigation"], [role="banner"], [role="contentinfo"]').remove()
      
      const text = $('body').text().replace(/\s+/g, ' ').trim()
      
      // If we got substantial text, return it
      if (text.length > 500) {
        return `[Content from linked recipe at ${url}]:\n` + text.substring(0, 15000) // cap to ~15k chars to avoid token limits
      }
    } catch (e) {
      console.warn("Failed to fetch potential recipe link:", url, e instanceof Error ? e.message : String(e))
    }
  }

  return ""
}
