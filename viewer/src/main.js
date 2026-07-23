import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d'
import { createTranslator } from './locales.js'

// ---------------------------------------------------------------------------
// Viewer defaults — change these constants for your deployment without
// touching the rendering logic below.
// These values are overridden by URL query parameters when the Mini Program
// opens the web-view.
// ---------------------------------------------------------------------------
const VIEWER_CONFIG = {
  defaultTitle: '3D Model Viewer',
  defaultSubtitle: 'Loading...',
  defaultTarget: [0, 1.2, 0],
  defaultDistance: 3.5,
  defaultRotationDeg: [0, 0, 0],
  defaultFormat: 'splat',
  cameraFov: 65,
  cameraNear: 0.1,
  cameraFar: 1000,
  controlsDampingFactor: 0.08,
  controlsRotateSpeed: 0.9,
  controlsZoomSpeed: 1.0,
  autoRotateSpeed: 2.0,
  cameraReportThrottleMs: 500
}

const root = document.getElementById('viewer')
const statusEl = document.getElementById('status')
const titleEl = document.getElementById('title')
const subtitleEl = document.getElementById('subtitle')
const toolbarEl = document.getElementById('toolbar')
const toggleUiBtn = document.getElementById('toggle-ui-btn')
const autoRotateBtn = document.getElementById('autorotate-btn')
const orbitBtn = document.getElementById('orbit-btn')
const distanceSlider = document.getElementById('distance-slider')
const progressBar = document.getElementById('progress-bar')
const helpBtn = document.getElementById('help-btn')
const fullscreenBtn = document.getElementById('fullscreen-btn')
const helpPanel = document.getElementById('help-panel')
const helpCloseBtn = document.getElementById('help-close-btn')
const helpTitle = document.getElementById('help-title')
const helpCopy = document.getElementById('help-copy')

const params = new URLSearchParams(window.location.search)

const language = params.get('lang') === 'zh-CN' ? 'zh-CN' : 'en'
const tr = createTranslator(language)
document.documentElement.lang = language

const modelUrl = params.get('modelUrl') || ''
const format = (params.get('format') || detectFormatFromUrl(modelUrl)).toLowerCase()
const sceneId = params.get('sceneId') || 'unknown-scene'
const title = params.get('title') || VIEWER_CONFIG.defaultTitle
const subtitle = params.get('subtitle') || sceneId
const target = parseVector(params.get('target'), VIEWER_CONFIG.defaultTarget)
const distance = parseNumber(params.get('distance'), VIEWER_CONFIG.defaultDistance)
const rotationDeg = parseVector(params.get('rotationDeg'), VIEWER_CONFIG.defaultRotationDeg)
const minDistance = parseNumber(
  params.get('minDistance'),
  Math.max(0.5, distance * 0.3)
)
const maxDistance = parseNumber(
  params.get('maxDistance'),
  Math.max(20, distance * 10)
)
const orbitSpeed = parseNumber(params.get('orbitSpeed'), 1.0)
const autoRotateDefault = params.get('autoRotate') === 'true'
const reducedMotion = params.get('reducedMotion') === 'true'
const showControls = params.get('showControls') !== 'false'
const requestedQuality = params.get('quality')
const quality = ['performance', 'high'].includes(requestedQuality)
  ? requestedQuality
  : 'auto'

document.querySelectorAll('[data-i18n]').forEach(element => {
  element.textContent = tr(element.dataset.i18n)
})
toggleUiBtn.textContent = showControls ? tr('hide') : tr('show')
helpBtn.textContent = tr('help')
fullscreenBtn.textContent = tr('fullscreen')
helpTitle.textContent = tr('helpTitle')
helpCopy.textContent = tr('helpCopy')
toolbarEl.classList.toggle('hidden', !showControls)
setStatus(tr('loading'))

function detectFormatFromUrl(url) {
  const value = String(url || '').toLowerCase()

  if (value.includes('.ksplat')) return 'ksplat'
  if (value.includes('.splat')) return 'splat'
  if (value.includes('.ply')) return 'ply'

  return VIEWER_CONFIG.defaultFormat
}

