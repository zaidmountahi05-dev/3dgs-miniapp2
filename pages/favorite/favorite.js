const library = require('../../utils/services/library-service.js')
const navigation = require('../../utils/navigation.js')
const { getLanguage, getMessages, applyNavigation, t } = require('../../utils/i18n.js')

Page({
  data: { i18n: {}, countLabel: '', favoriteModels: [] },
  onShow() { this.loadFavorites() },
  onPullDownRefresh() { this.loadFavorites(); wx.stopPullDownRefresh() },
  loadFavorites() {
    const language = getLanguage()
    const favoriteModels = library.getFavoriteModels().map(item => ({ ...item, typeLabel: t('favorites.type', { value: item.type }, language) }))
    this.setData({ i18n: getMessages(language), favoriteModels, countLabel: t('favorites.count', { count: favoriteModels.length }, language) })
    applyNavigation(language, 'favorites.title')
  },
  openModel(e) { navigation.openModel(e.currentTarget.dataset.model && e.currentTarget.dataset.model.sceneId) },
  goToScan() { navigation.goHome() },
  removeFavorite(e) {
    const model = e.currentTarget.dataset.model
    if (!model) return
    wx.showModal({ title: this.data.i18n.favorites.removeTitle, content: t('favorites.removeMessage', { name: model.title }), success: ({ confirm }) => {
      if (!confirm) return
      library.removeFavoriteModel(model.id || model.sceneId); this.loadFavorites(); wx.showToast({ title: this.data.i18n.favorites.removed, icon: 'success' })
    } })
  }
})
