const { getSceneById } = require('../../utils/services/model-service.js')
const library = require('../../utils/services/library-service.js')
const navigation = require('../../utils/navigation.js')
const { getLanguage, getMessages, getErrorMessage, t } = require('../../utils/i18n.js')

Page({
  data: { i18n: {}, sceneId: '', scene: null, loading: true, error: '', isFavorite: false, typeLabel: '', formatLabel: '', idLabel: '' },

  async onLoad(options) {
    const sceneId = options.sceneId ? decodeURIComponent(options.sceneId) : ''
    this.setData({ sceneId })
    await this.loadScene()
  },

  async onShow() {
    if (this.data.sceneId && this.data.scene) await this.loadScene(false)
  },

  async loadScene(showLoading = true) {
    const language = getLanguage()
    this.setData({ i18n: getMessages(language), loading: showLoading, error: '' })
    try {
      const scene = await getSceneById(this.data.sceneId)
      const key = scene.id || scene.sceneId
      this.setData({ scene, loading: false, isFavorite: library.isFavoriteModel(key), typeLabel: t('model.type', { value: scene.type }), formatLabel: t('model.format', { value: String(scene.format || '').toUpperCase() }), idLabel: t('model.sceneId', { value: scene.sceneId }) })
      wx.setNavigationBarTitle({ title: t('model.detailsTitle') })
    } catch (error) {
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

  openViewer() { navigation.openModel(this.data.sceneId) },
  retryLoad() { this.loadScene() }
})
