import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { HowLongToBeatService } = require('howlongtobeat')
import { chromium } from 'playwright'

const hltb = new HowLongToBeatService()

const hltbTimeToHours = (timeStr) => {
  if (!timeStr || timeStr === '--') return null
  const hours = parseFloat(timeStr)
  return isNaN(hours) ? null : hours
}

const metacriticSearch = async (gameName) => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })
  const page = await context.newPage()

  try {
    const slug = gameName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    const url = `https://www.metacritic.com/game/${slug}`

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })

    let score = null
    let description = null
    let image = null

    // Score (e.g. 93)
    const scoreEl = await page.$('[data-testid="critic-score-number"]')
    if (scoreEl) {
      const scoreText = await scoreEl.textContent()
      if (scoreText) score = parseInt(scoreText.trim(), 10) || null
    }

    // Description
    const descEl = await page.$('section[data-testid="description"] p')
    if (descEl) {
      description = await descEl.textContent()
    }

    // Cover image — OG image or first image in hero
    const ogImage = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => null)
    image = ogImage

    return { score, description, image }
  } catch (err) {
    console.warn(`Metacritic scrape failed for "${gameName}":`, err.message)
    return { score: null, description: null, image: null }
  } finally {
    await browser.close()
  }
}

export const searchExternalGames = async (query) => {
  try {
    const hltbResults = await hltb.search(query)
    if (!hltbResults || hltbResults.length === 0) return []

    const topResults = hltbResults.slice(0, 5)
    const enriched = []

    for (const game of topResults) {
      const meta = await metacriticSearch(game.name)

      enriched.push({
        name: game.name,
        description: meta.description || '',
        metacritic_score: meta.score,
        hours_to_complete: hltbTimeToHours(game.gameplayMain),
        cover_image_url: meta.image || game.imageUrl || null,
        source_name: 'hltb+metacritic'
      })
    }

    return enriched
  } catch (error) {
    console.error('External search error:', error.message)
    throw new Error('External search service unavailable')
  }
}
