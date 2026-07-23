const config = require('../../config/index.js')
const { DEFAULTS } = require('../constants.js')

function detectSceneFormat(scene = {}) {
  if (scene.format) {
    return String(scene.format).toLowerCase()
  }

  const url = String(scene.modelUrl || '').toLowerCase()

  if (url.includes('.ksplat')) return 'ksplat'
  if (url.includes('.splat')) return 'splat'
  if (url.includes('.ply')) return 'ply'

  return 'splat'
}

function buildViewerUrl(scene = {}, options = {}) {
  if (scene.viewerUrl) {
    return scene.viewerUrl
  }

  const base = config.viewerBase
  const format = detectSceneFormat(scene)

  const cameraPreset = scene.cameraPreset || {}
  const target = cameraPreset.target || DEFAULTS.CAMERA_TARGET
  const distance = cameraPreset.distance || DEFAULTS.CAMERA_DISTANCE
  const rotationDeg = scene.rotationDeg || [0, 0, 0]

  const minDistance =
    scene.minDistance ||
    config.defaultCamera.minDistance ||
    Math.max(0.5, distance * 0.3)
  const maxDistance =
    scene.maxDistance ||
    config.defaultCamera.maxDistance ||
    Math.max(20, distance * 10)
  const orbitSpeed = scene.orbitSpeed || config.defaultCamera.orbitSpeed || 1.0
  const language = options.language || 'en'
  const preferences = options.preferences || {}

  const params = [
    `sceneId=${encodeURIComponent(scene.sceneId || scene.id || '')}`,
    `title=${encodeURIComponent(scene.title || DEFAULTS.VIEWER_TITLE)}`,
    `subtitle=${encodeURIComponent(scene.subtitle || '')}`,
    `type=${encodeURIComponent(scene.type || 'gaussian')}`,
    `format=${encodeURIComponent(format)}`,
    `modelUrl=${encodeURIComponent(scene.modelUrl || '')}`,
    `target=${encodeURIComponent(target.join(','))}`,
    `distance=${encodeURIComponent(distance)}`,
    `rotationDeg=${encodeURIComponent(rotationDeg.join(','))}`,
    `minDistance=${encodeURIComponent(minDistance)}`,
    `maxDistance=${encodeURIComponent(maxDistance)}`,
    `orbitSpeed=${encodeURIComponent(orbitSpeed)}`,
    `lang=${encodeURIComponent(language)}`,
    `autoRotate=${encodeURIComponent(Boolean(preferences.autoRotate && !preferences.reducedMotion))}`,
    `reducedMotion=${encodeURIComponent(Boolean(preferences.reducedMotion))}`,
    `showControls=${encodeURIComponent(preferences.showControls !== false)}`,
    `quality=${encodeURIComponent(preferences.quality || 'auto')}`
  ]

  return `${base}?${params.join('&')}`
}

module.exports = {
  buildViewerUrl,
  detectSceneFormat
}
