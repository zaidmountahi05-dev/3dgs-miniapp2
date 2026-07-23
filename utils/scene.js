const { DEFAULTS } = require('./constants.js')
const { localizedValue } = require('./i18n.js')

function normalizeScene(model = {}) {
  const sceneId = model.sceneId || model.id || ''

  return {
    id: model.id || sceneId,
    sceneId,
    nfcId: model.nfcId || '',
    title: localizedValue(model.title) || DEFAULTS.VIEWER_TITLE,
    subtitle: localizedValue(model.subtitle),
    thumbnail: model.thumbnail || DEFAULTS.DEFAULT_THUMBNAIL,
    type: model.type || 'gaussian',
    format: model.format || '',
    viewerUrl: model.viewerUrl || '',
    modelUrl: model.modelUrl || '',
    description: localizedValue(model.description),
    rotationDeg: Array.isArray(model.rotationDeg)
      ? model.rotationDeg
      : [0, 0, 0],
    cameraPreset: model.cameraPreset || {
      target: [...DEFAULTS.CAMERA_TARGET],
      distance: DEFAULTS.CAMERA_DISTANCE
    },
    minDistance: model.minDistance,
    maxDistance: model.maxDistance,
    orbitSpeed: model.orbitSpeed || 1,
    tags: Array.isArray(model.tags) ? model.tags.map(localizedValue) : [],
    active: model.active !== false
  }
}

module.exports = {
  normalizeScene
}
