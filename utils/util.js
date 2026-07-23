// Small synchronous-storage wrapper used by the Mini Program services.

function getStorage(key, fallback = null) {
  try {
    const value = wx.getStorageSync(key)
    return value === '' ? fallback : value
  } catch (error) {
    console.error(`Storage read failed [${key}]:`, error)
    return fallback
  }
}

function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (error) {
    console.error(`Storage write failed [${key}]:`, error)
    return false
  }
}

function initStorage(key, defaultValue) {
  if (getStorage(key, undefined) === undefined) {
    setStorage(key, defaultValue)
  }
}

function addToStorage(key, item, uniqueKey = 'id') {
  const list = getStorage(key, [])
  if (!Array.isArray(list)) return []
  if (list.some(existing => existing[uniqueKey] === item[uniqueKey])) return list

  const next = [item, ...list]
  setStorage(key, next)
  return next
}

function removeFromStorage(key, value, uniqueKey = 'id') {
  const list = getStorage(key, [])
  if (!Array.isArray(list)) return []

  const next = list.filter(item => item[uniqueKey] !== value)
  if (next.length !== list.length) setStorage(key, next)
  return next
}

function existsInStorage(key, value, uniqueKey = 'id') {
  const list = getStorage(key, [])
  return Array.isArray(list) && list.some(item => item[uniqueKey] === value)
}

module.exports = {
  getStorage,
  setStorage,
  initStorage,
  addToStorage,
  removeFromStorage,
  existsInStorage
}
