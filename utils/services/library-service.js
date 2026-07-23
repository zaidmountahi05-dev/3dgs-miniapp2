const storage = require('../util.js')
const { STORAGE_KEYS, DEFAULTS, DEFAULT_VIEWER_PREFERENCES } = require('../constants.js')
const { getModelById } = require('../models.js')
const { normalizeScene } = require('../scene.js')

function getModelKey(model = {}) {
  return model.id || model.sceneId || ''
}

function getStoredModels(key) {
  const stored = storage.getStorage(key, [])
  if (!Array.isArray(stored)) return []

  return stored.map((item) => {
    const currentModel = getModelById(getModelKey(item))
    return currentModel
      ? { ...item, ...normalizeScene(currentModel) }
      : item
  })
}

function initLibraryStorage() {
  storage.initStorage(STORAGE_KEYS.VIEW_HISTORY, [])
  storage.initStorage(STORAGE_KEYS.FAVORITES, [])
  storage.initStorage(STORAGE_KEYS.PROFILE, null)
  storage.initStorage(STORAGE_KEYS.VIEWER_PREFERENCES, DEFAULT_VIEWER_PREFERENCES)
}

function getViewHistory() {
  return getStoredModels(STORAGE_KEYS.VIEW_HISTORY)
}

function clearViewHistory() {
  return storage.setStorage(STORAGE_KEYS.VIEW_HISTORY, [])
}

function removeViewedModel(modelId) {
  const history = getViewHistory()
  const next = history.filter(item => getModelKey(item) !== modelId)
  storage.setStorage(STORAGE_KEYS.VIEW_HISTORY, next)
  return next
}

function clearFavorites() {
  return storage.setStorage(STORAGE_KEYS.FAVORITES, [])
}

function getFavoriteModels() {
  return getStoredModels(STORAGE_KEYS.FAVORITES)
}

function addViewedModel(model) {
  const normalized = {
    ...normalizeScene(model),
    lastViewedAt: new Date().toISOString()
  }
  const modelKey = getModelKey(normalized)

  if (!modelKey) return getViewHistory()

  const history = getViewHistory()
  const next = [
    normalized,
    ...history.filter((item) => getModelKey(item) !== modelKey)
  ].slice(0, DEFAULTS.HISTORY_LIMIT)

  storage.setStorage(STORAGE_KEYS.VIEW_HISTORY, next)
  return next
}

function addFavoriteModel(model) {
  const normalized = normalizeScene(model)
  if (!getModelKey(normalized)) return getFavoriteModels()

  return storage.addToStorage(
    STORAGE_KEYS.FAVORITES,
    normalized,
    'id'
  )
}

function removeFavoriteModel(modelId) {
  return storage.removeFromStorage(STORAGE_KEYS.FAVORITES, modelId, 'id')
}

function isFavoriteModel(modelId) {
  return storage.existsInStorage(STORAGE_KEYS.FAVORITES, modelId, 'id')
}

function getUserProfile() {
  const profile = storage.getStorage(STORAGE_KEYS.PROFILE, null)
  if (!profile || typeof profile !== 'object') {
    return {
      name: DEFAULTS.USER_NAME,
      avatar: DEFAULTS.USER_AVATAR
    }
  }
  return {
    name: profile.name || DEFAULTS.USER_NAME,
    avatar: profile.avatar || DEFAULTS.USER_AVATAR
  }
}

function setUserProfile(profile) {
  if (!profile || typeof profile !== 'object') return false

  const next = {
    name: profile.name || DEFAULTS.USER_NAME,
    avatar: profile.avatar || DEFAULTS.USER_AVATAR
  }

  return storage.setStorage(STORAGE_KEYS.PROFILE, next)
}

function getViewerPreferences() {
  const saved = storage.getStorage(STORAGE_KEYS.VIEWER_PREFERENCES, {})
  const preferences = saved && typeof saved === 'object' ? saved : {}
  return { ...DEFAULT_VIEWER_PREFERENCES, ...preferences }
}

function setViewerPreferences(preferences) {
  return storage.setStorage(STORAGE_KEYS.VIEWER_PREFERENCES, {
    ...getViewerPreferences(),
    ...(preferences && typeof preferences === 'object' ? preferences : {})
  })
}

function resetLocalData() {
  clearViewHistory()
  clearFavorites()
  storage.setStorage(STORAGE_KEYS.PROFILE, null)
  storage.setStorage(STORAGE_KEYS.VIEWER_PREFERENCES, DEFAULT_VIEWER_PREFERENCES)
  return true
}

module.exports = {
  initLibraryStorage,
  getViewHistory,
  clearViewHistory,
  removeViewedModel,
  clearFavorites,
  getFavoriteModels,
  addViewedModel,
  addFavoriteModel,
  removeFavoriteModel,
  isFavoriteModel,
  getUserProfile,
  setUserProfile,
  getViewerPreferences,
  setViewerPreferences,
  resetLocalData
}
