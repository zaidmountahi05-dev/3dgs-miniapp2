const fs = require('fs')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function createWxMock(store) {
  return {
    getStorageSync: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : '',
    setStorageSync: (key, value) => { store[key] = value },
    getAppBaseInfo: () => ({ language: 'en' })
  }
}

function testPageFiles() {
  const app = JSON.parse(fs.readFileSync('app.json', 'utf8'))
  for (const page of app.pages) {
    for (const extension of ['js', 'json', 'wxml', 'wxss']) {
      assert(fs.existsSync(`${page}.${extension}`), `Missing ${page}.${extension}`)
    }
  }
  return app.pages.length
}

function testLibraryService(store) {
  global.wx = createWxMock(store)
  const library = require('../utils/services/library-service.js')

  library.initLibraryStorage()
  library.addViewedModel({ id: 'test-scene', title: 'Test' })
  library.addViewedModel({ id: 'test-scene', title: 'Test' })
  assert(library.getViewHistory().length === 1, 'History should be deduplicated')

  library.addFavoriteModel({ id: 'test-scene', title: 'Test' })
  assert(library.isFavoriteModel('test-scene'), 'Favorite should be added')

  library.removeViewedModel('test-scene')
  assert(library.getViewHistory().length === 0, 'History item should be removed')
}

function testNfcParser() {
  const { parseNFCData } = require('../utils/services/nfc-service.js')
  const toBuffer = value => Uint8Array.from(Buffer.from(value)).buffer
  const json = parseNFCData({ message: toBuffer('{"sceneId":"scene_001"}') })
  const text = parseNFCData({ message: toBuffer('ab12') })

  assert(json.sceneId === 'scene_001', 'JSON NFC scene ID should be parsed')
  assert(text.nfcId === 'AB12', 'Plain NFC ID should be normalized')
}

function testLocales() {
  const en = require('../utils/locales/en.js')
  const zh = require('../utils/locales/zh-CN.js')
  const collectKeys = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) => {
    const path = `${prefix}${key}`
    return value && typeof value === 'object' && !Array.isArray(value)
      ? collectKeys(value, `${path}.`)
      : [path]
  })

  const englishKeys = collectKeys(en)
  const chineseKeys = collectKeys(zh)
  assert(englishKeys.every(key => chineseKeys.includes(key)), 'Chinese locale is missing keys')
  assert(chineseKeys.every(key => englishKeys.includes(key)), 'English locale is missing keys')
}

function testLocalizationAndViewerUrl(store) {
  store.languagePreference = 'zh-CN'
  const i18n = require('../utils/i18n.js')
  const { normalizeScene } = require('../utils/scene.js')
  const { MODELS } = require('../data/catalog.js')
  const { buildViewerUrl } = require('../utils/viewer/url-builder.js')
  const scene = normalizeScene(MODELS[1])

  assert(scene.title === '仙人掌模型', 'Chinese scene title should be selected')
  assert(i18n.getErrorMessage({ code: 'modelNotFound' }) === '未找到模型', 'Error should be localized')

  const url = buildViewerUrl(scene, {
    language: 'zh-CN',
    preferences: {
      autoRotate: true,
      showControls: false,
      quality: 'performance'
    }
  })

  for (const value of ['lang=zh-CN', 'autoRotate=true', 'showControls=false', 'quality=performance']) {
    assert(url.includes(value), `Viewer URL is missing ${value}`)
  }
}

function testModuleLoading() {
  global.Page = () => {}
  global.App = () => {}

  require('../app.js')
  const pageDirectories = fs.readdirSync('pages')
  for (const page of pageDirectories) {
    require(`../pages/${page}/${page}.js`)
  }
}

function run() {
  const store = {}
  const pageCount = testPageFiles()
  testLibraryService(store)
  testNfcParser()
  testLocales()
  testLocalizationAndViewerUrl(store)
  testModuleLoading()
  console.log(`Smoke tests passed (${pageCount} pages)`)
}

run()