function toSceneFormat(nextFormat) {
  if (nextFormat === 'ply') return GaussianSplats3D.SceneFormat.Ply
  if (nextFormat === 'ksplat') return GaussianSplats3D.SceneFormat.KSplat
  return GaussianSplats3D.SceneFormat.Splat
}

function eulerDegreesToQuaternion(deg) {
  const [x, y, z] = deg.map((v) => THREE.MathUtils.degToRad(Number(v || 0)))
  const q = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(x, y, z, 'XYZ')
  )
  return [q.x, q.y, q.z, q.w]
}

titleEl.textContent = title
subtitleEl.textContent = subtitle

let viewer = null
let renderer = null
let camera = null
let controls = null
let animationHandle = 0

const state = {
  target: new THREE.Vector3(...target),
  baseDistance: distance,
  autoRotate: autoRotateDefault && !reducedMotion,
  scriptedOrbit: false,
  orbitAngle: 0,
  orbitSpeed,
  disposed: false,
  immersive: false,
  uiBound: false
}

init().catch((error) => {
  console.error(error)
  setStatus(`${tr('failed')}: ${error.message || error}`)
  postMiniProgramMessage({
    type: 'viewer-error',
    message: error.message || String(error)
  })
})

async function init() {
  if (!modelUrl) {
    throw new Error('Missing modelUrl in query string')
  }

  setStage(tr('creating'), 15)

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance'
  })
  const pixelRatioLimit = quality === 'performance' ? 1 : quality === 'high' ? 2 : 1.5
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit))
  renderer.setSize(root.clientWidth, root.clientHeight)
  root.appendChild(renderer.domElement)

  camera = new THREE.PerspectiveCamera(
    VIEWER_CONFIG.cameraFov,
    root.clientWidth / root.clientHeight,
    VIEWER_CONFIG.cameraNear,
    VIEWER_CONFIG.cameraFar
  )

  camera.position.set(
    state.target.x,
    state.target.y,
    state.target.z + state.baseDistance
  )
  camera.lookAt(state.target)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.copy(state.target)
  controls.enableDamping = true
  controls.dampingFactor = VIEWER_CONFIG.controlsDampingFactor
  controls.enablePan = true
  controls.enableZoom = true
  controls.enableRotate = true
  controls.screenSpacePanning = true
  controls.rotateSpeed = VIEWER_CONFIG.controlsRotateSpeed
  controls.panSpeed = 0.8
  controls.zoomSpeed = VIEWER_CONFIG.controlsZoomSpeed
  controls.minDistance = minDistance
  controls.maxDistance = maxDistance
  controls.autoRotate = state.autoRotate
  controls.autoRotateSpeed = VIEWER_CONFIG.autoRotateSpeed * state.orbitSpeed
  controls.update()

  // Bind controls before the remote model download so every button responds
  // immediately, even on a slow mobile connection.
  bindUI()
  bindResize()
  updateModeButtons()

  if (distanceSlider) {
    distanceSlider.min = String(minDistance)
    distanceSlider.max = String(maxDistance)
    distanceSlider.step = '0.1'
    distanceSlider.value = String(state.baseDistance)
  }

  setStage(`${tr('loadingScene')} (${format})…`, 40)

  viewer = new GaussianSplats3D.Viewer({
    selfDrivenMode: false,
    renderer,
    camera,
    useBuiltInControls: false,
    ignoreDevicePixelRatio: false,
    gpuAcceleratedSort: false,
    sharedMemoryForWorkers: false,
    integerBasedSort: false,
    halfPrecisionCovariancesOnGPU: true,
    dynamicScene: false,
    renderMode: GaussianSplats3D.RenderMode.Always,
    sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
    antialiased: false,
    focalAdjustment: 1.0,
    logLevel: GaussianSplats3D.LogLevel.None,
    sphericalHarmonicsDegree: 0,
    enableOptionalEffects: false
  })

  await viewer.addSplatScene(modelUrl, {
    format: toSceneFormat(format),
    rotation: eulerDegreesToQuaternion(rotationDeg),
    showLoadingUI: true,
    splatAlphaRemovalThreshold: 5,
    progressiveLoad: true
  })

  animate()

  updateModeButtons()
  setStage(tr('ready'), 100)
  postMiniProgramMessage({
    type: 'viewer-ready',
    sceneId,
    modelUrl
  })
}

