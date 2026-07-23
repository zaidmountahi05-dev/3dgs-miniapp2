const { getSceneById } = require('../../utils/services/model-service.js')
const { buildViewerUrl } = require('../../utils/viewer/url-builder.js')
const library = require('../../utils/services/library-service.js')
const { getLanguage, getMessages, getErrorMessage, applyNavigation, t } = require('../../utils/i18n.js')

Page({
  data: { i18n: {}, sceneId: '', scene: null, loading: true, error: '', isFavorite: false, webviewUrl: '', typeLabel: '', idLabel: '', descriptionLabel: '' },

  async onLoad(options) {
    const sceneId = options.sceneId ? decodeURIComponent(options.sceneId) : ''
    this.applyLocale()
    if (!sceneId) return this.setData({ loading: false, error: t('model.missingId') })
    this.setData({ sceneId })
    await this.loadScene(sceneId)
  },

  onShow() {
    this.applyLocale()
    if (this.data.sceneId && this.data.scene) this.loadScene(this.data.sceneId, false)
  },

  applyLocale() {
    const language = getLanguage()
    this.setData({ i18n: getMessages(language) })
    applyNavigation(language)
  },

  async loadScene(sceneId, showLoading = true) {
    try {
      if (showLoading) this.setData({ loading: true, error: '' })
      const scene = await getSceneById(sceneId)
      if (showLoading) library.addViewedModel(scene)
      const key = scene.id || scene.sceneId
      this.setData({ scene, loading: false, error: '', isFavorite: library.isFavoriteModel(key), webviewUrl: buildViewerUrl(scene, { language: getLanguage(), preferences: library.getViewerPreferences() }), typeLabel: t('model.type', { value: scene.type }), idLabel: t('model.sceneId', { value: scene.sceneId }), descriptionLabel: t('model.description', { value: scene.description }) })
      wx.setNavigationBarTitle({ title: scene.title })
    } catch (error) {
      console.error('Model loading failed:', error)
      this.setData({ loading: false, error: getErrorMessage(error) })
    }
  },

  toggleFavorite() {
    const { scene, isFavorite } = this.data
    if (!scene) return
    const key = scene.id || scene.sceneId
    if (isFavorite) library.removeFavoriteModel(key)
    else library.addFavoriteModel(scene)
    this.setData({ isFavorite: !isFavorite })
    wx.showToast({ title: t(isFavorite ? 'model.removed' : 'model.added'), icon: 'success' })
  },

  onViewerMessage(e) {
    const messages = e.detail.data || []
    const payload = Array.isArray(messages) ? messages[messages.length - 1] : messages
    if (!payload || typeof payload !== 'object') return
    if (payload.type === 'viewer-ready') wx.showToast({ title: t('model.ready'), icon: 'none' })
    if (payload.type === 'viewer-error') wx.showToast({ title: t('model.renderFailed'), icon: 'none' })
  },

  retryLoad() { if (this.data.sceneId) this.loadScene(this.data.sceneId) },
  onShareAppMessage() {
    const scene = this.data.scene
    return scene ? { title: scene.title, path: `/pages/model/model?sceneId=${encodeURIComponent(scene.sceneId)}` } : { title: t('model.shareTitle'), path: '/pages/index/index' }
  }
})
