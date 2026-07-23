const library = require('../../utils/services/library-service.js')
const navigation = require('../../utils/navigation.js')
const { getLanguage, getMessages, applyNavigation, t } = require('../../utils/i18n.js')

Page({
  data: { i18n: {}, countLabel: '', historyModels: [] },
  onShow() { this.loadHistory() },
  onPullDownRefresh() { this.loadHistory(); wx.stopPullDownRefresh() },
  loadHistory() {
    const language = getLanguage()
    const historyModels = library.getViewHistory().map(item => ({ ...item, lastViewedLabel: t('history.lastViewed', { value: this.formatDate(item.lastViewedAt, language) }, language) }))
    this.setData({ i18n: getMessages(language), historyModels, countLabel: t('history.count', { count: historyModels.length }, language) })
    applyNavigation(language, 'history.title')
  },
  formatDate(value, language) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString(language === 'zh-CN' ? 'zh-CN' : 'en-US')
  },
  openModel(e) { navigation.openModel(e.currentTarget.dataset.model && e.currentTarget.dataset.model.sceneId) },
  goToScan() { navigation.goHome() },
  clearHistory() {
    wx.showModal({ title: this.data.i18n.history.clearTitle, content: this.data.i18n.history.clearMessage, success: ({ confirm }) => {
      if (!confirm) return
      library.clearViewHistory(); this.loadHistory(); wx.showToast({ title: this.data.i18n.history.cleared, icon: 'success' })
    } })
  }
})
