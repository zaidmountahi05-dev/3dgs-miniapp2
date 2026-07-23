const { initLibraryStorage } = require('./utils/services/library-service.js')
const { getLanguage } = require('./utils/i18n.js')

App({
  onLaunch() {
    initLibraryStorage()
    this.globalData.language = getLanguage()
  },

  globalData: {
    language: 'en'
  }
})
