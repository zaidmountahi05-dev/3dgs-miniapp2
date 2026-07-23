const en = require('./locales/en.js')
const zhCN = require('./locales/zh-CN.js')

const LANGUAGE_KEY = 'languagePreference'
const dictionaries = { en, 'zh-CN': zhCN }

function normalizeLanguage(value) {
  return String(value || '').toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'
}

function detectLanguage() {
  try {
    const info = typeof wx.getAppBaseInfo === 'function' ? wx.getAppBaseInfo() : wx.getSystemInfoSync()
    return normalizeLanguage(info.language)
  } catch (error) {
    return 'en'
  }
}

function getLanguage() {
  try {
    const saved = wx.getStorageSync(LANGUAGE_KEY)
    return saved === 'en' || saved === 'zh-CN' ? saved : detectLanguage()
  } catch (error) {
    return 'en'
  }
}

function setLanguage(language) {
  const normalized = normalizeLanguage(language)
  wx.setStorageSync(LANGUAGE_KEY, normalized)
  return normalized
}

function getValue(object, path) {
  return path.split('.').reduce((value, key) => value && value[key], object)
}

function t(key, variables = {}, language = getLanguage()) {
  const template = getValue(dictionaries[language] || en, key) || getValue(en, key) || key
  return typeof template === 'string' ? template.replace(/\{(\w+)\}/g, (_, name) => variables[name] == null ? '' : String(variables[name])) : template
}

function getErrorMessage(error, fallbackKey = 'model.failed') {
  const key = error && error.code ? `errors.${error.code}` : fallbackKey
  const message = t(key, { details: error && error.details })
  return message === key ? t(fallbackKey) : message
}

function getMessages(language = getLanguage()) {
  return dictionaries[language] || en
}

function localizedValue(value, language = getLanguage()) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value || ''
  return value[language] || value.en || value['zh-CN'] || ''
}

function applyNavigation(language = getLanguage(), titleKey = 'appName') {
  wx.setNavigationBarTitle({ title: t(titleKey, {}, language) })
  ;['tabs.home', 'tabs.history', 'tabs.favorites'].forEach((key, index) => wx.setTabBarItem({ index, text: t(key, {}, language) }))
}

module.exports = { LANGUAGE_KEY, getLanguage, setLanguage, t, getMessages, localizedValue, getErrorMessage, applyNavigation }
