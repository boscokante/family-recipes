/**
 * YouTube utility functions for extracting video info and embedding
 */

export interface YouTubeVideoInfo {
  videoId: string
  url: string
  embedUrl: string
  thumbnail: string
  title?: string
  type: 'youtube'
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([^&\n?#]+)$/ // Just the ID itself
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Get YouTube video info from URL
 */
export function getYouTubeInfo(url: string): YouTubeVideoInfo | null {
  const videoId = extractYouTubeId(url)
  if (!videoId) return null

  return {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    type: 'youtube'
  }
}

/**
 * Get fallback thumbnail URL if maxresdefault doesn't exist
 */
export function getYouTubeThumbnailFallback(videoId: string, quality: 'maxres' | 'sd' | 'hq' | 'mq' | 'default' = 'maxres'): string {
  const qualityMap = {
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`
  }
  return qualityMap[quality]
}

/**
 * Validate if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}
