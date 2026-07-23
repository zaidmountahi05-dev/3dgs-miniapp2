// Local scene catalog used when config.useMock is true.
// Text fields may be plain strings or localized objects with `en` and `zh-CN`.

const MODELS = [
  {
    id: 'scene_001',
    sceneId: 'scene_001',
    nfcId: '04A2247B8C1180',
    title: {
      en: 'My R2 Model',
      'zh-CN': '我的 R2 模型'
    },
    subtitle: {
      en: 'Cloudflare R2 PLY',
      'zh-CN': 'Cloudflare R2 PLY 模型'
    },
    description: {
      en: 'Model hosted on Cloudflare R2',
      'zh-CN': '托管在 Cloudflare R2 上的模型'
    },
    thumbnail: '/images/default-avatar.png',
    type: 'gaussian',
    format: 'ply',
    viewerUrl: '',
    modelUrl: 'https://pub-ba71342c948a4e5d9e3cb1fa33f125a8.r2.dev/point_cloud.ply',
    rotationDeg: [180, 0, 0],
    minDistance: 1.2,
    maxDistance: 8,
    orbitSpeed: 1.2,
    cameraPreset: {
      target: [0, 1.2, 0],
      distance: 3.5
    },
    tags: ['r2', 'ply'],
    active: true,
    sortOrder: 1
  },
  {
    id: 'scene_002',
    sceneId: 'scene_002',
    nfcId: '123456',
    title: {
      en: 'Cactus Model',
      'zh-CN': '仙人掌模型'
    },
    subtitle: {
      en: 'Cloudflare R2 SPLAT',
      'zh-CN': 'Cloudflare R2 SPLAT 模型'
    },
    description: {
      en: 'Cactus splat model hosted on Cloudflare R2',
      'zh-CN': '托管在 Cloudflare R2 上的仙人掌高斯泼溅模型'
    },
    thumbnail: '/images/default-avatar.png',
    type: 'gaussian',
    format: 'splat',
    viewerUrl: '',
    modelUrl: 'https://pub-ba71342c948a4e5d9e3cb1fa33f125a8.r2.dev/cactus_splat3_25kSteps_2M_splats.splat',
    rotationDeg: [180, 0, 0],
    minDistance: 1.2,
    maxDistance: 8,
    orbitSpeed: 1.2,
    cameraPreset: {
      target: [0, 1, 0],
      distance: 3
    },
    tags: ['r2', 'splat', 'cactus'],
    active: true,
    sortOrder: 2
  }
]

function normalizeId(value) {
  return String(value || '').trim()
}

function normalizeNfcId(value) {
  return normalizeId(value).toUpperCase()
}

function getAllModels() {
  return MODELS
    .filter(model => model.active !== false)
    .sort((a, b) => (a.sortOrder || 9999) - (b.sortOrder || 9999))
}

function getModelById(sceneId) {
  const id = normalizeId(sceneId)
  if (!id) return null

  return MODELS.find(model => (
    model.active !== false &&
    (normalizeId(model.id) === id || normalizeId(model.sceneId) === id)
  )) || null
}

function getModelByNfcId(nfcId) {
  const id = normalizeNfcId(nfcId)
  if (!id) return null

  return MODELS.find(model => (
    model.active !== false && normalizeNfcId(model.nfcId) === id
  )) || null
}

module.exports = {
  MODELS,
  getAllModels,
  getModelById,
  getModelByNfcId
}
