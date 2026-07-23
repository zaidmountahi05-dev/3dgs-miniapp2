// utils/constants.js — runtime constants derived from config/index.js.
//
// Do not put deployment-specific literals here; add them to config/index.js
// and read them from this file if needed by other modules.

const config = require('../config/index.js')

const STORAGE_KEYS = {
  VIEW_HISTORY: config.storageKeys.viewHistory,
  FAVORITES: config.storageKeys.favorites,
  PROFILE: config.storageKeys.profile,
  VIEWER_PREFERENCES: config.storageKeys.viewerPreferences
}

const DEFAULTS = {
  USER_NAME: config.defaultUser.name,
  USER_AVATAR: config.defaultUser.avatar,
  VIEWER_TITLE: config.viewerTitle,
  CAMERA_TARGET: config.defaultCamera.target,
  CAMERA_DISTANCE: config.defaultCamera.distance,
  DEFAULT_THUMBNAIL: config.defaultThumbnail,
  HISTORY_LIMIT: config.historyLimit
}

const DEFAULT_VIEWER_PREFERENCES = config.defaultViewerPreferences

const AVATARS = [
  '/images/avatar_01.png',
  '/images/avatar_02.png',
  '/images/avatar_03.png',
  '/images/avatar_04.png',
  '/images/avatar_05.png',
  '/images/avatar_06.png',
  '/images/avatar_07.png',
  '/images/avatar_08.png',
  '/images/avatar_09.png',
  '/images/avatar_10.png',
  '/images/avatar_11.png',
  '/images/avatar_12.png'
]

module.exports = {
  STORAGE_KEYS,
  DEFAULTS,
  DEFAULT_VIEWER_PREFERENCES,
  AVATARS
}
