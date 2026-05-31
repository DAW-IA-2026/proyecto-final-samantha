export const listGames = async (req, res, next) => {
  try {
    const { data, meta } = await (await import('../../useCases/games/index.js')).listGames(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.json({
      data: data.map(gameTransformer),
      meta
    })
  } catch (error) {
    next(error)
  }
}

export const getGame = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/games/index.js')).getGame(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createGame = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/games/index.js')).createGame(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.status(201).json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateGame = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/games/index.js')).updateGame(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteGame = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/games/index.js')).deleteGame(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const completeGame = async (req, res, next) => {
  try {
    const { data } = await (await import('../../useCases/games/index.js')).completeGame(req)
    const { gameTransformer } = await import('../../transformers/games/gameTransformer.js')

    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}
