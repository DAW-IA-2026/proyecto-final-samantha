import { listGames, getGame, createGame, updateGame, deleteGame, completeGame } from '../../useCases/games/index.js'
import { gameTransformer } from '../../transformers/games/gameTransformer.js'

export const listGamesCtrl = async (req, res, next) => {
  try {
    const { data, meta } = await listGames(req)
    res.json({ data: data.map(gameTransformer), meta })
  } catch (error) {
    next(error)
  }
}

export const getGameCtrl = async (req, res, next) => {
  try {
    const { data } = await getGame(req)
    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const createGameCtrl = async (req, res, next) => {
  try {
    const { data } = await createGame(req)
    res.status(201).json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const updateGameCtrl = async (req, res, next) => {
  try {
    const { data } = await updateGame(req)
    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const deleteGameCtrl = async (req, res, next) => {
  try {
    const { data } = await deleteGame(req)
    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}

export const completeGameCtrl = async (req, res, next) => {
  try {
    const { data } = await completeGame(req)
    res.json({ data: gameTransformer(data) })
  } catch (error) {
    next(error)
  }
}
