const config = require('../../config/index.js')
const { compareVersion } = require('../../utils/version.js')
const sceneService = require('../../utils/services/model-service.js')
const library = require('../../utils/services/library-service.js')
const { parseNFCData } = require('../../utils/services/nfc-service.js')
const {
  getLanguage,
  getMessages,
  getErrorMessage,
  applyNavigation,
  t
} = require('../../utils/i18n.js')
const navigation = require('../../utils/navigation.js')

function addFavoriteState(model) {
  const key = model.id || model.sceneId
  return { ...model, isFavorite: library.isFavoriteModel(key) }
}

Page({
  data: {
    i18n: {},
    stats: {},
    userInfo: {},
    nfcSupported: false,
    scanning: false,
    loading: false,
    lastError: '',
    searchQuery: '',
    recentModels: [],
    favoriteModels: [],
    allModels: [],
    filteredModels: []
  },

  onLoad() {
    this.setData({ nfcSupported: wx.canIUse('startHCE') })
  },

  onShow() {
    this.applyLocale()
    this.loadPageData()
  },

  onHide() {
    this.stopNFCReading()
  },

  onUnload() {
    this.stopNFCReading()
  },

  applyLocale() {
    const language = getLanguage()
    this.setData({ i18n: getMessages(language) })
    applyNavigation(language)
  },

  loadPageData() {
    const recentModels = library.getViewHistory().map(addFavoriteState)
    const favoriteModels = library.getFavoriteModels().map(addFavoriteState)
    const allModels = sceneService.getAllScenes().map(addFavoriteState)

    this.setData({
      recentModels,
      favoriteModels,
      allModels,
      userInfo: library.getUserProfile(),
      stats: {
        recent: t('home.recentCount', { count: recentModels.length }),
        favorites: t('home.favoriteCount', { count: favoriteModels.length }),
        all: t('home.allCount', { count: allModels.length })
      }
    })
    this.filterModels(this.data.searchQuery)
  },

  onSearchInput(event) {
    const searchQuery = event.detail.value || ''
    this.setData({ searchQuery })
    this.filterModels(searchQuery)
  },

  clearSearch() {
    this.setData({ searchQuery: '' })
    this.filterModels('')
  },

  filterModels(query) {
    const needle = String(query || '').trim().toLowerCase()
    const filteredModels = needle
      ? this.data.allModels.filter(model => {
        const searchableText = [
          model.title,
          model.subtitle,
          model.description,
          ...(model.tags || [])
        ].join(' ').toLowerCase()
        return searchableText.includes(needle)
      })
      : this.data.allModels

    this.setData({ filteredModels })
  },

  openSettings() {
    navigation.openSettings()
  },

  openModel(event) {
    const model = event.currentTarget.dataset.model
    navigation.openModel(model && model.sceneId)
  },

  openDescription(event) {
    const model = event.currentTarget.dataset.model
    navigation.openDescription(model && model.sceneId)
  },

  toggleFavorite(event) {
    this.updateFavorite(event.currentTarget.dataset.model)
  },

  updateFavorite(model) {
    if (!model) return

    const key = model.id || model.sceneId
    const wasFavorite = library.isFavoriteModel(key)
    if (wasFavorite) library.removeFavoriteModel(key)
    else library.addFavoriteModel(model)

    wx.showToast({
      title: t(wasFavorite ? 'model.removed' : 'model.added'),
      icon: 'success'
    })
    this.loadPageData()
  },

  showModelActions(event) {
    const model = event.currentTarget.dataset.model
    const source = event.currentTarget.dataset.source
    if (!model) return

    const key = model.id || model.sceneId
    const actions = [
      {
        label: t('home.viewDescription'),
        run: () => navigation.openDescription(model.sceneId)
      },
      {
        label: t(library.isFavoriteModel(key) ? 'home.removeFavorite' : 'home.addFavorite'),
        run: () => this.updateFavorite(model)
      }
    ]

    if (source === 'recent') {
      actions.push({
        label: t('home.removeHistory'),
        run: () => {
          library.removeViewedModel(key)
          this.loadPageData()
          wx.showToast({ title: t('home.removedHistory'), icon: 'success' })
        }
      })
    }

    wx.showActionSheet({
      alertText: t('home.actions'),
      itemList: actions.map(action => action.label),
      success: ({ tapIndex }) => {
        if (actions[tapIndex]) actions[tapIndex].run()
      }
    })
  },

  startNFCReading() {
    if (this.data.scanning) return
    if (!wx.canIUse('startHCE')) {
      wx.showToast({ title: t('home.nfcUnsupported'), icon: 'none' })
      return
    }

    let appInfo
    try {
      appInfo = typeof wx.getAppBaseInfo === 'function'
        ? wx.getAppBaseInfo()
        : wx.getSystemInfoSync()
    } catch (error) {
      this.showNfcError('home.systemInfoFailed', error)
      return
    }

    if (compareVersion(appInfo.SDKVersion, '2.15.0') < 0) {
      wx.showToast({ title: t('home.wechatOld'), icon: 'none' })
      return
    }

    wx.startHCE({
      aid_list: config.nfcAidList,
      success: () => {
        this.setData({ scanning: true, lastError: '' })
        this.bindNFCListener()
        wx.showToast({ title: t('home.approachTag'), icon: 'none' })
      },
      fail: error => this.showNfcError('home.nfcStartFailed', error)
    })
  },

  showNfcError(key, error) {
    const message = t(key)
    console.error(message, error)
    this.setData({ lastError: message })
    wx.showToast({ title: message, icon: 'none' })
  },

  bindNFCListener() {
    if (this._nfcHandler) return
    this._nfcHandler = response => this.handleNFCMessage(response)
    wx.onHCEMessage(this._nfcHandler)
  },

  stopNFCReading() {
    if (this._nfcHandler && typeof wx.offHCEMessage === 'function') {
      wx.offHCEMessage(this._nfcHandler)
    }
    this._nfcHandler = null

    if (!this.data.scanning) return
    if (typeof wx.stopHCE === 'function') {
      wx.stopHCE({ complete: () => this.setData({ scanning: false }) })
    } else {
      this.setData({ scanning: false })
    }
  },

  async handleNFCMessage(response) {
    if (this._handlingNfc) return
    this._handlingNfc = true

    try {
      this.setData({ loading: true, lastError: '' })
      const parsed = parseNFCData(response)
      let scene = null

      if (parsed.nfcId) scene = await sceneService.getSceneByNfcId(parsed.nfcId)
      else if (parsed.sceneId) scene = await sceneService.getSceneById(parsed.sceneId)
      else throw new Error(t('home.invalidTag'))

      library.addViewedModel({
        ...scene,
        nfcId: parsed.nfcId || scene.nfcId || ''
      })
      this.stopNFCReading()
      navigation.openModel(scene.sceneId)
    } catch (error) {
      const message = error.code
        ? getErrorMessage(error, 'home.readFailed')
        : error.message || t('home.readFailed')
      console.error(message, error)
      this.setData({ lastError: message })
      wx.showToast({ title: message, icon: 'none' })
    } finally {
      this._handlingNfc = false
      this.setData({ loading: false })
    }
  }
})
