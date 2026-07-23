const config = require('../../config/index.js')
const { AVATARS } = require('../../utils/constants.js')
const {
  LANGUAGE_KEY,
  getLanguage,
  setLanguage,
  getMessages,
  applyNavigation
} = require('../../utils/i18n.js')
const library = require('../../utils/services/library-service.js')

const QUALITY_VALUES = ['auto', 'performance', 'high']

Page({
  data: {
    language: 'en',
    i18n: {},
    userInfo: {},
    preferences: {},
    avatars: AVATARS,
    avatarPickerVisible: false,
    qualityOptions: [],
    qualityIndex: 0,
    appVersion: config.appVersion
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const language = getLanguage()
    const i18n = getMessages(language)
    const preferences = library.getViewerPreferences()

    this.setData({
      language,
      i18n,
      preferences,
      userInfo: library.getUserProfile(),
      qualityOptions: [
        i18n.settings.qualityAuto,
        i18n.settings.qualityPerformance,
        i18n.settings.qualityHigh
      ],
      qualityIndex: Math.max(0, QUALITY_VALUES.indexOf(preferences.quality))
    })
    applyNavigation(language, 'settings.title')
  },

  changeLanguage(event) {
    const language = setLanguage(event.currentTarget.dataset.language)
    getApp().globalData.language = language
    this.refresh()
  },

  changeNickname() {
    wx.showModal({
      title: this.data.i18n.settings.changeNickname,
      editable: true,
      content: this.data.userInfo.name,
      success: ({ confirm, content }) => {
        const name = String(content || '').trim()
        if (!confirm || !name) return
        library.setUserProfile({ ...this.data.userInfo, name })
        this.refresh()
      }
    })
  },

  openAvatarPicker() {
    this.setData({ avatarPickerVisible: true })
  },

  closeAvatarPicker() {
    this.setData({ avatarPickerVisible: false })
  },

  noop() {},

  selectAvatar(event) {
    const avatar = AVATARS[event.currentTarget.dataset.index]
    if (!avatar) return

    library.setUserProfile({ ...this.data.userInfo, avatar })
    this.setData({ avatarPickerVisible: false })
    this.refresh()
  },

  changeToggle(event) {
    const key = event.currentTarget.dataset.key
    library.setViewerPreferences({ [key]: event.detail.value })
    this.refresh()
  },

  changeQuality(event) {
    const quality = QUALITY_VALUES[Number(event.detail.value)] || 'auto'
    library.setViewerPreferences({ quality })
    this.refresh()
  },

  confirmAction(title, content, action) {
    wx.showModal({
      title,
      content,
      success: ({ confirm }) => {
        if (!confirm) return
        action()
        wx.showToast({ title: this.data.i18n.settings.done, icon: 'success' })
        this.refresh()
      }
    })
  },

  clearHistory() {
    this.confirmAction(
      this.data.i18n.history.clearTitle,
      this.data.i18n.history.clearMessage,
      library.clearViewHistory
    )
  },

  clearFavorites() {
    this.confirmAction(
      this.data.i18n.settings.clearFavoritesTitle,
      this.data.i18n.settings.clearFavoritesMessage,
      library.clearFavorites
    )
  },

  resetAll() {
    this.confirmAction(
      this.data.i18n.settings.resetTitle,
      this.data.i18n.settings.resetMessage,
      () => {
        library.resetLocalData()
        wx.removeStorageSync(LANGUAGE_KEY)
        getApp().globalData.language = getLanguage()
      }
    )
  }
})
