import { chromium } from 'playwright'

const HLTB_URL = 'https://howlongtobeat.com'

const hltbTimeToHours = (seconds) => {
  if (!seconds || seconds <= 0) return null
  return Number((seconds / 3600).toFixed(1))
}

const searchHLTB = async (query) => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })
  const page = await context.newPage()

  try {
    // Intercept the internal HLTB search API call
    const searchApiPromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/search') && resp.request().method() === 'POST',
      { timeout: 15000 }
    )

    await page.goto(`${HLTB_URL}/?q=${encodeURIComponent(query)}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000
    })

    const response = await searchApiPromise
    const payload = await response.json()

    const list = payload?.data || payload?.results || []
    return list.slice(0, 5).map((item) => ({
      name: item.game_name || item.gameName || item.title || '',
      imageUrl: item.game_image || item.image || null,
      gameplayMainSeconds: item.comp_main || item.main_story || null
    }))
  } catch (err) {
    console.warn(`HLTB search failed for "${query}":`, err.message)
    return []
  } finally {
    await browser.close()
  }
}

const metacriticSearch = async (gameName) => {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
    const ogImage = await page
      .$eval('meta[property="og:image"]', (el) => el.content)
      .catch(() => null)
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
    const hltbResults = await searchHLTB(query)
    if (!hltbResults || hltbResults.length === 0) return []

    const enriched = []

    for (const game of hltbResults) {
      const meta = await metacriticSearch(game.name)

      enriched.push({
        name: game.name,
        description: meta.description || '',
        metacritic_score: meta.score,
        hours_to_complete: hltbTimeToHours(game.gameplayMainSeconds),
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
