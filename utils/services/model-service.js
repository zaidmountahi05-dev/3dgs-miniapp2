const config = require('../../config/index.js')
const { normalizeScene } = require('../scene.js')
const catalog = require('../models.js')

const REQUEST_TIMEOUT_MS = 10000

function createSceneError(code, details = '') {
  const error = new Error(code)
  error.code = code
  error.details = details
  return error
}

function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({ timeout: REQUEST_TIMEOUT_MS, ...options, success: resolve, fail: reject })
  })
}

function validateResponse(response) {
  if (!response || typeof response.statusCode !== 'number') {
    throw createSceneError('invalidResponse')
  }
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw createSceneError('apiError', String(response.statusCode))
  }
  return response.data || {}
}

async function fetchScene(endpoint, identifier) {
  const response = await request({
    url: `${config.apiBase}${endpoint}${encodeURIComponent(identifier)}`,
    method: 'GET',
    header: { 'Content-Type': 'application/json' }
  })
  return normalizeScene(validateResponse(response))
}

async function getSceneById(sceneId) {
  if (!sceneId) throw createSceneError('missingSceneId')

  if (config.useMock) {
    const model = catalog.getModelById(sceneId)
    if (!model) throw createSceneError('modelNotFound')
    return normalizeScene(model)
  }

  return fetchScene(config.apiEndpoints.sceneById || '/api/scenes/', sceneId)
}

async function getSceneByNfcId(nfcId) {
  if (!nfcId) throw createSceneError('missingNfcId')

  if (config.useMock) {
    const model = catalog.getModelByNfcId(nfcId)
    if (!model) throw createSceneError('nfcModelNotFound')
    return normalizeScene(model)
  }

  return fetchScene(config.apiEndpoints.sceneByNfcId || '/api/scenes/by-nfc/', nfcId)
}

function getAllScenes() {
  return catalog.getAllModels().map(normalizeScene)
}

module.exports = { getSceneById, getSceneByNfcId, getAllScenes }