function animate() {
  if (state.disposed) return

  animationHandle = requestAnimationFrame(animate)
  if (document.hidden) return

  if (state.scriptedOrbit) {
    updateScriptedOrbit()
  } else {
    controls.autoRotate = state.autoRotate
    controls.update()
  }

  if (viewer) {
    viewer.update()
    viewer.render()
  }

  throttledCameraReport()
}

function updateScriptedOrbit() {
  if (!state.scriptedOrbit) return

  state.orbitAngle += 0.01 * state.orbitSpeed

  const r = state.baseDistance
  const x = state.target.x + Math.cos(state.orbitAngle) * r
  const z = state.target.z + Math.sin(state.orbitAngle) * r
  const y = camera.position.y

  camera.position.set(x, y, z)
  camera.lookAt(state.target)
  controls.target.copy(state.target)
}

function setOrbitDistance(nextDistance) {
  const clamped = THREE.MathUtils.clamp(
    nextDistance,
    controls.minDistance,
    controls.maxDistance
  )

  const direction = new THREE.Vector3()
    .subVectors(camera.position, controls.target)
    .normalize()

  camera.position.copy(
    controls.target.clone().add(direction.multiplyScalar(clamped))
  )

  state.baseDistance = clamped
  controls.update()

  if (distanceSlider) {
    distanceSlider.value = String(clamped)
  }

  setStatus(`${tr('distance')}: ${round(clamped)}`)
}

function bindResize() {
  window.addEventListener('resize', () => {
    if (!camera || !renderer) return
    camera.aspect = root.clientWidth / root.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(root.clientWidth, root.clientHeight)
  })
}

function bindUI() {
  if (state.uiBound) return
  state.uiBound = true

  if (toolbarEl) {
    toolbarEl.addEventListener('click', (event) => {
      const button = event.target.closest('button')
      if (!button) return

      const preset = button.dataset.preset
      if (!preset) return

      applyPreset(preset)
    })
  }

  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      state.autoRotate = !state.autoRotate
      state.scriptedOrbit = false

      updateModeButtons()
      setStatus(`${tr('autoRotate')}: ${tr(state.autoRotate ? 'on' : 'off')}`)
    })
  }

  if (orbitBtn) {
    orbitBtn.addEventListener('click', () => {
      state.scriptedOrbit = !state.scriptedOrbit
      state.autoRotate = false

      updateModeButtons()
      setStatus(`${tr('orbit')}: ${tr(state.scriptedOrbit ? 'on' : 'off')}`)
    })
  }

  if (distanceSlider) {
    distanceSlider.addEventListener('input', (event) => {
      setOrbitDistance(Number(event.target.value))
    })
  }

  if (toggleUiBtn) {
    toggleUiBtn.addEventListener('click', () => {
      const hidden = toolbarEl ? toolbarEl.classList.toggle('hidden') : false
      toggleUiBtn.textContent = hidden ? tr('show') : tr('hide')
    })
  }

  helpBtn.addEventListener('click', () => helpPanel.classList.remove('hidden'))
  helpCloseBtn.addEventListener('click', () => helpPanel.classList.add('hidden'))
  fullscreenBtn.addEventListener('click', toggleFullscreen)
  document.addEventListener('fullscreenchange', syncFullscreenButton)
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen()
      return
    }
  } catch (error) {
    console.warn('Fullscreen is unavailable:', error)
  }

  toggleImmersiveMode()
}

function toggleImmersiveMode() {
  state.immersive = !state.immersive
  document.body.classList.toggle('immersive', state.immersive)
  fullscreenBtn.textContent = state.immersive
    ? tr('exitFullscreen')
    : tr('fullscreen')
  setStatus(tr(state.immersive ? 'immersiveOn' : 'immersiveOff'))
}

function syncFullscreenButton() {
  const isFullscreen = Boolean(document.fullscreenElement)
  fullscreenBtn.textContent = isFullscreen || state.immersive
    ? tr('exitFullscreen')
    : tr('fullscreen')
}

function updateModeButtons() {
  if (autoRotateBtn) {
    autoRotateBtn.textContent = `${tr('autoRotate')}: ${tr(state.autoRotate ? 'on' : 'off')}`
    autoRotateBtn.classList.toggle('active', state.autoRotate)
  }
  if (orbitBtn) {
    orbitBtn.textContent = `${tr('orbit')}: ${tr(state.scriptedOrbit ? 'on' : 'off')}`
    orbitBtn.classList.toggle('active', state.scriptedOrbit)
  }
}

function applyPreset(name) {
  const next = getPresetPosition(name, state.target, state.baseDistance)
  if (!next) return

  state.scriptedOrbit = false
  state.autoRotate = false

  if (orbitBtn) {
    orbitBtn.textContent = `${tr('orbit')}: ${tr('off')}`
  }

  if (autoRotateBtn) {
    autoRotateBtn.textContent = `${tr('autoRotate')}: ${tr('off')}`
  }

  camera.position.copy(next.position)
  controls.target.copy(next.target)
  controls.update()

  setStatus(tr('switched', { name: tr(name) }))
  postMiniProgramMessage({
    type: 'camera-preset',
    preset: name,
    camera: serializeCamera()
  })
}

function getPresetPosition(name, targetVec, baseDistance) {
  const d = baseDistance

  if (name === 'front') {
    return {
      position: new THREE.Vector3(targetVec.x, targetVec.y, targetVec.z + d),
      target: targetVec.clone()
    }
  }

  if (name === 'left') {
    return {
      position: new THREE.Vector3(targetVec.x - d, targetVec.y, targetVec.z),
      target: targetVec.clone()
    }
  }

  if (name === 'right') {
    return {
      position: new THREE.Vector3(targetVec.x + d, targetVec.y, targetVec.z),
      target: targetVec.clone()
    }
  }

  if (name === 'top') {
    return {
      position: new THREE.Vector3(
        targetVec.x,
        targetVec.y + d,
        targetVec.z + 0.001
      ),
      target: targetVec.clone()
    }
  }

  if (name === 'reset') {
    return {
      position: new THREE.Vector3(targetVec.x, targetVec.y, targetVec.z + d),
      target: targetVec.clone()
    }
  }

  return null
}

function serializeCamera() {
  return {
    position: {
      x: round(camera.position.x),
      y: round(camera.position.y),
      z: round(camera.position.z)
    },
    target: {
      x: round(controls.target.x),
      y: round(controls.target.y),
      z: round(controls.target.z)
    },
    distance: round(camera.position.distanceTo(controls.target))
  }
}

let lastCameraSentAt = 0
function throttledCameraReport() {
  const now = performance.now()
  if (now - lastCameraSentAt < VIEWER_CONFIG.cameraReportThrottleMs) return
  lastCameraSentAt = now

  postMiniProgramMessage({
    type: 'camera-changed',
    camera: serializeCamera()
  })
}

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message
  }
}

function setStage(message, progress) {
  setStatus(message)
  if (progressBar) progressBar.style.width = `${progress}%`
}

function parseVector(value, fallback) {
  if (!value) return fallback
  const parts = value.split(',').map((v) => Number(v.trim()))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return fallback
  }
  return parts
}

function parseNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function round(n) {
  return Math.round(n * 1000) / 1000
}

function postMiniProgramMessage(payload) {
  try {
    if (window.wx && window.wx.miniProgram && window.wx.miniProgram.postMessage) {
      window.wx.miniProgram.postMessage({ data: payload })
      return
    }
  } catch (error) {
    console.warn('wx.miniProgram.postMessage failed:', error)
  }

  try {
    if (window.parent) {
      window.parent.postMessage(payload, '*')
    }
  } catch (error) {
    console.warn('window.parent.postMessage failed:', error)
  }
}

window.addEventListener('beforeunload', () => {
  state.disposed = true
  cancelAnimationFrame(animationHandle)

  if (controls) {
    controls.dispose()
  }

  if (viewer && typeof viewer.dispose === 'function') {
    viewer.dispose()
  }

  if (renderer) {
    renderer.dispose()
  }
})
